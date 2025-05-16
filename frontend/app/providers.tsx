"use client";

import { FC, PropsWithChildren } from "react";
import { injected, WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http } from "wagmi";
import { mainnet, sepolia, hardhat } from "wagmi/chains";
import { createConfig } from "wagmi";
import { CivicAuthProvider } from "@civic/auth-web3/nextjs";
import { embeddedWallet } from "@civic/auth-web3/wagmi";

export const config = createConfig({
  chains: [hardhat, mainnet, sepolia],
  transports: {
    [hardhat.id]: http(),
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
  connectors: [
    // injected(),
    embeddedWallet(),
  ],
  ssr: true,
});

// Create a client
const queryClient = new QueryClient();

type ProvidersProps = PropsWithChildren<{
  onSessionEnd?: () => void;
}>;

export const Providers: FC<ProvidersProps> = ({ children }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <CivicAuthProvider initialChain={sepolia}>{children}</CivicAuthProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
