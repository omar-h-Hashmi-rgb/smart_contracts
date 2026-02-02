require("dotenv").config();
const key = process.env.PRIVATE_KEY;
console.log("Checking key...");
if (!key) {
    console.log("Error: PRIVATE_KEY is missing in .env");
} else if (key.includes("YOUR_PRIVATE_KEY")) {
    console.log("Error: PRIVATE_KEY is still the placeholder text.");
} else if (!key.startsWith("0x")) {
    console.log("Error: PRIVATE_KEY does not start with '0x'");
} else if (key.length !== 66) {
    console.log(`Error: PRIVATE_KEY length is ${key.length} (expected 66 for 0x + 64 hex chars).`);
} else {
    console.log("Success: PRIVATE_KEY format looks valid.");
}
