const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    // 1. Deploy TestDope Token
    const TestDope = await hre.ethers.getContractFactory("TestDope");
    const testDope = await TestDope.deploy();
    await testDope.waitForDeployment();
    const testDopeAddress = await testDope.getAddress();
    console.log("TestDope Token deployed to:", testDopeAddress);

    // 2. Deploy Staking Contract
    // Staking both accepts TestDope and pays out TestDope
    const Staking = await hre.ethers.getContractFactory("Staking");
    const staking = await Staking.deploy(testDopeAddress, testDopeAddress);
    await staking.waitForDeployment();
    const stakingAddress = await staking.getAddress();
    console.log("Staking Contract deployed to:", stakingAddress);

    // 3. Fund the Staking Contract
    const fundAmount = hre.ethers.parseUnits("500000", 18);
    console.log("Funding staking contract with 500,000 THOPE...");

    const tx = await testDope.transfer(stakingAddress, fundAmount);
    await tx.wait();

    console.log("Transferred 500,000 THOPE to Staking Contract.");

    // Verify Balance
    const stakingBalance = await testDope.balanceOf(stakingAddress);
    console.log("Staking Contract Balance:", hre.ethers.formatUnits(stakingBalance, 18));
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
