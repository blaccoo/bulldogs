// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract RscUsdtEarn {
    address public owner;
    address public usdtTokenAddress; // Address of the USDT token
    uint256 public registrationFee = 3 * 10 ** 18; // $3 USDT with 18 decimals
    uint256 public ownerShare = 4; // 4% for the owner wallet
    uint256 public lastRewardDistribution;

    struct User {
        address referrer;
        uint256 referrals;
        uint256 level;
        uint256 earned; // Total rewards earned
        bool activatedEarnings; // True if user has at least one referral
    }

    mapping(address => User) public users;
    mapping(uint256 => address[]) public levels; // Track users in each level

    uint256 public totalIncomePool;

    event Registered(address indexed user, address indexed referrer);
    event ReferralPaid(address indexed referrer, uint256 amount);
    event RewardsDistributed(uint256 totalDistributed);
    event Withdrawal(address indexed user, uint256 amount);
    event LevelUpgraded(address indexed user, uint256 newLevel);
    event Received(address indexed sender, uint256 amount);
    event Sent(address indexed recipient, uint256 amount);


    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    constructor(address _usdtTokenAddress) {
        owner = msg.sender;
        usdtTokenAddress = _usdtTokenAddress;
        lastRewardDistribution = block.timestamp;
    }

  receive() external payable {
        emit Received(msg.sender, msg.value);
    }

    function joinNetwork(address _referrer) external {
        require(users[msg.sender].referrer == address(0), "Already registered");
        require(IERC20(usdtTokenAddress).transferFrom(msg.sender, address(this), registrationFee), "Payment failed");

        // Process the referral
        if (_referrer != address(0) && _referrer != msg.sender) {
            users[_referrer].referrals++;
            users[_referrer].activatedEarnings = true; // Activate lifetime earnings for the referrer
            
            // Determine the referrer's new level
            uint256 newReferrerLevel = determineLevel(users[_referrer].referrals);

            // Only add the referrer to the new level if their level has changed
            if (users[_referrer].level != newReferrerLevel) {
                // Remove the referrer from the old level
                _removeUserFromLevel(_referrer, users[_referrer].level);

                // Update the referrer's level
                users[_referrer].level = newReferrerLevel;
                levels[newReferrerLevel].push(_referrer); // Add to the new level
            }

            payReferralReward(_referrer);
        }

        // Register the user
        users[msg.sender].referrer = _referrer;
        uint256 newLevel = determineLevel(users[msg.sender].referrals);
        users[msg.sender].level = newLevel;

        totalIncomePool += (registrationFee * 50) / 100; // 50% of fee goes to the income pool

        emit Registered(msg.sender, _referrer);
    }

    function upgradeLevel(uint256 _desiredLevel) external {
        require(_desiredLevel >= 1 && _desiredLevel <= 5, "Invalid level");
        require(users[msg.sender].referrals >= 1, "Must invite at least one person to activate earnings");
        require(users[msg.sender].level < _desiredLevel, "Already at this level or higher");

        uint256 requiredPayment = calculateLevelCost(_desiredLevel);
        require(IERC20(usdtTokenAddress).transferFrom(msg.sender, address(this), requiredPayment), "Payment failed");

        // Remove the user from the old level
        _removeUserFromLevel(msg.sender, users[msg.sender].level);

        // Update the user's level
        users[msg.sender].level = _desiredLevel;

        // Add the user to the new level
        levels[_desiredLevel].push(msg.sender);

        totalIncomePool += requiredPayment;

        emit LevelUpgraded(msg.sender, _desiredLevel);
    }

    function calculateLevelCost(uint256 _level) public pure returns (uint256) {
        if (_level == 2) return 30 * 10 ** 18; // $30
        if (_level == 3) return 300 * 10 ** 18; // $300
        if (_level == 4) return 3000 * 10 ** 18; // $3000
        if (_level == 5) return 30000 * 10 ** 18; // $30,000
        return 0;
    }

    function payReferralReward(address _referrer) internal {
        uint256 reward = (registrationFee * 50) / 100; // 5% referral reward
        users[_referrer].earned += reward; // Add reward to referrer's earned balance
        emit ReferralPaid(_referrer, reward);
    }

    function distributeRewards() external onlyOwner {
        // require(block.timestamp >= lastRewardDistribution + 1 days, "Rewards can only be distributed every 24 hours");
        uint256 totalToDistribute = totalIncomePool;
        
        uint256 ownerCut = (totalToDistribute * ownerShare) / 100;
        totalIncomePool -= ownerCut;
        require(IERC20(usdtTokenAddress).transfer(owner, ownerCut), "Owner payment failed");
       
        uint256 remainingPool = totalToDistribute - ownerCut;

        // Distribute rewards across levels
        for (uint256 level = 1; level <= 5; level++) {
            uint256 share = calculateLevelShare(level);
            uint256 levelReward = (remainingPool * share) / 100;

            address[] memory levelUsers = levels[level];
            if (levelUsers.length > 0) {
                uint256 rewardPerUser = levelReward / levelUsers.length;
                for (uint256 i = 0; i < levelUsers.length; i++) {
                    users[levelUsers[i]].earned += rewardPerUser; // Add rewards to user's earned balance
                    totalIncomePool -= rewardPerUser;
                }
            }
        }
       

        lastRewardDistribution = block.timestamp;

        emit RewardsDistributed(totalToDistribute);
    }

    function withdrawRewards(uint256 amount) external {
        require(amount > 0, "Withdraw amount must be greater than zero");
        require(users[msg.sender].earned >= amount, "Insufficient earned rewards");

        // Deduct the withdrawn amount from the user's earned balance
        users[msg.sender].earned -= amount;

        // Transfer the specified amount to the user
        require(IERC20(usdtTokenAddress).transfer(msg.sender, amount), "Withdrawal failed");

        emit Withdrawal(msg.sender, amount);
    }

    function determineLevel(uint256 _referrals) internal pure returns (uint256) {
        if (_referrals >= 1 && _referrals <= 9) return 1;
        if (_referrals >= 10 && _referrals <= 99) return 2;
        if (_referrals >= 100 && _referrals <= 999) return 3;
        if (_referrals >= 1000 && _referrals <= 9999) return 4;
        if (_referrals >= 10000) return 5;
        return 0;
    }

    function calculateLevelShare(uint256 _level) internal pure returns (uint256) {
        if (_level == 1) return 16; // 16% for Level 1
        if (_level == 2) return 18; // 18% for Level 2
        if (_level == 3) return 20; // 20% for Level 3
        if (_level == 4) return 22;  // 22% for Level 4
        if (_level == 5) return 24;  // 24% for Level 5
        return 0;
    }

    function _removeUserFromLevel(address _user, uint256 _level) internal {
        // Find and remove the user from the specified level
        address[] storage levelUsers = levels[_level];
        for (uint256 i = 0; i < levelUsers.length; i++) {
            if (levelUsers[i] == _user) {
                // Move the last user to the current position and pop the last element
                levelUsers[i] = levelUsers[levelUsers.length - 1];
                levelUsers.pop();
                break;
            }
        }
    }

    function getUsersInLevel(uint256 _level) external view returns (address[] memory) {
        require(_level >= 1 && _level <= 5, "Invalid level");
        return levels[_level];
    }

        function sendEther(address payable _recipient, uint256 _amount) external onlyOwner {
        require(address(this).balance >= _amount, "Insufficient Ether balance");
        (bool success, ) = _recipient.call{value: _amount}("");
        require(success, "Ether transfer failed");
        emit Sent(_recipient, _amount);
    }
}
