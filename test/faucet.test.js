const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("Upgradeable Token Faucet", function () {

  let token;
  let faucet;
  let owner;
  let user;
  let attacker;

  beforeEach(async function () {

    [owner, user, attacker] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("MyToken");
    token = await Token.deploy();
    await token.waitForDeployment();

    const Faucet = await ethers.getContractFactory("TokenFaucetUpgradeableV8");

    faucet = await upgrades.deployProxy(
      Faucet,
      [
        await token.getAddress(),
        ethers.parseUnits("10", 18),
        60
      ],
      { initializer: "initialize" }
    );

    await faucet.waitForDeployment();

    // fund faucet with tokens
    await token.transfer(await faucet.getAddress(), ethers.parseUnits("1000", 18));
  });

  it("should allow users to claim tokens", async function () {

    const before = await token.balanceOf(user.address);

    await faucet.connect(user).claim();

    const after = await token.balanceOf(user.address);

    expect(after).to.be.gt(before);

  });

  it("should enforce cooldown between claims", async function () {

    await faucet.connect(user).claim();

    await expect(
      faucet.connect(user).claim()
    ).to.be.reverted;

  });

  it("should block non-owner from withdrawing fees", async function () {

    await expect(
      faucet.connect(attacker).withdrawFees(attacker.address)
    ).to.be.reverted;

  });

});