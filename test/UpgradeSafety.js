const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("Upgrade Safety (Proxy state preserved)", function () {
  it("preserves critical storage values across V7 -> V8 upgrade", async function () {
    const [owner, user] = await ethers.getSigners();

    // Deploy token
    const MyToken = await ethers.getContractFactory("MyToken");
    const token = await MyToken.deploy();
    await token.waitForDeployment();
    const tokenAddr = await token.getAddress();

    // Deploy proxy with V7
    const V7 = await ethers.getContractFactory("TokenFaucetUpgradeableV7");
    const proxy = await upgrades.deployProxy(
      V7,
      [tokenAddr, ethers.parseUnits("10", 18), 60],
      { initializer: "initialize" }
    );
    await proxy.waitForDeployment();
    const proxyAddr = await proxy.getAddress();

    // Fund faucet with tokens so claims work
    await (await token.transfer(proxyAddr, ethers.parseUnits("1000", 18))).wait();

    // Snapshot critical state pre-upgrade
    const preOwner = await proxy.owner();
    const prePaused = await proxy.paused();
    const preCooldown = await proxy.cooldown();
    const preClaimAmount = await proxy.claimAmount();

    // Do one claim to ensure it works
    await proxy.connect(user).claim();
    const userBalPre = await token.balanceOf(user.address);
    expect(userBalPre).to.equal(ethers.parseUnits("10", 18));

    // Upgrade to V8
    const V8 = await ethers.getContractFactory("TokenFaucetUpgradeableV8");
    const upgraded = await upgrades.upgradeProxy(proxyAddr, V8);

    // Post-upgrade checks: storage preserved
    expect(await upgraded.owner()).to.equal(preOwner);
    expect(await upgraded.paused()).to.equal(prePaused);
    expect(await upgraded.cooldown()).to.equal(preCooldown);
    expect(await upgraded.claimAmount()).to.equal(preClaimAmount);

    // New logic exists: version()
    expect(await upgraded.version()).to.equal("v8");

    // Confirm user balance didn't get corrupted by upgrade
    const userBalPost = await token.balanceOf(user.address);
    expect(userBalPost).to.equal(userBalPre);
  });
});