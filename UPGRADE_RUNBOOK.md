# Upgrade Runbook (Proxy-Based Contracts)

This runbook is a practical checklist for safely upgrading an upgradeable proxy contract (local → testnet → mainnet). It focuses on storage safety, governance controls, and post-upgrade validation.

---

## 1) Pre-upgrade checks (code + safety)

### Storage layout (upgrade safety)
- Only append new state variables (never reorder/remove/change types)
- Do not change inheritance order
- Do not change the type of existing state variables

### Interface compatibility
- Don’t break existing public/external function signatures
- If adding new behavior, prefer new functions (e.g., `claimWithFee`) over changing existing ones
- Avoid changing mutability (e.g., `nonpayable` → `payable`) on existing functions

### Access control
- New functions have correct modifiers:
  - `onlyOwner` for admin actions
  - guardian restrictions for emergency controls
  - `notPaused` where appropriate

### Overrides
- Parent functions intended to be overridden are marked `virtual`
- Child overrides include `override`
- If further overrides may occur (v2 → v3 → v4), keep `virtual` in the chain

### Build + tests
- Run: `npx hardhat compile`
- Run tests (if available): `npx hardhat test`
---

## 2) Upgrade steps (local dry-run first)

Local dry-run must pass before Sepolia.

### Start local chain
- `npx hardhat node`

### Deploy baseline proxy + contracts
- `npx hardhat run scripts/deploy_proxy_local.js --network localhost`

### Upgrade proxy to the new implementation
- `npx hardhat run scripts/upgrade_to_<version>.js --network localhost`

### Run verification scripts (required)
- Read critical state:
  - owner, paused, cooldown, balances
- Exercise new feature paths (happy path)
- Exercise failure paths (expected reverts)
- Confirm:
  - proxy address unchanged
  - storage/state preserved across the upgrade

---

## 3) Upgrade steps (Sepolia execution)

- Confirm deployment addresses + config files are correct (e.g., `deployments/sepolia_v*.json`)
- Upgrade on Sepolia using governance controls (recommended):
  - multisig upgrade admin (Safe)
  - timelock for upgrades (where applicable)
- Verify implementation contract source on explorer (Etherscan)
- Publish updated frontend config (addresses + ABI) if used

---

## 4) Post-upgrade verification (must-do checks)

### On-chain reads
- owner, paused, cooldown, new variables
- contract balances (token + ETH)

### Core flows
- Happy path:
  - claim succeeds (fees enforced if applicable)
- Failure path:
  - cooldown enforced
  - paused blocks functions
  - access control blocks non-admin calls

### Events
- Confirm events emit as expected:
  - UpgradeAnnounced, FeeCollected, etc.

### Frontend sanity (if applicable)
- UI points to correct network + proxy address
- No hardcoded stale addresses
- Error messages are user-friendly (no silent failures)

---

## 5) Emergency response plan (if something goes wrong)

### Immediate containment
- Guardian pause (if available) to stop damage
- Communicate incident status:
  - what’s impacted
  - what users should do

### Diagnosis
- Determine whether this is:
  - logic bug
  - config issue
  - governance error
- Check last upgrade transaction + emitted events

### Recovery
- If safe: upgrade to patched implementation
- If admin compromise suspected:
  - rotate keys
  - move admin to multisig
- If funds at risk:
  - execute rescue procedures (if allowed and safe)

### Post-mortem
- Document root cause + preventative controls
- Add tests/scripts to prevent recurrence
