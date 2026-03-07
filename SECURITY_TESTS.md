# Security Tests

## Access Control

Verified that only the contract owner can call administrative functions.

Attempted calls from non-owner addresses revert with:

OwnableUnauthorizedAccount

## Reentrancy Protection

A malicious attacker contract attempted to recursively call the payout function.

Test flow:

1. Owner transfers ownership to attacker contract (test-only)
2. Attacker calls payout
3. Payout sends ETH to attacker
4. Attacker `receive()` attempts a reentrant payout call
5. `nonReentrant` guard blocks the second call

Result:
Reentrancy attempt fails and funds cannot be drained.

## Upgrade Safety

Upgradeable contracts use unstructured storage slots for reentrancy guard state.

This prevents storage layout corruption across upgrades.

Automated tests verify that upgrading from `TokenFaucetUpgradeableV7`
to `TokenFaucetUpgradeableV8` preserves critical proxy state including:

- owner
- claimAmount
- cooldown
- paused state