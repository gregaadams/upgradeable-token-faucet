const hre = require("hardhat");

async function main() {
    const Hello = await hre.ethers.getContractFactory("Hello");
    const hello = await Hello.deploy();

    await hello.waitForDeployment();

    console.log("Hello contract deployed to:", await hello.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});