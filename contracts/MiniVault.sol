// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MiniVault {
    address public owner;

    mapping(address => uint256) public balances;

    event Deposited(address indexed from, uint256 amount, uint256 newBalance);
    event Withdrawn(address indexed to, uint256 amount, uint256 newBalance);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    function deposit() external payable {
        require(msg.value > 0, "Send ETH");
        balances[msg.sender] += msg.value;
        emit Deposited(msg.sender, msg.value, balances[msg.sender]);
    }

    function withdrawMyFunds(uint256 amount) external {
        require(balances[msg.sender] >= amount, "Not enough balance");

        // CHECKS
        balances[msg.sender] -= amount;

        // INTERACTIONS
        (bool ok, ) = payable(msg.sender).call{value: amount}("");
        require(ok, "Withdraw failed");

        emit Withdrawn(msg.sender, amount, balances[msg.sender]);
    }

    function ownerWithdraw(uint256 amount) external onlyOwner {
        require(amount <= address(this).balance, "Insufficient vault balance");

        (bool ok, ) = payable(owner).call{value: amount}("");
        require(ok, "Withdraw failed");

        emit Withdrawn(msg.sender, amount, balances[msg.sender]);
    }

    function vaultBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
