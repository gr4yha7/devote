"use client";

import { FC, PropsWithChildren } from "react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { createConfig } from "wagmi";
import { CivicAuthProvider } from "@civic/auth-web3/nextjs";
import { embeddedWallet } from "@civic/auth-web3/wagmi";

export const config = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
  connectors: [embeddedWallet()],
  ssr: true,
});

// Create a client
const queryClient = new QueryClient();

type ProvidersProps = PropsWithChildren<{
  onSessionEnd?: () => void;
}>;

export const Providers: FC<ProvidersProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>
        <CivicAuthProvider initialChain={sepolia}>{children}</CivicAuthProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
};
