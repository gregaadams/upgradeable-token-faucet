const hre = require("hardhat");

const PROXY = "0x610178dA211FEF7D417bC0e6FeD39F05609AD788";
const TOKEN = "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6";

async function main() {
  const [owner, alice] = await hre.ethers.getSigners();

  const faucet = await hre.ethers.getContractAt("TokenFaucetUpgradeable", PROXY);
  const token = await hre.ethers.getContractAt("MyToken", TOKEN);

  console.log("Alice before:", hre.ethers.formatUnits(await token.balanceOf(alice.address), 18));

  const tx = await faucet.connect(alice).claim();
  console.log("Tx:", tx.hash);
  await tx.wait();

  console.log("Alice after:", hre.ethers.formatUnits(await token.balanceOf(alice.address), 18));
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
