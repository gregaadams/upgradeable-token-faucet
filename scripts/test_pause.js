const hre = require("hardhat");
const { TokenFaucet } = require("../deployed_faucet_local.json");

async function main() {
  const [owner, alice] = await hre.ethers.getSigners();
  const faucet = await hre.ethers.getContractAt("TokenFaucet", TokenFaucet);

  console.log("Pausing faucet...");
  await (await faucet.connect(owner).setPaused(true)).wait();

  console.log("Alice tries to claim (should fail)...");
  try {
    await (await faucet.connect(alice).claim()).wait();
  } catch (e) {
    console.log("Expected failure:", (e.shortMessage || e.message).split("\n")[0]);
  }

  console.log("Unpausing faucet...");
  await (await faucet.connect(owner).setPaused(false)).wait();

  console.log("Alice claims (should succeed)...");
  const tx = await faucet.connect(alice).claim();
  console.log("Tx:", tx.hash);
  await tx.wait();
  console.log("Claimed ✅");
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
