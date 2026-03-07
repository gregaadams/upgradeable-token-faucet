# Testing

## Overview

This project includes automated tests written with **Hardhat**, **Mocha**, and **Chai** to validate the functionality and security properties of the upgradeable token faucet.

Tests run against Hardhat's **in-memory blockchain**, which resets before each test suite execution.

This ensures:

- deterministic test results
- no dependency on external networks
- fast execution for development workflows

## Running Tests

Run the full test suite with:

`npx hardhat test`

Expected result:

- 4 passing
- 0 failing

## Test Categories

### Faucet Functionality

These tests validate the core faucet behavior.

#### Claim Tokens

Ensures users can successfully claim tokens from the faucet.

Validation:

- user receives `claimAmount`
- faucet balance decreases appropriately

#### Cooldown Enforcement

Ensures users cannot repeatedly claim tokens before the cooldown period expires.

Validation:

- second claim within cooldown window reverts
- claim allowed again after cooldown passes

### Access Control

#### Owner-Only Fee Withdrawal

Ensures only the contract owner can withdraw accumulated ETH fees.

Validation:

- owner call succeeds
- non-owner call reverts with `OwnableUnauthorizedAccount`

### Upgrade Safety

#### Proxy State Preservation

Tests that upgrading the implementation contract **does not corrupt storage**.

Upgrade tested:

- `TokenFaucetUpgradeableV7`
- `TokenFaucetUpgradeableV8`

The test verifies the following values remain unchanged:

- owner
- claimAmount
- cooldown
- paused state

This confirms correct use of the **EIP-1967 upgradeable proxy pattern**.

## Network Configuration

Tests run using Hardhat's **internal test network**:

`defaultNetwork: hardhat`

This network is automatically created and destroyed during test execution.

Manual deployment scripts may use:

`--network localhost`

when interacting with a running local node.

## Gas Usage

Hardhat automatically reports gas usage after test execution.

Example output:

- `claim() avg gas: ~92k`
- `deployment gas: ~2.3M`

Tracking gas usage helps identify unexpected changes in contract complexity across upgrades.

## Future Testing Improvements

Possible enhancements to the test suite include:

- paused state behavior tests
- event emission validation
- fuzz testing of claim intervals
- invariant testing for faucet balances
- CI automation for test execution on pull requests

## Toolchain

Testing stack used in this project:

- Hardhat
- Mocha
- Chai
- Hardhat Upgrades Plugin
- Ethers.js

