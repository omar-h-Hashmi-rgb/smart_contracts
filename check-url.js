require("dotenv").config();
const url = process.env.SEPOLIA_RPC_URL || process.env.ALCHEMY_API_URL;
console.log("Checking URL...");
if (!url) {
    console.log("Error: URL is missing.");
} else if (url.includes("YOUR_ALCHEMY_KEY_HERE")) {
    console.log("Error: URL contains placeholder text.");
} else {
    console.log("Success: URL looks valid.");
}
