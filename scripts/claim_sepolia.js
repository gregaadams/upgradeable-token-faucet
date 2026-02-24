const hre = require("hardhat");
const { MyToken, TokenFaucet } = require("../deployed_sepolia.json");

async function main() {
  const [user] = await hre.ethers.getSigners();

  const token = await hre.ethers.getContractAt("MyToken", MyToken);
  const faucet = await hre.ethers.getContractAt("TokenFaucet", TokenFaucet);

  const fmt = (x) => hre.ethers.formatUnits(x, 18);

  console.log("User:", user.address);

  // cooldown diagnostics
  const cd = Number(await faucet.cooldown());
  const last = Number(await faucet.lastClaimAt(user.address));
  const now = Math.floor(Date.now() / 1000);
  const remaining = Math.max(0, (last + cd) - now);

  console.log("Cooldown:", cd, "sec");
  console.log("Last claim:", last);
  console.log("Now:", now);
  console.log("Remaining:", remaining, "sec");

  if (remaining > 0) {
    console.log("Not claiming — cooldown active.");
    console.log("User MTK balance:", fmt(await token.balanceOf(user.address)), "MTK");
    return;
  }

  console.log("Sending claim tx...");
  const tx = await faucet.claim();
  console.log("Tx submitted:", tx.hash);

  const receipt = await tx.wait();
  console.log("Confirmed in block:", receipt.blockNumber);

  console.log("User MTK balance:", fmt(await token.balanceOf(user.address)), "MTK");
}

main().catch((e) => {
  console.error("Claim failed:");
  console.error(e?.shortMessage || e?.message || e);
  process.exitCode = 1;
});
