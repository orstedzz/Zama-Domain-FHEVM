**# 🌐 Zama Domain Registry

A **Web3 application** that allows users to **buy, check, and manage `.zama` domains** on the blockchain using **FHEVM (Fully Homomorphic Encryption Virtual Machine)**.**
**Website: https://zama-domain-fhevm.vercel.app/**
**Contract: 0x6b5d2E225b36B604F7c55f93B7922c2B46F5940C**
---

## 🚀 Quick Start

### ✅ Requirements
- **Node.js** v18+  
- **npm** v9+  
- **Hardhat** (included in project)  
- **MetaMask** (for wallet connection)  
- Access to **Sepolia Testnet** (or Hardhat localhost node)  

### 📦 Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/<your-username>/Zama-Domain-FHEVM.git
cd Zama-Domain-FHEVM
npm install
```

### 🔐 Environment Setup
Create an `.env` file in the project root:
```bash
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/<your-infura-id>
PRIVATE_KEY=<your-wallet-private-key>
ETHERSCAN_API_KEY=<your-etherscan-key>
```
###🔨 Build & Test

#Compile contracts:
```bash
npx hardhat compile
```
#Run a local blockchain node:
```bash
npx hardhat node
```
#Deploy contracts to localhost:
```bash
npx hardhat deploy --network localhost
```
#Run frontend (in development mode):
```bash
cd frontend
npm run dev
```

###📡 Deploy

#Deploy to Sepolia testnet:
```bash
npx hardhat deploy --network sepolia
```
Latest deployed contract:
```bash
ZamaDomainRegistry (Sepolia)
0x6b5d2E225b36B604F7c55f93B7922c2B46F5940C
```
###📁 Project Structure
```bash
Zama-Domain-FHEVM/
│── contracts/            # Solidity smart contracts
│   └── ZamaDomainRegistry.sol
│── deploy/               # Deployment scripts
│── tasks/                # Hardhat custom tasks
│── frontend/             # Next.js + Wagmi frontend
│   ├── app/              # Next.js App Router pages
│   ├── components/       # React components (UI, Wallet, Domain modules)
│   ├── lib/              # Wagmi config, utils
│   └── abi/              # Contract ABIs
│── hardhat.config.ts     # Hardhat configuration
│── package.json
└── README.md
```
###🧰 NPM Scripts
#Root project
```bash
npm run compile   # Compile smart contracts
npm run deploy    # Deploy contracts
npm run test      # Run Hardhat tests
```
#Frontend
```bash
npm run dev       # Start Next.js dev server
npm run build     # Build production bundle
npm run start     # Run production server
```
## 📚 Documentation

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [FHEVM Hardhat Setup Guide](https://docs.zama.ai/protocol/solidity-guides/getting-started/setup)
- [FHEVM Testing Guide](https://docs.zama.ai/protocol/solidity-guides/development-guide/hardhat/write_test)
- [FHEVM Hardhat Plugin](https://docs.zama.ai/protocol/solidity-guides/development-guide/hardhat)

## 📄 License

This project is licensed under the BSD-3-Clause-Clear License. See the [LICENSE](LICENSE) file for details.

---
Discord: orsted_z
> ✍️ Signed with GPG by [@orstedzz](https://github.com/orstedzz)
