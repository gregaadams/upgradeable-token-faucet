const hre = require("hardhat");

const PROXY = "0x610178dA211FEF7D417bC0e6FeD39F05609AD788";

async function main() {
  const FaucetV2 = await hre.ethers.getContractFactory("TokenFaucetUpgradeableV2");

  console.log("Upgrading proxy:", PROXY);
  const upgraded = await hre.upgrades.upgradeProxy(PROXY, FaucetV2);
  await upgraded.waitForDeployment();

  console.log("Upgrade complete ✅");
  console.log("Proxy address (unchanged):", await upgraded.getAddress());

  // Call new function via proxy
  console.log("Version:", await upgraded.version());
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
