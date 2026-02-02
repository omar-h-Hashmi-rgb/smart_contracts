const fs = require("fs");
const path = require("path");

const contracts = ["TestDope", "Staking"];
const frontendPath = path.join(__dirname, "../frontend/src/abis");

if (!fs.existsSync(frontendPath)) {
    fs.mkdirSync(frontendPath, { recursive: true });
}

contracts.forEach((contract) => {
    const artifactPath = path.join(
        __dirname,
        `../artifacts/contracts/${contract}.sol/${contract}.json`
    );

    if (fs.existsSync(artifactPath)) {
        const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
        const abi = artifact.abi;

        fs.writeFileSync(
            path.join(frontendPath, `${contract}.json`),
            JSON.stringify(abi, null, 2)
        );
        console.log(`Extracted ABI for ${contract}`);
    } else {
        console.error(`Artifact not found for ${contract}`);
    }
});
