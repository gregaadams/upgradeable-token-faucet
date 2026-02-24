const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const MiniVault = await hre.ethers.getContractFactory("MiniVault");
  const vault = await MiniVault.deploy();

  await vault.waitForDeployment();
  const addr = await vault.getAddress();

  console.log("MiniVault deployed to:", addr);

  fs.writeFileSync("deployed.json", JSON.stringify({ MiniVault: addr }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
