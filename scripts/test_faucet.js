const hre = require("hardhat");
const { MyToken: tokenAddress, TokenFaucet: faucetAddress } = require("../deployed.json");

async function main() {
  const [owner, alice, bob] = await hre.ethers.getSigners();

  const token = await hre.ethers.getContractAt("MyToken", tokenAddress);
  const faucet = await hre.ethers.getContractAt("TokenFaucet", faucetAddress);

  const fmt = (x) => hre.ethers.formatUnits(x, 18);

  console.log("Faucet balance:", fmt(await faucet.faucetBalance()), "MTK");

  console.log("Alice claims...");
  await (await faucet.connect(alice).claim()).wait();
  console.log("Alice balance:", fmt(await token.balanceOf(alice.address)));

  console.log("Bob claims...");
  await (await faucet.connect(bob).claim()).wait();
  console.log("Bob balance:", fmt(await token.balanceOf(bob.address)));

  console.log("Alice tries to claim again immediately (should fail)...");
  try {
    await (await faucet.connect(alice).claim()).wait();
  } catch (e) {
    console.log("Expected failure:", e.message.split("\n")[0]);
  }
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
