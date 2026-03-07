// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IFaucetDev {
    function __dev_payout(address payable to, uint256 amountWei) external;
    function transferOwnership(address newOwner) external;
}

contract AttackReenterFees {
    address public target;
    bool public tried;

    constructor(address _target) {
        target = _target;
    }

    receive() external payable {
        if (!tried) {
            tried = true;

            // ✅ Attempt reentry, but DO NOT revert the receive() if it fails
            try IFaucetDev(target).__dev_payout(payable(address(this)), 1) {
                // If this ever succeeds, that's bad (shouldn't happen)
            } catch {
                // Expected: should revert due to Reentrancy guard
            }
        }
    }

    function attack() external {
        // Triggers payout -> receive() -> reentry attempt
        IFaucetDev(target).__dev_payout(payable(address(this)), 1);
    }

    // ✅ After the test, attacker (as owner) can restore ownership back
    function giveOwnershipBack(address newOwner) external {
        IFaucetDev(target).transferOwnership(newOwner);
    }
}