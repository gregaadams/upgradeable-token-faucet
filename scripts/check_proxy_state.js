const hre = require("hardhat");
const d = require("../deployments/local_proxy.json");

async function main() {
  const [signer] = await hre.ethers.getSigners();

  const proxyAddress = d.faucetProxy;

  console.log("Proxy:", proxyAddress);
  console.log("Deployer (local signer #0):", signer.address);

  // IMPORTANT: Use the ABI for the version you expect to be running
  // (if the proxy is on a different impl, version() may not exist, so we guard it)
  const faucet = await hre.ethers.getContractAt("TokenFaucetUpgradeableV7", proxyAddress);

  const owner = await faucet.owner();
  console.log("Owner:", owner);

  let v = "(no version())";
  try { v = await faucet.version(); } catch (e) {}
  console.log("Version:", v);

  // These may or may not exist depending on your implementation
  try { console.log("Paused:", await faucet.paused()); } catch (e) { console.log("Paused: (n/a)"); }
  try { console.log("Cooldown:", (await faucet.cooldown()).toString()); } catch (e) { console.log("Cooldown: (n/a)"); }
  try { console.log("ClaimAmount:", (await faucet.claimAmount()).toString()); } catch (e) { console.log("ClaimAmount: (n/a)"); }

  // ETH fee balance (if you’re collecting fees)
  const ethBal = await hre.ethers.provider.getBalance(proxyAddress);
  console.log("Contract ETH balance:", hre.ethers.formatEther(ethBal));
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});