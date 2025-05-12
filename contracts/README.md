# Decentralized Voting Contract Tests & Scripts

This directory contains the smart contracts, tests, and deployment scripts for the decentralized voting platform.

## Contracts

- **GovernanceToken**: An ERC20 token with staking functionality for voting power
- **DAOVoting**: A contract for creating and managing proposals, with weighted voting based on staked tokens

## Testing

This project uses Foundry for testing. To run the tests:

```bash
cd contracts
forge test
```

To run a specific test file:

```bash
forge test --match-path test/GovernanceToken.t.sol -vvv
forge test --match-path test/DAOVoting.t.sol -vvv
```

## Deployment Scripts

The project includes several scripts for deploying and interacting with the contracts:

### Deployment

```bash
# Deploy both contracts at once
forge script script/Voting.s.sol:DeployAll --rpc-url <your_rpc_url> --broadcast

# Or deploy them separately
forge script script/Voting.s.sol:DeployGovernanceToken --rpc-url <your_rpc_url> --broadcast
forge script script/Voting.s.sol:DeployDAOVoting --rpc-url <your_rpc_url> --broadcast
```

### Token Operations

```bash
# Mint tokens
forge script script/GovernanceToken.s.sol:MintTokens --rpc-url <your_rpc_url> --broadcast

# Transfer tokens
forge script script/GovernanceToken.s.sol:TransferTokens --rpc-url <your_rpc_url> --broadcast

# Stake tokens for voting
forge script script/GovernanceToken.s.sol:StakeTokens --rpc-url <your_rpc_url> --broadcast
```

### Voting Operations

```bash
# Create a proposal
forge script script/DAOVoting.s.sol:CreateProposal --rpc-url <your_rpc_url> --broadcast

# Cast a vote
forge script script/DAOVoting.s.sol:CastVote --rpc-url <your_rpc_url> --broadcast

# Execute a proposal
forge script script/DAOVoting.s.sol:ExecuteProposal --rpc-url <your_rpc_url> --broadcast

# Delegate voting power
forge script script/DAOVoting.s.sol:DelegateVotes --rpc-url <your_rpc_url> --broadcast

# Get proposal details
forge script script/DAOVoting.s.sol:GetProposalDetails --rpc-url <your_rpc_url>
```

## Environment Variables

Copy the `.env.example` file to `.env` and update the values:

```bash
cp .env.example .env
```

Then edit the `.env` file with your configuration values.

## Testing on Local Node

To test on a local Anvil node:

```bash
# Start local node
anvil

# In another terminal, deploy the contracts
forge script script/Voting.s.sol:DeployAll --rpc-url http://localhost:8545 --broadcast
```

This will provide you with contract addresses to update in your `.env` file.