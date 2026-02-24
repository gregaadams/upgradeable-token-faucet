// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./TokenFaucetUpgradeableV3.sol";

contract TokenFaucetUpgradeableV4 is TokenFaucetUpgradeableV3 {
    event UpgradeAnnounced(string newVersion, uint256 timestamp);

    function version() external pure virtual override returns (string memory) {
        return "v4";
    }

    function announceUpgrade() external onlyOwner {
        emit UpgradeAnnounced("v4", block.timestamp);
    }
}
