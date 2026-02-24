const hre = require("hardhat");
const PROXY = "0x610178dA211FEF7D417bC0e6FeD39F05609AD788";

async function main() {
  const FaucetV3 = await hre.ethers.getContractFactory("TokenFaucetUpgradeableV3");

  console.log("Upgrading to v3...");
  const upgraded = await hre.upgrades.upgradeProxy(PROXY, FaucetV3);
  await upgraded.waitForDeployment();

  console.log("Proxy:", await upgraded.getAddress());
  console.log("Version:", await upgraded.version());

  console.log("Setting newValue to 123...");
  await (await upgraded.setNewValue(123)).wait();
  console.log("newValue:", (await upgraded.newValue()).toString());
}

main().catch((e) => {
  console.error(e?.shortMessage || e?.message || e);
  process.exitCode = 1;
});
