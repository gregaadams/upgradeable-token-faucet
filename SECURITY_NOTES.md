# Security Notes

## Core Security Controls
- `onlyOwner` restricts administrative functions such as fee withdrawal
- cooldown prevents repeated faucet abuse from a single address
- upgradeable proxy pattern is validated with state-preservation tests
- ETH withdrawal path uses reentrancy protection
- contract can explicitly receive ETH via `receive() external payable`

## Verified Security Invariants
- only owner can call `withdrawFees`
- users cannot claim twice within the cooldown window
- upgrades preserve critical values:
  - owner
  - claim amount
  - cooldown
  - paused state
- proxy address remains constant across upgrades
- implementation logic can change without corrupting storage

## Notes
This project includes both manual validation scripts and automated Hardhat tests
to verify access control, upgrade safety, and faucet protections.