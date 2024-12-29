// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 value) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 value) external returns (bool);
    function transferFrom(address from, address to, uint256 value) external returns (bool);
}

interface IPancakeSwapV2 { 
    function getAmountsOut(uint256 amountIn, address[] calldata path) external view returns (uint256[] memory amounts);
    function swapExactTokensForTokens(uint256 amountIn, uint256 amountOutMin, address[] calldata path, address to, uint256 deadline) external returns (uint256[] memory amounts);
} 

interface IPancakeSwapV3 {
    function flash(address sender, uint256 amount0, uint256 amount1, bytes calldata data) external;
}

contract KLPTArbitrageTrading {
    address public owner;
    IERC20 public ercToken;
    IPancakeSwapV2 public pancakeV2;
    IPancakeSwapV3 public pancakeV3;

    struct Token {
        uint256 id;
        string name;
        address tokenAddress;
    }

    struct Exchange {
        uint256 id;
        string name;
        address exchangeAddress;
    }

    struct TradingPlan {
        uint256 tokenNumber;
        uint256 amount;
        string planName;
        uint256 exchangeNumber;
        uint256 duration; // Duration in days
        uint256 purchasedDate;
        uint256[] userTokens; // Array to store tokens
        uint256[] userExchanges; // Array to store exchanges
    }

    mapping(address => TradingPlan[]) public userTradingPlans;
    TradingPlan[] public TradingPlans;
    uint256 public totalPlans;

    mapping(uint256 => Token) public availableTokens;
    mapping(uint256 => Exchange) public availableExchanges;
    uint256 public tokenCounter;
    uint256 public exchangeCounter;

    uint256 public transactionFee; // Transaction fee in ETH
    bool private locked; // Mutex to prevent reentrancy

    event TradingPlanPurchased(address indexed user, uint256 planIndex, uint256 purchasedDate);
    event TradingPlanAdded(uint256 planIndex);
    event TradingPlanUpdated(uint256 planIndex);
    event TokenAdded(uint256 id, string name, address tokenAddress);
    event TokenUpdated(uint256 id, string name, address tokenAddress);
    event ExchangeAdded(uint256 id, string name, address exchangeAddress);
    event ExchangeUpdated(uint256 id, string name, address exchangeAddress);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    event TransactionFeeUpdated(uint256 newTransactionFee);
    event EtherWithdrawn(address indexed beneficiary, uint256 amount);
    event UserTokensUpdated(address indexed user, uint256[] updatedTokens);
    event UserExchangesUpdated(address indexed user, uint256[] updatedExchanges);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier noReentrancy() {
        require(!locked, "Reentrant call");
        locked = true;
        _;
        locked = false;
    }

    constructor(address _ercTokenAddress, address _pancakeV2Address, address _pancakeV3Address) {
        owner = msg.sender;
        ercToken = IERC20(_ercTokenAddress);
        pancakeV2 = IPancakeSwapV2(_pancakeV2Address);
        pancakeV3 = IPancakeSwapV3(_pancakeV3Address);
        transactionFee = 0; // Initialize transaction fee to zero
        tokenCounter = 0;
        exchangeCounter = 0;
    }

    receive() external payable {}

    function hasActivePlan(address _user) internal view returns (bool) {
        uint256 currentTime = block.timestamp;
        TradingPlan[] memory userPlans = userTradingPlans[_user];
        
        for (uint256 i = 0; i < userPlans.length; i++) {
            if (userPlans[i].purchasedDate + userPlans[i].duration * 1 days > currentTime) {
                return true;
            }
        }
        
        return false;
    }

    function setTransactionFee(uint256 _newTransactionFee) external onlyOwner {
        transactionFee = _newTransactionFee;
        emit TransactionFeeUpdated(_newTransactionFee);
    }

    function addToken(string memory _name, address _tokenAddress) external onlyOwner {
        tokenCounter++;
        availableTokens[tokenCounter] = Token({
            id: tokenCounter,
            name: _name,
            tokenAddress: _tokenAddress
        });
        emit TokenAdded(tokenCounter, _name, _tokenAddress);
    }

    function updateToken(uint256 _id, string memory _name, address _tokenAddress) external onlyOwner {
        require(availableTokens[_id].id != 0, "Token does not exist");
        availableTokens[_id].name = _name;
        availableTokens[_id].tokenAddress = _tokenAddress;
        emit TokenUpdated(_id, _name, _tokenAddress);
    }

    function addExchange(string memory _name, address _exchangeAddress) external onlyOwner {
        exchangeCounter++;
        availableExchanges[exchangeCounter] = Exchange({
            id: exchangeCounter,
            name: _name,
            exchangeAddress: _exchangeAddress
        });
        emit ExchangeAdded(exchangeCounter, _name, _exchangeAddress);
    }

    function updateExchange(uint256 _id, string memory _name, address _exchangeAddress) external onlyOwner {
        require(availableExchanges[_id].id != 0, "Exchange does not exist");
        availableExchanges[_id].name = _name;
        availableExchanges[_id].exchangeAddress = _exchangeAddress;
        emit ExchangeUpdated(_id, _name, _exchangeAddress);
    }

    function buyTradingPlan(
        uint256 _planIndex, 
        uint256 _amount, 
        uint256[] memory _selectedTokenIds, 
        uint256[] memory _selectedExchangeIds
    ) 
        external payable noReentrancy returns (bool) 
    {
        require(_planIndex < totalPlans, "Invalid plan index");
        require(msg.value >= transactionFee, "Transaction fee not enough");
        require(!hasActivePlan(msg.sender), "User has an active plan");

        TradingPlan storage plan = TradingPlans[_planIndex];
        require(plan.amount == _amount, "Invalid plan amount");
        require(ercToken.balanceOf(msg.sender) >= _amount, "Insufficient balance");

        // Ensure the number of selected tokens and exchanges match the plan requirements
        require(_selectedTokenIds.length == plan.tokenNumber, "Invalid number of tokens selected");
        require(_selectedExchangeIds.length == plan.exchangeNumber, "Invalid number of exchanges selected");

        // Transfer ERC tokens from the user to the contract
        require(ercToken.transferFrom(msg.sender, address(this), _amount), "Token transfer failed");
        payable(owner).transfer(msg.value);

        // Add the selected tokens and exchanges to the user's plan
        uint256[] memory userTokens = new uint256[](_selectedTokenIds.length);
        uint256[] memory userExchanges = new uint256[](_selectedExchangeIds.length);

        for (uint256 i = 0; i < _selectedTokenIds.length; i++) {
            require(availableTokens[_selectedTokenIds[i]].id != 0, "Invalid token id");
            userTokens[i] = _selectedTokenIds[i];
        }

        for (uint256 i = 0; i < _selectedExchangeIds.length; i++) {
            require(availableExchanges[_selectedExchangeIds[i]].id != 0, "Invalid exchange id");
            userExchanges[i] = _selectedExchangeIds[i];
        }

        // Add the Trading plan to the user's plans
        userTradingPlans[msg.sender].push(TradingPlan({
            tokenNumber: plan.tokenNumber,
            amount: _amount,
            planName: plan.planName, 
            exchangeNumber: plan.exchangeNumber,
            duration: plan.duration,
            purchasedDate: block.timestamp,
            userTokens: userTokens,
            userExchanges: userExchanges
        }));

        emit TradingPlanPurchased(msg.sender, _planIndex, block.timestamp);
        return true;
    }

    function addTradingPlan(uint256 _tokenNumber, uint256 _amount, string memory _planName, uint256 _exchangeNumber, uint256 _duration) 
        external onlyOwner noReentrancy 
    {
        TradingPlans.push(TradingPlan({
            tokenNumber: _tokenNumber,
            amount: _amount,
            planName: _planName,
            exchangeNumber: _exchangeNumber,
            duration: _duration,
            purchasedDate: 0,
            userTokens: new uint256[](_tokenNumber),
            userExchanges: new uint256[](_exchangeNumber)
        }));

        totalPlans = TradingPlans.length;
        emit TradingPlanAdded(totalPlans);
    }

    function updateTradingPlan(uint256 _planIndex, uint256 _tokenNumber, uint256 _amount, string memory _planName, uint256 _exchangeNumber, uint256 _duration) 
        external onlyOwner noReentrancy 
    {
        require(_planIndex < totalPlans, "Invalid plan index");
        
        TradingPlan storage plan = TradingPlans[_planIndex];
        plan.tokenNumber = _tokenNumber;
        plan.amount = _amount;
        plan.planName = _planName;
        plan.exchangeNumber = _exchangeNumber;
        plan.duration = _duration;

        emit TradingPlanUpdated(_planIndex);
    }

    function updateUserTokens(uint256[] memory _newTokenIds) external noReentrancy {
        TradingPlan[] storage plans = userTradingPlans[msg.sender];
        for (uint256 i = 0; i < plans.length; i++) {
            plans[i].userTokens = _newTokenIds;
        }
        emit UserTokensUpdated(msg.sender, _newTokenIds);
    }

    function updateUserExchanges(uint256[] memory _newExchangeIds) external noReentrancy {
        TradingPlan[] storage plans = userTradingPlans[msg.sender];
        for (uint256 i = 0; i < plans.length; i++) {
            plans[i].userExchanges = _newExchangeIds;
        }
        emit UserExchangesUpdated(msg.sender, _newExchangeIds);
    }

    function executeArbitrage(address user) external noReentrancy {
        require(hasActivePlan(user), "User has no active plan");

        uint256 planCount = userTradingPlans[user].length;
        for (uint256 i = 0; i < planCount; i++) {
            TradingPlan memory plan = userTradingPlans[user][i];
            
            uint256 tokenCount = plan.userTokens.length;
            uint256 exchangeCount = plan.userExchanges.length;

            for (uint256 j = 0; j < tokenCount; j++) {
                address token = availableTokens[plan.userTokens[j]].tokenAddress;

                for (uint256 k = 0; k < exchangeCount; k++) {
                    for (uint256 l = k + 1; l < exchangeCount; l++) {
                        uint256 price1 = getTokenPrice(availableExchanges[plan.userExchanges[k]].exchangeAddress, token);
                        uint256 price2 = getTokenPrice(availableExchanges[plan.userExchanges[l]].exchangeAddress, token);

                        // If there's a price difference, execute arbitrage
                        if (price1 != price2) {
                            uint256 flashLoanAmount = plan.amount;
                            bytes memory data = abi.encode(user, availableExchanges[plan.userExchanges[k]].exchangeAddress, availableExchanges[plan.userExchanges[l]].exchangeAddress, token);

                            // Take a flash loan from PancakeSwap V3
                            pancakeV3.flash(address(this), flashLoanAmount, 0, data);
                        }
                    }
                }
            }
        }
    }

    function pancakeV3FlashCallback(
        uint256 fee0,
        uint256 fee1,
        bytes calldata data
    ) external {
        (address user, address exchange1, address exchange2, address token) = abi.decode(data, (address, address, address, address));

        uint256 amountIn = ercToken.balanceOf(address(this));

        // Buy low on exchange1
        address[] memory path = new address[](2);
        path[0] = token;
        path[1] = address(ercToken);

        uint256 amountOutBefore = IPancakeSwapV2(exchange1).getAmountsOut(amountIn, path)[1];
        IPancakeSwapV2(exchange1).swapExactTokensForTokens(amountIn, 0, path, address(this), block.timestamp + 1);

        // Sell high on exchange2
        uint256 amountOutAfter = IPancakeSwapV2(exchange2).getAmountsOut(amountIn, path)[1];
        IPancakeSwapV2(exchange2).swapExactTokensForTokens(amountIn, 0, path, address(this), block.timestamp + 1);

        // Calculate the profit
        uint256 profit = amountOutAfter - amountIn - fee0;

        // Repay the flash loan with fees
        ercToken.transfer(address(pancakeV3), amountIn + fee0);

        // Transfer the profit to the user
        if (profit > 0) {
            ercToken.transfer(user, profit);
        }
    }

    function getTokenPrice(address exchange, address token) internal view returns (uint256) {
        // Implement the logic to get the price from the exchange
        // This is a placeholder, adjust based on your actual exchange interface
        address[] memory path = new address[](2);
        path[0] = token;
        path[1] = address(ercToken);
        uint256[] memory amounts = IPancakeSwapV2(exchange).getAmountsOut(1e18, path);
        return amounts[1];
    }

    function withdrawEther(uint256 amount) external onlyOwner {
        payable(owner).transfer(amount);
        emit EtherWithdrawn(owner, amount);
    }
}
