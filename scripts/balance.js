const hre = require("hardhat");
const { MiniVault: vaultAddress } = require("../deployed.json");

async function main() {
  const MiniVault = await hre.ethers.getContractFactory("MiniVault");
  const vault = MiniVault.attach(vaultAddress);

  console.log("Vault address:", vaultAddress);
  console.log("Vault balance:", hre.ethers.formatEther(await vault.vaultBalance()), "ETH");
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
