const hre = require("hardhat");

async function main() {
  const proxyAddress = "0xA645208dd48878BA18c6B214D8923277C98EC3d3";

  const FaucetV9 = await hre.ethers.getContractFactory("TokenFaucetUpgradeableV9");

  console.log("Upgrading faucet...");

  const upgraded = await hre.upgrades.upgradeProxy(proxyAddress, FaucetV9);

  await upgraded.waitForDeployment();

  console.log("Faucet upgraded at proxy:", await upgraded.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});