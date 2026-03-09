const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  // Deploy token
  const MyToken = await hre.ethers.getContractFactory("MyToken");
  const token = await MyToken.deploy();
  await token.waitForDeployment();
  const tokenAddr = await token.getAddress();
  console.log("MyToken deployed to:", tokenAddr);

  // Deploy upgradeable faucet proxy
  const TokenFaucet = await hre.ethers.getContractFactory("TokenFaucetUpgradeableV8");
  const faucet = await hre.upgrades.deployProxy(
    TokenFaucet,
    [
      tokenAddr,
      hre.ethers.parseUnits("10", 18),
      60
    ],
    { initializer: "initialize" }
  );

  await faucet.waitForDeployment();
  const faucetAddr = await faucet.getAddress();
  console.log("TokenFaucet proxy deployed to:", faucetAddr);

  // Fund faucet with 1000 MTK from deployer
  const fundTx = await token.transfer(
    faucetAddr,
    hre.ethers.parseUnits("1000", 18)
  );
  await fundTx.wait();
  console.log("Faucet funded with 1000 MTK");

  fs.writeFileSync(
    "deployed.json",
    JSON.stringify(
      {
        MyToken: tokenAddr,
        TokenFaucetProxy: faucetAddr,
      },
      null,
      2
    )
  );

  console.log("Deployment info saved to deployed.json");
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});