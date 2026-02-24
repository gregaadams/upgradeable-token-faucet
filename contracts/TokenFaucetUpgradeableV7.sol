// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./TokenFaucetUpgradeableV6.sol";

contract TokenFaucetUpgradeableV7 is TokenFaucetUpgradeableV6 {
    uint256 public claimFeeWei;

    event ClaimFeeUpdated(uint256 feeWei);
    event FeeCollected(address indexed from, uint256 amountWei);

    function version() external pure virtual override returns (string memory) {
        return "v7";
    }

    function setClaimFee(uint256 feeWei) external onlyOwner {
        claimFeeWei = feeWei;
        emit ClaimFeeUpdated(feeWei);
    }

    // NEW: payable claim that enforces a fee (does NOT replace the old claim())
    function claimWithFee() external payable notPaused {
        require(msg.value >= claimFeeWei, "Fee too low");
        emit FeeCollected(msg.sender, msg.value);

        require(block.timestamp >= lastClaimAt[msg.sender] + cooldown, "Cooldown active");
        lastClaimAt[msg.sender] = block.timestamp;

        require(token.transfer(msg.sender, claimAmount), "Token transfer failed");
        emit Claimed(msg.sender, claimAmount);
    }

    // Owner can withdraw accumulated ETH fees from the proxy contract
    function withdrawFees(address payable to) external onlyOwner {
        require(to != address(0), "Bad to");
        (bool ok, ) = to.call{value: address(this).balance}("");
        require(ok, "Withdraw failed");
    }
}
