// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./TokenFaucetUpgradeableV8.sol";

contract TokenFaucetUpgradeableV9 is TokenFaucetUpgradeableV8 {
    function version() external pure override returns (string memory) {
        return "V9";
    }
}