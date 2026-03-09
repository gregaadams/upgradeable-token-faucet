require("@nomicfoundation/hardhat-toolbox");
require("@openzeppelin/hardhat-upgrades");
require("dotenv").config();

const SEPOLIA_URL = process.env.SEPOLIA_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    ...(SEPOLIA_URL && PRIVATE_KEY
      ? {
          sepolia: {
            url: SEPOLIA_URL,
            accounts: [PRIVATE_KEY],
          },
        }
      : {}),
  },
};