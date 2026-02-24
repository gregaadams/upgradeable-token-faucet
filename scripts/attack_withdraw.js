const hre = require("hardhat");
const { MiniVault: vaultAddress } = require("../deployed.json");

async function main() {
  const [owner, attacker] = await hre.ethers.getSigners();

  const MiniVault = await hre.ethers.getContractFactory("MiniVault");

  const vaultAsOwner = MiniVault.connect(owner).attach(vaultAddress);
  console.log("Vault address:", vaultAddress);
  console.log("Owner address:", owner.address);
  console.log("Attacker:", attacker.address);

  console.log("Vault balance (owner read):", hre.ethers.formatEther(await vaultAsOwner.vaultBalance()), "ETH");

  const vaultAsAttacker = MiniVault.connect(attacker).attach(vaultAddress);

  console.log("Attacker attempting withdraw...");
  await vaultAsAttacker.withdraw(hre.ethers.parseEther("0.1"));
}

main().catch((e) => {
  console.error("Attack failed as expected:");
  console.error(e.message);
  process.exitCode = 0;
});
