const hre = require("hardhat");
const PROXY = "0x610178dA211FEF7D417bC0e6FeD39F05609AD788";

async function main() {
  const [owner, alice] = await hre.ethers.getSigners();

  const V7 = await hre.ethers.getContractFactory("TokenFaucetUpgradeableV7");

  console.log("Upgrading to v7...");
  const faucet = await hre.upgrades.upgradeProxy(PROXY, V7);
  await faucet.waitForDeployment();

  console.log("Version:", await faucet.version());

  console.log("Setting claim fee to 0.0001 ETH...");
  await (await faucet.setClaimFee(hre.ethers.parseEther("0.0001"))).wait();

  console.log("Alice tries claimWithFee with 0 fee (should fail)...");
  try {
    await (await faucet.connect(alice).claimWithFee({ value: 0 })).wait();
  } catch (e) {
    console.log("Expected failure:", (e.shortMessage || e.message).split("\n")[0]);
  }

  console.log("Alice claims with fee (should succeed)...");
  const tx = await faucet.connect(alice).claimWithFee({
    value: hre.ethers.parseEther("0.0001"),
  });
  console.log("Tx:", tx.hash);
  await tx.wait();

  const bal = await hre.ethers.provider.getBalance(PROXY);
  console.log("Contract fee balance (ETH):", hre.ethers.formatEther(bal));
}

main().catch((e) => {
  console.error(e?.shortMessage || e?.message || e);
  process.exitCode = 1;
});
