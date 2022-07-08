require("dotenv").config();
require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.4",
  paths: {
    artifacts: "./src/backend/artifacts",
    sources: "./src/backend/contracts",
    cache: "./src/backend/cache",
    tests: "./src/backend/test",
  },
  networks: {
    mumbai: {
      url: process.env.MUMBAI_ALCHEMY_URL,
      accounts: [process.env.MUMBAI_PRIVATE_KEY],
    },
    goerli: {
      url: process.env.GOERLI_INFURA_URL,
      accounts: [process.env.METAMASK_PRIVATE_KEY],
    },
  },
};
