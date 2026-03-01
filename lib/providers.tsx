"use client";

import { ReactNode, useState } from "react";
import {
  DynamicContextProvider,
  DynamicWidget,
} from "@dynamic-labs/sdk-react-core";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";
import { createConfig, WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http } from "viem";
import { somnia } from "./config";

const config = createConfig({
  chains: [somnia] as const,
  multiInjectedProviderDiscovery: false,
  transports: {
    [somnia.id]: http(),
  },
});

const queryClient = new QueryClient();

function ProvidersInner({ children }: { children: ReactNode }) {
  return (
    <DynamicContextProvider
      settings={{
        environmentId: "YOUR_DYNAMIC_ENVIRONMENT_ID",
        walletConnectors: [],
      }}
    >
      <DynamicWagmiConnector wagmiConfig={config}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </DynamicWagmiConnector>
    </DynamicContextProvider>
  );
}

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <DynamicContextProvider
          settings={{
            environmentId: "NEXT_PUBLIC_DYNAMIC_ID",
            walletConnectors: [],
          }}
        >
          <DynamicWagmiConnector wagmiConfig={config}>
            {children}
          </DynamicWagmiConnector>
        </DynamicContextProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export { DynamicWidget };
