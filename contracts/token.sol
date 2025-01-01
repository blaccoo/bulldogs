// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Interface of the ERC20 standard as defined in the EIP.
interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}
 
// Implementation of the ERC20 standard 
contract MyERC20Token is IERC20 {
    string public name = "KLPTAI"; // Token name
    string public symbol = "KLPTAI";  // Token symbol
    uint8 public decimals = 18;    // Decimals (commonly 18 for ERC20 tokens)
    uint256 private _totalSupply;  // Total supply of tokens

    // Mapping from addresses to balances
    mapping(address => uint256) private _balances;

    // Mapping from owner to spender to allowed amount
    mapping(address => mapping(address => uint256)) private _allowances;

    // Constructor to set the initial supply and assign it to the deployer
    constructor(uint256 initialSupply) {
        _totalSupply = initialSupply * (10 ** uint256(decimals)); // Adjust initial supply to include decimals
        _balances[msg.sender] = _totalSupply; // Assign all tokens to the deployer
        emit Transfer(address(0), msg.sender, _totalSupply); // Emit transfer event for minting
    }

    // Return the total supply of the token
    function totalSupply() external view override returns (uint256) {
        return _totalSupply;
    }

    // Return the balance of a specific account
    function balanceOf(address account) external view override returns (uint256) {
        return _balances[account];
    }

    // Transfer tokens to a recipient
    function transfer(address recipient, uint256 amount) external override returns (bool) {
        require(recipient != address(0), "ERC20: transfer to the zero address");
        require(_balances[msg.sender] >= amount, "ERC20: transfer amount exceeds balance");

        _balances[msg.sender] -= amount;
        _balances[recipient] += amount;
        emit Transfer(msg.sender, recipient, amount);

        return true;
    }

    // Approve a spender to use a specific amount of the owner's tokens
    function approve(address spender, uint256 amount) external override returns (bool) {
        require(spender != address(0), "ERC20: approve to the zero address");

        _allowances[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);

        return true;
    }

    // Return the remaining number of tokens that a spender is allowed to spend
    function allowance(address owner, address spender) external view override returns (uint256) {
        return _allowances[owner][spender];
    }

    // Transfer tokens from one account to another
    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external override returns (bool) {
        require(sender != address(0), "ERC20: transfer from the zero address");
        require(recipient != address(0), "ERC20: transfer to the zero address");
        require(_balances[sender] >= amount, "ERC20: transfer amount exceeds balance");
        require(_allowances[sender][msg.sender] >= amount, "ERC20: transfer amount exceeds allowance");

        _balances[sender] -= amount;
        _balances[recipient] += amount;
        _allowances[sender][msg.sender] -= amount;

        emit Transfer(sender, recipient, amount);

        return true;
    }
}
