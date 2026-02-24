// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

interface IERC20U {
    function transfer(address to, uint256 amount) external returns (bool);
    function balanceOf(address a) external view returns (uint256);
}

contract TokenFaucetUpgradeable is Initializable, OwnableUpgradeable {
    IERC20U public token;
    uint256 public claimAmount;
    uint256 public cooldown;
    bool public paused;

    mapping(address => uint256) public lastClaimAt;

    event Claimed(address indexed user, uint256 amount);
    event ConfigUpdated(uint256 claimAmount, uint256 cooldown);
    event Paused(bool paused);

    function initialize(address tokenAddress, uint256 _claimAmount, uint256 _cooldown) public initializer {
        __Ownable_init(msg.sender);
        token = IERC20U(tokenAddress);
        claimAmount = _claimAmount;
        cooldown = _cooldown;
        paused = false;
    }

    modifier notPaused() {
        require(!paused, "Paused");
        _;
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
}
