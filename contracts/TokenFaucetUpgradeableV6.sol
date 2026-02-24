// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./TokenFaucetUpgradeableV5.sol";

contract TokenFaucetUpgradeableV6 is TokenFaucetUpgradeableV5 {
    address public rescueTo;
    uint256 public rescueArmedUntil; // timestamp

    event RescueArmed(address indexed to, uint256 until);
    event RescueExecuted(address indexed to, uint256 amount);

    function version() external pure virtual override returns (string memory) {
        return "v6";
    }

    // Owner arms rescue for a short window (friction)
    function armRescue(address to, uint256 windowSeconds) external onlyOwner {
        require(to != address(0), "Bad to");
        require(windowSeconds > 0 && windowSeconds <= 3600, "Bad window"); // max 1 hour
        rescueTo = to;
        rescueArmedUntil = block.timestamp + windowSeconds;
        emit RescueArmed(to, rescueArmedUntil);
    }

    // Owner executes only if armed & within window
    function executeRescue(uint256 amount) external onlyOwner {
        require(block.timestamp <= rescueArmedUntil, "Rescue not armed");
        require(amount > 0, "Bad amount");

        uint256 bal = token.balanceOf(address(this));
        require(amount <= bal, "Too much");

        require(token.transfer(rescueTo, amount), "Rescue failed");
        emit RescueExecuted(rescueTo, amount);

        // disarm after use
        rescueArmedUntil = 0;
    }
}
