// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function balanceOf(address a) external view returns (uint256);
}

contract TokenFaucet {
    IERC20 public token;
    address public owner;

    uint256 public claimAmount;
    uint256 public cooldown;

    bool public paused;

    mapping(address => uint256) public lastClaimAt;

    event Claimed(address indexed user, uint256 amount);
    event Funded(address indexed from, uint256 amount);
    event ConfigUpdated(uint256 claimAmount, uint256 cooldown);
    event Paused(bool paused);
    event Rescue(address indexed to, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier notPaused() {
        require(!paused, "Paused");
        _;
    }

    constructor(address tokenAddress, uint256 _claimAmount, uint256 _cooldown) {
        owner = msg.sender;
        token = IERC20(tokenAddress);
        claimAmount = _claimAmount;
        cooldown = _cooldown;
        paused = false;
    }

    function setConfig(uint256 _claimAmount, uint256 _cooldown) external onlyOwner {
        claimAmount = _claimAmount;
        cooldown = _cooldown;
        emit ConfigUpdated(_claimAmount, _cooldown);
    }

    function setPaused(bool _paused) external onlyOwner {
        paused = _paused;
        emit Paused(_paused);
    }

    function claim() external notPaused {
        require(block.timestamp >= lastClaimAt[msg.sender] + cooldown, "Cooldown active");

        lastClaimAt[msg.sender] = block.timestamp;

        require(token.transfer(msg.sender, claimAmount), "Token transfer failed");

        emit Claimed(msg.sender, claimAmount);
    }

    function faucetBalance() external view returns (uint256) {
        return token.balanceOf(address(this));
    }

    // Owner can rescue remaining tokens if needed (ops safety)
    function rescue(address to, uint256 amount) external onlyOwner {
        require(token.transfer(to, amount), "Rescue transfer failed");
        emit Rescue(to, amount);
    }
}
