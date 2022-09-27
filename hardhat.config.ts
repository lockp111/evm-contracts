import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@openzeppelin/hardhat-upgrades";
import "hardhat-gas-reporter";
import "hardhat-contract-sizer";
import "dotenv/config";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 100000
      },
    },
  },
  gasReporter: {
    currency: "USD",
    coinmarketcap: process.env.COINMARKETCAP,
    token: "BNB",
    gasPriceApi: "https://api.bscscan.com/api?module=proxy&action=eth_gasPrice",
    enabled: (process.env.GAS_REPORT) ? true : false,
  },
  networks: {
    testnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
      chainId: 97,
      from: process.env.FROM_ADDRESS,
      accounts: process.env.PRIVATE_KEY?.split(","),
    },
    mainnet: {
      url: "https://bsc-dataseed1.binance.org/",
      chainId: 56,
      accounts: "remote",
    },
  },
};

export default config;
