# Decentralized Voting dApp

A Web3 decentralized voting application built with Next.js, wagmi, and Solidity.

## Features

- Create and manage voting proposals
- Connect with various Web3 wallets (MetaMask, WalletConnect, etc.)
- Vote on active proposals
- View proposal results and voting history
- Real-time updates using blockchain events

## Tech Stack

- **Smart Contracts**: Solidity, Foundry
- **Frontend**: Next.js, wagmi, TailwindCSS
- **Blockchain**: Ethereum (Mainnet/Sepolia)

## Project Structure

This project uses a monorepo structure with two main packages:

- **contracts/**: Solidity smart contracts using Foundry
- **frontend/**: Next.js web application

## Prerequisites

- Node.js (v18 or later)
- Foundry (for smart contract development)
- MetaMask or any Web3 wallet
- Git (with support for submodules)

## Setup

1. Clone the repository with submodules:
```bash
git clone --recurse-submodules <repository-url>
cd decentralized-voting-dapp
```

2. Run the setup script to initialize both packages:
```bash
npm run setup
```

Alternatively, you can set up each package manually:

- For contracts:
```bash
cd contracts
forge install
```

- For frontend:
```bash
cd frontend
npm install
```

3. Deploy the smart contract:
```bash
npm run contracts:build
cd contracts
forge script script/Voting.s.sol:VotingScript --rpc-url <your-rpc-url> --broadcast
```

4. Update the contract address:
- Copy the deployed contract address
- Update `VOTING_CONTRACT_ADDRESS` in `frontend/wagmi.config.ts`

5. Update contract ABIs in the frontend:
```bash
npm run update-abis
```

6. Start the development server:
```bash
npm run frontend:dev
```

## Development

### Using the Monorepo

The root directory contains scripts to work with both packages:

```bash
# Build contracts and run frontend development server
npm run dev

# Build both packages for production
npm run build

# Run contract tests
npm run contracts:test

# Build contracts only
npm run contracts:build

# Update frontend with latest contract ABIs
npm run update-abis
```

### Smart Contracts

- Contracts are located in `contracts/src/`
- Tests are in `contracts/test/`
- Run tests with: `npm run contracts:test`

### Frontend

- Main application code is in `frontend/app/`
- Components are in `frontend/components/`
- Run development server: `npm run frontend:dev`

## Testing

```bash
# Run smart contract tests
npm run contracts:test

# Run frontend tests
cd frontend && npm test
```

## Deployment

1. Deploy Smart Contract:
```bash
cd contracts
forge script script/Voting.s.sol:VotingScript --rpc-url <mainnet-rpc-url> --broadcast
```

2. Update ABIs and frontend configuration:
```bash
npm run update-abis
# Update contract addresses in frontend config
```

3. Build and deploy frontend:
```bash
npm run frontend:build
# Deploy frontend using your preferred hosting service
```

## Working with Git Submodules

This project uses git submodules for Foundry libraries. Common commands:

```bash
# Clone with submodules
git clone --recurse-submodules <repository-url>

# If already cloned without submodules
git submodule update --init --recursive

# Update submodules to latest
git submodule update --remote
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT 