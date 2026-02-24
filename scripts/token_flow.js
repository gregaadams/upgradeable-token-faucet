const hre = require("hardhat");
const { MyToken: tokenAddress } = require("../deployed.json");

async function main() {
  const [owner, alice, bob] = await hre.ethers.getSigners();

  const token = await hre.ethers.getContractAt("MyToken", tokenAddress);

  const fmt = (x) => hre.ethers.formatUnits(x, 18);

  console.log("Token:", tokenAddress);
  console.log("Owner:", owner.address);
  console.log("Alice:", alice.address);
  console.log("Bob:", bob.address);

  // 1) Balance
  console.log("Owner balance:", fmt(await token.balanceOf(owner.address)));

  // 2) Transfer: owner -> alice (100 MTK)
  console.log("Transferring 100 MTK to Alice...");
  let tx = await token.transfer(alice.address, hre.ethers.parseUnits("100", 18));
  await tx.wait();

  console.log("Alice balance:", fmt(await token.balanceOf(alice.address)));

  // 3) Allowance: Alice approves Bob to spend 25 MTK
  console.log("Alice approves Bob for 25 MTK...");
  tx = await token.connect(alice).approve(bob.address, hre.ethers.parseUnits("25", 18));
  await tx.wait();

  console.log("Allowance (Alice->Bob):", fmt(await token.allowance(alice.address, bob.address)));

  // 4) transferFrom: Bob spends 10 MTK from Alice -> Bob
  console.log("Bob transferFrom Alice -> Bob (10 MTK)...");
  tx = await token.connect(bob).transferFrom(
    alice.address,
    bob.address,
    hre.ethers.parseUnits("10", 18)
  );
  await tx.wait();

  console.log("Alice balance:", fmt(await token.balanceOf(alice.address)));
  console.log("Bob balance:", fmt(await token.balanceOf(bob.address)));
  console.log("Remaining allowance (Alice->Bob):", fmt(await token.allowance(alice.address, bob.address)));
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
