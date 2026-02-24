const hre = require("hardhat");
// TEST ONLY
async function main() {
  const contractAddress = "0x0165878A594ca255338adfa4d48449f69242Eb8F";

  const [owner, attacker] = await hre.ethers.getSigners();

  const Hello = await hre.ethers.getContractFactory("Hello");

  // Read as owner just to show current state
  const helloAsOwner = await Hello.connect(owner).attach(contractAddress);
  console.log("Owner sees message:", await helloAsOwner.message());

  // Try to write as attacker
  const helloAsAttacker = await Hello.connect(attacker).attach(contractAddress);

  console.log("Attacker address:", attacker.address);
  console.log("Attacker trying to change the message...");

  await helloAsAttacker.setMessage("Hacked!!!"); // should revert
}

main().catch((error) => {
  console.error("Attack failed as expected:");
  console.error(error.message);
  process.exitCode = 0;
});
