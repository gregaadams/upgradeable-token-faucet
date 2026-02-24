const hre = require("hardhat");
const { TokenFaucet: faucetAddress } = require("../deployed.json");

async function main() {
  const [_, user] = await hre.ethers.getSigners();
  const faucet = await hre.ethers.getContractAt("TokenFaucet", faucetAddress);

  const now = Math.floor(Date.now() / 1000);
  const cd = Number(await faucet.cooldown());
  const last = Number(await faucet.lastClaimAt(user.address));
  const remaining = Math.max(0, (last + cd) - now);

  console.log("Connected wallet:", user.address);
  console.log("Faucet:", faucetAddress);
  console.log("Cooldown remaining:", remaining, "seconds");

  if (remaining > 0) {
    console.log("Not sending tx because cooldown is active.");
    return;
  }

  console.log("Sending claim transaction...");
  const tx = await faucet.connect(user).claim();
  console.log("Tx submitted:", tx.hash);

  const receipt = await tx.wait();
  console.log("Tx confirmed in block:", receipt.blockNumber);
  console.log("Claim success ✅");
}

main().catch((e) => {
  console.error(e?.shortMessage || e?.message || e);
  process.exitCode = 1;
});
