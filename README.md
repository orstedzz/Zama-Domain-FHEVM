
# � Zama Domain FHEVM DApp

Zama Domain FHEVM is a Web3 decentralized application (DApp) that enables users to register, manage, and trade `.zama` blockchain domains with privacy powered by Fully Homomorphic Encryption (FHEVM). The project demonstrates seamless integration of FHEVM smart contracts and a modern, user-friendly frontend.

**Live Demo:** https://zama-domain-fhevm.vercel.app/

---

## 📝 Project Description

**Zama Domain FHEVM** allows anyone to:
- Register and own unique `.zama` domains on-chain
- Search, check availability, and purchase domains with a single click
- Manage owned domains in a personal dashboard
- Experience privacy-preserving blockchain operations using FHEVM
- Connect with MetaMask, OKX, or Rabbit wallets (Sepolia testnet)

The DApp is built with Next.js 15, React 19, wagmi v2, ethers.js, and integrates Zama's FHEVM for future encrypted domain data support. The UI is designed to be warm, friendly, and accessible, with seasonal effects (e.g., snow in winter).

---

## 🚀 Quick Start

**Deployed Contract (Sepolia):** `0x6b5d2E225b36B604F7c55f93B7922c2B46F5940C`

### Requirements
- Node.js v18+
- npm v9+
- Hardhat (included)
- MetaMask/OKX/Rabbit wallet extension
- Sepolia Testnet access

### Installation
```bash
git clone https://github.com/orstedzz/Zama-Domain-FHEVM.git
cd Zama-Domain-FHEVM
npm install
```

### Environment Setup
Create a `.env` file in the project root:
```bash
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/<your-infura-id>
PRIVATE_KEY=<your-wallet-private-key>
ETHERSCAN_API_KEY=<your-etherscan-key>
```

### Build & Test
Compile contracts:
```bash
npx hardhat compile
```
Run a local blockchain node:
```bash
npx hardhat node
```
Deploy contracts to localhost:
```bash
npx hardhat deploy --network localhost
```
Run frontend (development mode):
```bash
cd frontend
npm run dev
```

### Deploy
Deploy to Sepolia testnet:
```bash
npx hardhat deploy --network sepolia
```

---

## 📁 Project Structure
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

## 🧰 NPM Scripts
**Root project:**
```bash
npm run compile   # Compile smart contracts
npm run deploy    # Deploy contracts
npm run test      # Run Hardhat tests
```
**Frontend:**
```bash
npm run dev       # Start Next.js dev server
npm run build     # Build production bundle
npm run start     # Run production server
```

## 📚 Documentation & Resources

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [FHEVM Hardhat Setup Guide](https://docs.zama.ai/protocol/solidity-guides/getting-started/setup)
- [FHEVM Testing Guide](https://docs.zama.ai/protocol/solidity-guides/development-guide/hardhat/write_test)
- [FHEVM Hardhat Plugin](https://docs.zama.ai/protocol/solidity-guides/development-guide/hardhat)

## 📄 License

This project is licensed under the BSD-3-Clause-Clear License. See the [LICENSE](LICENSE) file for details.

---
Discord: orsted_z
> ✍️ Maintained by [@orstedzz](https://github.com/orstedzz)
