require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      // url: process.env.SEPOLIA_RPC_URL || process.env.ALCHEMY_API_URL, 
      url: "https://ethereum-sepolia-rpc.publicnode.com",
      accounts: (() => {
        try {
          let key = process.env.PRIVATE_KEY || process.env.SEPOLIA_PRIVATE_KEY;
          if (!key || key.includes("YOUR_PRIVATE_KEY")) return [];

          key = key.trim();

          let formattedKey = key;
          if (!formattedKey.startsWith("0x")) {
            formattedKey = "0x" + formattedKey;
          }

          // Basic length validation (0x + 64 hex chars = 66)
          if (formattedKey.length !== 66) {
            console.warn(`Warning: Private Key length is ${formattedKey.length}, expected 66. returning empty accounts.`);
            return [];
          }
          return [formattedKey];
        } catch (e) {
          console.warn("Error parsing private key:", e);
          return [];
        }
      })(),
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};
