// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./TokenFaucetUpgradeableV8.sol";

// ⚠️ Intentionally BAD: adds a new variable in the middle (breaks storage layout)
contract TokenFaucetUpgradeableV9_BadStorage is TokenFaucetUpgradeableV8 {
    // BAD: putting a new variable *before* inherited storage is effectively "in the middle"
    uint256 public insertedInTheMiddle;

    function version() external pure override returns (string memory) {
        return "v9-bad";
    }
}