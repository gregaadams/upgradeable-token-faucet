const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("Upgrade Safety (Bad upgrade rejected)", function () {
  it("rejects an upgrade that breaks storage layout", async function () {
    const [owner] = await ethers.getSigners();

    const MyToken = await ethers.getContractFactory("MyToken");
    const token = await MyToken.deploy();
    await token.waitForDeployment();

    const V8 = await ethers.getContractFactory("TokenFaucetUpgradeableV8");
    const proxy = await upgrades.deployProxy(
      V8,
      [await token.getAddress(), ethers.parseUnits("10", 18), 60],
      { initializer: "initialize" }
    );
    await proxy.waitForDeployment();
    const proxyAddr = await proxy.getAddress();

    const Bad = await ethers.getContractFactory("TokenFaucetUpgradeableV9_BadStorage");

    // This should throw because OZ detects storage layout incompatibility
    await expect(upgrades.upgradeProxy(proxyAddr, Bad)).to.be.rejected;
  });
});