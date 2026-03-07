const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  // 1) Deploy token
  const MyToken = await hre.ethers.getContractFactory("MyToken");
  const token = await MyToken.deploy();
  await token.waitForDeployment();
  const tokenAddr = await token.getAddress();

  // 2) Deploy upgradeable faucet behind a proxy
  const Faucet = await hre.ethers.getContractFactory("TokenFaucetUpgradeableV8");
  const proxy = await hre.upgrades.deployProxy(
    Faucet,
    [tokenAddr, hre.ethers.parseUnits("10", 18), 60],
    { initializer: "initialize" }
  );
  await proxy.waitForDeployment();
  const proxyAddr = await proxy.getAddress();

  console.log("Token:", tokenAddr);
  console.log("Faucet Proxy:", proxyAddr);

  // 3) Persist addresses (single source of truth)
  const outDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

  const outPath = path.join(outDir, "local_proxy.json");
  fs.writeFileSync(
    outPath,
    JSON.stringify(
      {
        network: "localhost",
        token: tokenAddr,
        faucetProxy: proxyAddr,
        deployer: deployer.address,
        deployedAt: new Date().toISOString(),
      },
      null,
      2
    )
  );
  console.log("Saved:", outPath);

  // 4) Fund proxy with 1000 tokens
  await (await token.transfer(proxyAddr, hre.ethers.parseUnits("1000", 18))).wait();
  console.log("Funded proxy faucet with 1000 MTK");

  console.log("Deployer:", deployer.address);
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});