const hre = require("hardhat");

const PROXY = "0x610178dA211FEF7D417bC0e6FeD39F05609AD788";
const TOKEN = "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6";

async function main() {
  const [owner] = await hre.ethers.getSigners();

  const token = await hre.ethers.getContractAt("MyToken", TOKEN);

  console.log("Owner:", owner.address);
  console.log("Proxy:", PROXY);

  const before = await token.balanceOf(PROXY);
  console.log("Faucet token balance before:", hre.ethers.formatUnits(before, 18));

  const Bad = await hre.ethers.getContractFactory("TokenFaucetUpgradeableBad");

  console.log("Upgrading to BAD...");
  const upgraded = await hre.upgrades.upgradeProxy(PROXY, Bad);
  await upgraded.waitForDeployment();

  console.log("Version:", await upgraded.version());

  console.log("Draining...");
  const tx = await upgraded.drain(owner.address);
  console.log("Tx:", tx.hash);
  await tx.wait();

  const after = await token.balanceOf(PROXY);
  console.log("Faucet token balance after:", hre.ethers.formatUnits(after, 18));
}

main().catch((e) => {
  console.error(e?.shortMessage || e?.message || e);
  process.exitCode = 1;
});
