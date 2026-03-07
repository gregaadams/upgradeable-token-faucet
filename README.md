# Upgradeable Token Faucet (Hardhat + Sepolia)

A production-style ERC-20 Token + Upgradeable Faucet demonstrating secure smart contract design, proxy upgrade patterns, and operational safeguards deployed on Ethereum Sepolia.

This project simulates real-world protocol operations including:
- upgradeable proxy deployments
- Etherscan contract verification
- emergency pause (guardian role)
- time-gated rescue operations
- fee-based anti-Sybil claim mechanism
- operational upgrade runbook

---

## 🔗 Sepolia Contracts (Verified)

### v1
- MyToken: https://sepolia.etherscan.io/address/0xF0f2573777a48F42FB05DAd424764dCD38DbFe6c  
- TokenFaucet: https://sepolia.etherscan.io/address/0x877eba320A874d7511D9e69d8D4090349Dad8005  

### v2 (pause + rescue enabled)
- MyToken: https://sepolia.etherscan.io/address/0x7d152361B1b273128bA5823550085f0abfD64Ad3  
- TokenFaucet: https://sepolia.etherscan.io/address/0x841B719B6c48fDC436c63dbcF01a1896210C67b0  

---  

## 🛠️ Features Implemented

| Capability | Description |
|-----------|-------------|
| Upgradeable Proxy | UUPS-style implementation upgrades |
| Guardian Role | Emergency pause separate from upgrade admin |
| Rescue Window | Time-gated treasury recovery |
| Claim Cooldown | Per-address rate limiting |
| Claim Fee | ETH-based anti-Sybil friction |
| Event Signaling | Upgrade announcements for indexers |
| Etherscan Verified | Publicly verifiable contract source |

---
## 🚀 Quickstart (Local)

```bash
npm install
npx hardhat node
npx hardhat run scripts/deploy_proxy_local.js --network localhost
```
---

## 🌐 Sepolia Deployment

Create `.env` with:

```bash
SEPOLIA_RPC_URL=<your_alchemy_url>
PRIVATE_KEY=<deployer_private_key>
ETHERSCAN_API_KEY=<etherscan_api_key>
```

Deploy:

```bash
npx hardhat run scripts/deploy_faucet_sepolia_v2.js --network sepolia
```

Verify:

```bash
npx hardhat verify --network sepolia <TOKEN_ADDRESS>
npx hardhat verify --network sepolia <FAUCET_ADDRESS> <TOKEN_ADDRESS> 10000000000000000000 60
```
---

## 📁 Deployments

Network-specific addresses stored in:

```text
deployments/
├── sepolia_v1.json
├── sepolia_v2.json
```
---

## 🔐 Governance Model

- Local Development: EOA Upgrade Admin  
- Sepolia/Mainnet: Multisig Upgrade Admin (recommended)  
- Emergency Guardian Role: pause-only permissions  
- Upgrade Runbook: see `UPGRADE_RUNBOOK.md`
---

## 📄 Upgrade Runbook

See `UPGRADE_RUNBOOK.md` for:
- pre-upgrade checks  
- post-upgrade verification  
- emergency response procedures
---

## 📌 Notes

Upgradeable systems introduce governance risk even with verified code.

This project includes operational controls to mitigate upgrade abuse:
- guardian pause  
- time-gated rescue  
- fee-based anti-Sybil claims

## Architecture

This project uses the EIP-1967 upgradeable proxy pattern.

Proxy (EIP-1967)
        │
        ▼
TokenFaucetUpgradeableV7
        │
        ▼
TokenFaucetUpgradeableV8

The proxy address remains constant while the implementation
contract can be upgraded to add new functionality without
losing stored state.