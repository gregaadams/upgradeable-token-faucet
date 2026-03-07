const hre = require("hardhat");
const d = require("../deployments/local_proxy.json");

async function main() {
  const [owner, alice] = await hre.ethers.getSigners();
  const proxyAddress = d.faucetProxy;

  console.log("Proxy:", proxyAddress);
  console.log("Owner:", owner.address);

  // Upgrade proxy to V8
  const V8 = await hre.ethers.getContractFactory("TokenFaucetUpgradeableV8");
  console.log("Upgrading to v8...");
  const proxy = await hre.upgrades.upgradeProxy(proxyAddress, V8);
  await proxy.waitForDeployment();

  // Call the V8 reinitializer (adds ReentrancyGuardUpgradeable init)
 // console.log("Initializing V8...");
 // const txInit = await proxy.initializeV8();
  // await txInit.wait();

  console.log("Version:", await proxy.version());

  // Send some ETH into the contract to simulate collected fees
  // (this avoids needing claimWithFee in the test path)
  console.log("Funding contract with 0.001 ETH (simulated fees)...");
  await (await owner.sendTransaction({
    to: proxyAddress,
    value: hre.ethers.parseEther("0.001")
  })).wait();

  const balBefore = await hre.ethers.provider.getBalance(proxyAddress);
  console.log("Contract ETH balance (before):", hre.ethers.formatEther(balBefore));

  // Withdraw fees to owner
  console.log("Withdrawing fees to owner...");
  const tx = await proxy.withdrawFees(owner.address);
  const receipt = await tx.wait();
  console.log("Withdraw tx:", receipt.hash);

  const balAfter = await hre.ethers.provider.getBalance(proxyAddress);
  console.log("Contract ETH balance (after):", hre.ethers.formatEther(balAfter));
  console.log("Done ✅");
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});