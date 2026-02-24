const hre = require("hardhat");

const TOKEN = "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6";
const PROXY = "0x610178dA211FEF7D417bC0e6FeD39F05609AD788";

async function main() {
  const [owner] = await hre.ethers.getSigners();
  const token = await hre.ethers.getContractAt("MyToken", TOKEN);

  console.log("Owner:", owner.address);
  console.log("Funding proxy:", PROXY);

  const tx = await token.transfer(PROXY, hre.ethers.parseUnits("100", 18));
  console.log("Tx:", tx.hash);
  await tx.wait();

  const bal = await token.balanceOf(PROXY);
  console.log("Proxy token balance:", hre.ethers.formatUnits(bal, 18));
}

main().catch((e) => {
  console.error(e?.shortMessage || e?.message || e);
  process.exitCode = 1;
});
