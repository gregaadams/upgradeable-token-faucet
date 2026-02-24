const hre = require("hardhat");
const { MiniVault: vaultAddress } = require("../deployed.json");

async function main() {
  const [user] = await hre.ethers.getSigners();

  const MiniVault = await hre.ethers.getContractFactory("MiniVault");
  const vault = MiniVault.attach(vaultAddress);

  console.log("User depositing 1 ETH...");
  const tx = await vault.deposit({ value: hre.ethers.parseEther("1") });
  await tx.wait();

  const userBal = await vault.balances(user.address);
  console.log("User balance in contract:", hre.ethers.formatEther(userBal), "ETH");

  console.log("Vault total balance:", hre.ethers.formatEther(await vault.vaultBalance()), "ETH");
}

main().catch(console.error);
