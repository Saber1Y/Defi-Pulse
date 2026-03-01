"use client";

import { ReactNode } from "react";
import {
  DynamicContextProvider,
  DynamicWidget,
} from "@dynamic-labs/sdk-react-core";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { createConfig, WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http } from "viem";
import { somnia } from "./config";

const somniaEvmNetwork = {
  blockExplorerUrls: ["https://shannon-explorer.somnia.network/"],
  chainId: 50312,
  chainName: "Somnia Testnet",
  iconUrls: ["https://app.dynamic.xyz/assets/networks/somnia.svg"],
  name: "Somnia",
  nativeCurrency: {
    decimals: 18,
    name: "Somnia Test Token",
    symbol: "STT",
  },
  networkId: 50312,
  rpcUrls: ["https://dream-rpc.somnia.network/"],
  vanityName: "Somnia Testnet",
};

const config = createConfig({
  chains: [somnia] as const,
  multiInjectedProviderDiscovery: false,
  transports: {
    [somnia.id]: http(),
  },
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <DynamicContextProvider
      settings={{
        environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ID || "",
        walletConnectors: [EthereumWalletConnectors],
        overrides: {
          evmNetworks: [somniaEvmNetwork],
        },
      }}
    >
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <DynamicWagmiConnector>
            {children}
          </DynamicWagmiConnector>
        </QueryClientProvider>
      </WagmiProvider>
    </DynamicContextProvider>
  );
}

export { DynamicWidget };
