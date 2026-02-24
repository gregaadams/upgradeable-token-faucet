const hre = require("hardhat");
const PROXY = "0x610178dA211FEF7D417bC0e6FeD39F05609AD788";

async function main() {
  const FaucetV4 = await hre.ethers.getContractFactory("TokenFaucetUpgradeableV4");

  console.log("Upgrading to v4...");
  const upgraded = await hre.upgrades.upgradeProxy(PROXY, FaucetV4);
  await upgraded.waitForDeployment();

  console.log("Version:", await upgraded.version());

  console.log("Announcing upgrade...");
  const tx = await upgraded.announceUpgrade();
  const receipt = await tx.wait();

  const iface = upgraded.interface;
  const decoded = receipt.logs
    .map((l) => {
      try { return iface.parseLog(l); } catch { return null; }
    })
    .filter(Boolean);

  for (const ev of decoded) {
    if (ev.name === "UpgradeAnnounced") {
      console.log(
        "UpgradeAnnounced:",
        ev.args.newVersion,
        "at",
        ev.args.timestamp.toString()
      );
    }
  }
}

main().catch((e) => {
  console.error(e?.shortMessage || e?.message || e);
  process.exitCode = 1;
});
