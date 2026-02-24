const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const MyToken = await hre.ethers.getContractFactory("MyToken");
  const token = await MyToken.deploy();
  await token.waitForDeployment();
  const tokenAddr = await token.getAddress();
  console.log("MyToken deployed to:", tokenAddr);

  const TokenFaucet = await hre.ethers.getContractFactory("TokenFaucet");
  const faucet = await TokenFaucet.deploy(
    tokenAddr,
    hre.ethers.parseUnits("10", 18),
    60
  );
  await faucet.waitForDeployment();
  const faucetAddr = await faucet.getAddress();
  console.log("TokenFaucet deployed to:", faucetAddr);

  await (await token.transfer(faucetAddr, hre.ethers.parseUnits("1000", 18))).wait();
  console.log("Faucet funded with 1000 MTK");

  fs.writeFileSync(
    "deployed_faucet.json",
    JSON.stringify({ MyToken: tokenAddr, TokenFaucet: faucetAddr }, null, 2)
  );
  console.log("Saved addresses to deployed_faucet.json");
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
