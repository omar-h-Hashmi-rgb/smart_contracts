require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
    solidity: "0.8.28",
    networks: {
        sepolia: {
            url: "https://ethereum-sepolia-rpc.publicnode.com",
            accounts: (() => {
                try {
                    const key = process.env.PRIVATE_KEY || process.env.SEPOLIA_PRIVATE_KEY;
                    if (!key) return [];
                    const k = key.trim();
                    return [k.startsWith("0x") ? k : "0x" + k];
                } catch { return []; }
            })(),
        },
    },
};
