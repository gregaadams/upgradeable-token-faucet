const hre = require("hardhat");

async function main() {
  // 👇 PASTE YOUR NEW DEPLOYED ADDRESS HERE
  const contractAddress = "0x0165878A594ca255338adfa4d48449f69242Eb8F";

  const Hello = await hre.ethers.getContractFactory("Hello");
  const hello = await Hello.attach(contractAddress);

  console.log("Reading current message...");
  let message = await hello.message();
  console.log("Current message:", message);

  console.log("Owner updating message...");
  const tx = await hello.setMessage("Owner updated message");
  await tx.wait();

  message = await hello.message();
  console.log("Updated message:", message);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
