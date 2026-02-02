const hre = require("hardhat");

async function main() {
    console.log("Checking connection to:", hre.network.name);
    try {
        const blockNumber = await hre.ethers.provider.getBlockNumber();
        console.log("Current Block Number:", blockNumber);
    } catch (error) {
        console.error("Connection failed:", error.message);
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
