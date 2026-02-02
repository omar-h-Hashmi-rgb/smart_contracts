# Sepolia Staking DApp 🚀

A decentralized application (DApp) running on the Sepolia Testnet that allows users to stake **TestDope (THOPE)** tokens and earn rewards over time. This project demonstrates full-stack Web3 development using Hardhat and React.

## 📋 Description

This Staking DApp allows users to:
- **Mint** TestDope (THOPE) tokens (ERC-20).
- **Stake** THOPE tokens into the Staking Smart Contract.
- **Earn Rewards** based on a fixed APY (Calculated simply as 1 token per second per unit in this demo).
- **Withdraw** staked tokens and claim accumulated rewards via a modern, dark-themed UI.

## 🛠 Tech Stack

- **Solidity** (Smart Contracts)
- **Hardhat** (Development Environment & Deployment)
- **Ethers.js v5** (Blockchain Interaction)
- **React.js** (Frontend UI)
- **OpenZeppelin** (ERC-20 Standard Contracts)

## ⚙️ Setup Instructions

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd staking-dapp
```

### 2. Install Dependencies
Install dependencies for both the backend (Hardhat) and frontend (React).

**Root directory (Hardhat):**
```bash
npm install
```

**Frontend directory:**
```bash
cd frontend
npm install
```

### 3. Environment Configuration (`.env`)
Create a `.env` file in the root directory `staking-dapp/` and add the following keys:

```ini
# API Key for Alchemy (Sepolia Network)
SEPOLIA_RPC_URL="https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_KEY"

# Your Wallet Private Key (Must start with 0x)
PRIVATE_KEY="0xYOUR_PRIVATE_KEY_HERE"

# Etherscan API Key (For verification)
ETHERSCAN_API_KEY="YOUR_ETHERSCAN_KEY"
```

## 🚀 How to Run

### 1. Compile Smart Contracts
In the root directory:
```bash
npx hardhat compile
```

### 2. Deploy to Sepolia Testnet
This script deploys the Token and Staking contracts and funds the Staking contract with rewards.
```bash
npx hardhat run scripts/deploy.js --network sepolia
```
*Make sure to copy the `Token Address` and `Staking Address` from the terminal output!*

### 3. Run the Frontend
Navigate to the frontend folder and start the React app or Vite server:
```bash
cd frontend
npm run dev
```
Open the provided Local URL (e.g., `http://localhost:5173`) in your browser.

## 📝 Contract Info

| Contract | Address | Network |
|----------|---------|---------|
| **TestDope Token** | `0x31452ee9ae03C13553884aB50a1AA67B70288503` | Sepolia |
| **Staking Contract** | `0x13DbfD80f518038d7175F2aa14Bf6e04731D98BA` | Sepolia |

---
*Built for educational purposes.*
