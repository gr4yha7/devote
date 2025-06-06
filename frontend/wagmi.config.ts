import { http } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { createConfig } from "wagmi";
import { injected, walletConnect } from "wagmi/connectors";
import { defineConfig } from "@wagmi/cli";
import { foundry } from "@wagmi/cli/plugins";

export default defineConfig({
  out: "./contracts/generated.ts",
  // contracts: [],
  plugins: [
    foundry({
      project: "../contracts",
      artifacts: "../contracts/out",
      // forge: {
      //   args: ['--chain-id', '1337'],
      // },
    }),
  ],
});

// Replace with your deployed contract address
// const VOTING_CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3'

// export const config = createConfig({
//   chains: [mainnet, sepolia],
//   transports: {
//     [mainnet.id]: http(),
//     [sepolia.id]: http(),
//   },
//   connectors: [
//     injected(),
//     walletConnect({
//       projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '95c850d7bc934e3c807c655fa1be29ea', // Get from WalletConnect Cloud
//     }),
//   ],
// })
