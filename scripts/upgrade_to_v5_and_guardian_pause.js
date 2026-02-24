const hre = require("hardhat");
const PROXY = "0x610178dA211FEF7D417bC0e6FeD39F05609AD788";

async function main() {
  const [owner, guardian, alice] = await hre.ethers.getSigners();

  const V5 = await hre.ethers.getContractFactory("TokenFaucetUpgradeableV5");

  console.log("Upgrading to v5...");
  const faucet = await hre.upgrades.upgradeProxy(PROXY, V5);
  await faucet.waitForDeployment();

  console.log("Version:", await faucet.version());

  console.log("Setting guardian:", guardian.address);
  await (await faucet.setGuardian(guardian.address)).wait();

  console.log("Guardian pausing...");
  await (await faucet.connect(guardian).guardianPause()).wait();

  console.log("Paused:", await faucet.paused());

  console.log("Alice tries to claim (should fail)...");
  try {
    await (await faucet.connect(alice).claim()).wait();
  } catch (e) {
    console.log("Expected failure:", (e.shortMessage || e.message).split("\n")[0]);
  }
}

main().catch((e) => {
  console.error(e?.shortMessage || e?.message || e);
  process.exitCode = 1;
});
