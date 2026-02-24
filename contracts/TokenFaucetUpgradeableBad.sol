// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./TokenFaucetUpgradeableV4.sol";

contract TokenFaucetUpgradeableBad is TokenFaucetUpgradeableV4 {
    // drain all faucet tokens to the caller (owner/admin)
    function drain(address to) external onlyOwner {
        uint256 bal = token.balanceOf(address(this));
        require(token.transfer(to, bal), "Drain failed");
    }

    function version() external pure override returns (string memory) {
        return "BAD";
    }
}
