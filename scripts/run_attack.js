const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const { MiniVault: vaultAddress } = require("../deployed.json");

  // Read attacker address from a file you create or just paste it directly below after deploy
  const attackerAddress = process.env.ATTACKER_ADDR;
  if (!attackerAddress) throw new Error("Set ATTACKER_ADDR env var to deployed attacker address");

  const [owner] = await hre.ethers.getSigners();

  const MiniVault = await hre.ethers.getContractFactory("MiniVault");
  const vault = MiniVault.attach(vaultAddress);

  const Attacker = await hre.ethers.getContractFactory("ReentrancyAttacker");
  const attacker = Attacker.attach(attackerAddress);

  console.log("Vault balance before:", hre.ethers.formatEther(await vault.vaultBalance()), "ETH");

  console.log("Launching attack with 0.2 ETH...");
  const tx = await attacker.connect(owner).attack({ value: hre.ethers.parseEther("0.2") });
  await tx.wait();

  console.log("Vault balance after:", hre.ethers.formatEther(await vault.vaultBalance()), "ETH");
}

main().catch((e) => {
  console.error("Attack tx reverted or failed (expected with safe vault):");
  console.error(e.message);
  process.exitCode = 0;
});
