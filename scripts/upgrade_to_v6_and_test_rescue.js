const hre = require("hardhat");

const PROXY = "0x610178dA211FEF7D417bC0e6FeD39F05609AD788";
const TOKEN = "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6";

async function main() {
  const [owner, guardian, alice] = await hre.ethers.getSigners();

  const token = await hre.ethers.getContractAt("MyToken", TOKEN);
  const V6 = await hre.ethers.getContractFactory("TokenFaucetUpgradeableV6");

  console.log("Upgrading to v6...");
  const faucet = await hre.upgrades.upgradeProxy(PROXY, V6);
  await faucet.waitForDeployment();

  console.log("Version:", await faucet.version());

  const before = await token.balanceOf(PROXY);
  console.log("Faucet token balance:", hre.ethers.formatUnits(before, 18));

  console.log("Attempt executeRescue WITHOUT arming (should fail)...");
  try {
    await (await faucet.executeRescue(hre.ethers.parseUnits("1", 18))).wait();
  } catch (e) {
    console.log("Expected failure:", (e.shortMessage || e.message).split("\n")[0]);
  }

  console.log("Arming rescue to Alice for 60 seconds...");
  await (await faucet.armRescue(alice.address, 60)).wait();

  console.log("Executing rescue of 5 tokens...");
  await (await faucet.executeRescue(hre.ethers.parseUnits("5", 18))).wait();

  const after = await token.balanceOf(PROXY);
  console.log("Faucet token balance after:", hre.ethers.formatUnits(after, 18));
  console.log("Alice token balance:", hre.ethers.formatUnits(await token.balanceOf(alice.address), 18));
}

main().catch((e) => {
  console.error(e?.shortMessage || e?.message || e);
  process.exitCode = 1;
});
