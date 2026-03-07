const hre = require("hardhat");
const d = require("../deployments/local_proxy.json");

async function main() {
  const [owner] = await hre.ethers.getSigners();
  const proxy = d.faucetProxy;

  console.log("Proxy:", proxy);

  // Attach faucet contract
  const faucet = await hre.ethers.getContractAt("TokenFaucetUpgradeableV8", proxy);

  // Fund proxy with ETH so payout can send ETH
  await (await owner.sendTransaction({
    to: proxy,
    value: hre.ethers.parseEther("0.001")
  })).wait();

  const bal = await hre.ethers.provider.getBalance(proxy);
  console.log("Contract ETH balance:", hre.ethers.formatEther(bal));

  // Deploy attacker contract
  const Attack = await hre.ethers.getContractFactory("AttackReenterFees");
  const attacker = await Attack.deploy(proxy);
  await attacker.waitForDeployment();

  const attackerAddr = await attacker.getAddress();
  console.log("Attacker:", attackerAddr);

  // Transfer ownership to attacker so onlyOwner passes
  console.log("Transferring ownership to attacker (test only)...");
  await (await faucet.connect(owner).transferOwnership(attackerAddr)).wait();

  console.log("Attempting reentrancy attack...");
  try {
    const tx = await attacker.connect(owner).attack();
    await tx.wait();
    console.log("Attack executed (reentrancy attempt triggered)");
  } catch (e) {
    console.log("Attack reverted as expected ✅");
    console.log(String(e).slice(0, 200));
  }

  // Restore ownership back to owner via attacker contract
  console.log("Restoring ownership back to owner...");
  await (await attacker.connect(owner).giveOwnershipBack(owner.address)).wait();

  const newOwner = await faucet.owner();
  console.log("Current owner:", newOwner);

  console.log("Done ✅");
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});