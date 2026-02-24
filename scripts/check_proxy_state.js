const hre = require("hardhat");

const PROXY = "0x610178dA211FEF7D417bC0e6FeD39F05609AD788";

async function main() {
  const [owner] = await hre.ethers.getSigners();
  const faucet = await hre.ethers.getContractAt("TokenFaucetUpgradeableV2", PROXY);

  console.log("Owner:", owner.address);
  console.log("Version:", await faucet.version());
  console.log("ClaimAmount:", (await faucet.claimAmount()).toString());
  console.log("Cooldown:", (await faucet.cooldown()).toString());
  console.log("Paused:", await faucet.paused());
  console.log("newValue:", (await faucet.newValue()).toString());
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
