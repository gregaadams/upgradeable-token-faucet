const hre = require("hardhat");
const { MiniVault: vaultAddress } = require("../deployed.json");

async function main() {
  const Attacker = await hre.ethers.getContractFactory("ReentrancyAttacker");
  const attacker = await Attacker.deploy(vaultAddress);

  await attacker.waitForDeployment();

  console.log("Attacker deployed to:", await attacker.getAddress());
  console.log("Target vault:", vaultAddress);
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
