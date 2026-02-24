// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IMiniVault {
    function deposit() external payable;
    function withdrawMyFunds(uint256 amount) external;
}

contract ReentrancyAttacker {
    IMiniVault public vault;
    address public owner;
    bool public attackInProgress;

    constructor(address _vault) {
        vault = IMiniVault(_vault);
        owner = msg.sender;
    }

    // Fund attacker contract and deposit into vault under attacker contract's address
    function attack() external payable {
        require(msg.sender == owner, "Not owner");
        require(msg.value > 0, "Send ETH");

        // Deposit into the vault from this contract
        vault.deposit{value: msg.value}();

        attackInProgress = true;

        // Try to withdraw (this will trigger receive(), which tries to reenter)
        vault.withdrawMyFunds(msg.value);

        attackInProgress = false;
    }

    receive() external payable {
        // Attempt reentrancy during the payout
        if (attackInProgress) {
            // Try to withdraw again (should fail due to balances already reduced)
            vault.withdrawMyFunds(msg.value);
        }
    }
}
