// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./TokenFaucetUpgradeableV7.sol";

contract TokenFaucetUpgradeableV8 is TokenFaucetUpgradeableV7 {
    event FeesWithdrawn(address indexed to, uint256 amountWei);

// Allow the contract to receive ETH (fees, refunds, etc.)
receive() external payable {}

    // Unstructured storage slot (does not change existing storage layout)
    bytes32 private constant _REENTRANCY_SLOT = keccak256("upgradeable-token-faucet.v8.reentrancy");

    modifier nonReentrant() {
        bytes32 slot = _REENTRANCY_SLOT;
        uint256 status;
        assembly {
            status := sload(slot)
        }
        require(status == 0, "Reentrancy");
        assembly {
            sstore(slot, 1)
        }
        _;
        assembly {
            sstore(slot, 0)
        }
    }

    function withdrawFees(address payable to)
        external
        override
        onlyOwner
        nonReentrant
    {
        require(to != address(0), "Bad to");

        uint256 bal = address(this).balance;
        require(bal > 0, "No fees");

        (bool ok, ) = to.call{value: bal}("");
        require(ok, "Withdraw failed");

        emit FeesWithdrawn(to, bal);
    }

    function version() external pure virtual override returns (string memory) {
        return "v8";
    }

    function __dev_payout(address payable to, uint256 amountWei) external nonReentrant onlyOwner {
    (bool ok, ) = to.call{value: amountWei}("");
    require(ok, "Payout failed");
}


}