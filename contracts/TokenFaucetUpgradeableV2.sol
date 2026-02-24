// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./TokenFaucetUpgradeable.sol";

contract TokenFaucetUpgradeableV2 is TokenFaucetUpgradeable {
    function version() external pure virtual returns (string memory) {
        return "v2";
    }
uint256 public newValue;
}

