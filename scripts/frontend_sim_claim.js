const hre = require("hardhat");
const { TokenFaucet: faucetAddress } = require("../deployed.json");

async function main() {
  const [_, alice] = await hre.ethers.getSigners();

  const faucet = await hre.ethers.getContractAt("TokenFaucet", faucetAddress);

  console.log("Connected wallet:", alice.address);
  console.log("Faucet:", faucetAddress);

  console.log("Sending claim transaction...");
  try {
    const tx = await faucet.connect(alice).claim();
    console.log("Tx submitted:", tx.hash);

    const receipt = await tx.wait();
    console.log("Tx confirmed in block:", receipt.blockNumber);

    console.log("Claim success ✅");
  } catch (e) {
    // Typical frontend pattern: surface readable revert reason
    const msg = e?.shortMessage || e?.message || "Unknown error";
    console.log("Claim failed ❌:", msg);
  }
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
