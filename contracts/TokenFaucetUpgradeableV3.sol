// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./TokenFaucetUpgradeableV2.sol";

contract TokenFaucetUpgradeableV3 is TokenFaucetUpgradeableV2 {

    function version() external pure virtual override returns (string memory) {
        return "v3";
    }

    function setNewValue(uint256 v) external onlyOwner {
        newValue = v;
    }
}
