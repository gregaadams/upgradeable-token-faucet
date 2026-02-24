const hre = require("hardhat");
const { MiniVault: vaultAddress } = require("../deployed.json");

async function main() {
  const MiniVault = await hre.ethers.getContractFactory("MiniVault");
  const vault = MiniVault.attach(vaultAddress);

  // Read past Deposited events
  const deposits = await vault.queryFilter(vault.filters.Deposited());
  console.log("Deposited events:", deposits.length);

  for (const e of deposits.slice(-5)) {
    console.log({
      from: e.args.from,
      amountETH: hre.ethers.formatEther(e.args.amount),
      newBalanceETH: hre.ethers.formatEther(e.args.newBalance),
      txHash: e.transactionHash,
    });
  }

  const withdrawals = await vault.queryFilter(vault.filters.Withdrawn());
  console.log("Withdrawn events:", withdrawals.length);

  for (const e of withdrawals.slice(-5)) {
    console.log({
      to: e.args.to,
      amountETH: hre.ethers.formatEther(e.args.amount),
      newBalanceETH: hre.ethers.formatEther(e.args.newBalance),
      txHash: e.transactionHash,
    });
  }
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
