require("@openzeppelin/hardhat-upgrades");
require("@nomicfoundation/hardhat-toolbox");
//require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();

module.exports = {
  defaultNetwork: "localhost",
  solidity: "0.8.20",
  networks: {
    localhost: { url: "http://127.0.0.1:8545" },
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
  },

  // 👇 ADD THIS BLOCK HERE (same level as solidity + networks)
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};
