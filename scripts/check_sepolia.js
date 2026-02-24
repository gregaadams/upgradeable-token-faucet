const hre = require("hardhat");
const { MyToken, TokenFaucet } = require("../deployed_sepolia.json");

async function main() {
  const token = await hre.ethers.getContractAt("MyToken", MyToken);
  const faucet = await hre.ethers.getContractAt("TokenFaucet", TokenFaucet);

  const fmt = (x) => hre.ethers.formatUnits(x, 18);

  console.log("MyToken:", MyToken);
  console.log("TokenFaucet:", TokenFaucet);

  console.log("Faucet token balance:", fmt(await token.balanceOf(TokenFaucet)), "MTK");
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
