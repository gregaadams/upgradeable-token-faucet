// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./TokenFaucetUpgradeableV4.sol";

contract TokenFaucetUpgradeableV5 is TokenFaucetUpgradeableV4 {
    address public guardian;

    event GuardianSet(address indexed guardian);

    function version() external pure virtual override returns (string memory) {
        return "v5";
    }

    function setGuardian(address g) external onlyOwner {
        guardian = g;
        emit GuardianSet(g);
    }

    function guardianPause() external {
        require(msg.sender == guardian, "Not guardian");
        paused = true;
        emit Paused(true);
    }
}
