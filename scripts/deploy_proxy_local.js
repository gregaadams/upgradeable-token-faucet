const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  const MyToken = await hre.ethers.getContractFactory("MyToken");
  const token = await MyToken.deploy();
  await token.waitForDeployment();
  const tokenAddr = await token.getAddress();

  const Faucet = await hre.ethers.getContractFactory("TokenFaucetUpgradeable");
  const proxy = await hre.upgrades.deployProxy(
    Faucet,
    [tokenAddr, hre.ethers.parseUnits("10", 18), 60],
    { initializer: "initialize" }
  );
  await proxy.waitForDeployment();

  const proxyAddr = await proxy.getAddress();
  console.log("Token:", tokenAddr);
  console.log("Faucet Proxy:", proxyAddr);

  // fund proxy with 1000 tokens
  await (await token.transfer(proxyAddr, hre.ethers.parseUnits("1000", 18))).wait();
  console.log("Funded proxy faucet with 1000 MTK");

  console.log("Deployer:", deployer.address);
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
