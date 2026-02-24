const hre = require("hardhat");
const PROXY = "0x610178dA211FEF7D417bC0e6FeD39F05609AD788";

async function main() {
  const [owner] = await hre.ethers.getSigners();
  const faucet = await hre.ethers.getContractAt("TokenFaucetUpgradeableV7", PROXY);

  console.log("Owner:", owner.address);
  console.log("Paused before:", await faucet.paused());

  const tx = await faucet.setPaused(false);
  console.log("Tx:", tx.hash);
  await tx.wait();

  console.log("Paused after:", await faucet.paused());
}

main().catch((e) => {
  console.error(e?.shortMessage || e?.message || e);
  process.exitCode = 1;
});
