"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { publicClient } from "../contracts/client";
import { formatEther } from "viem";

interface BlockchainData {
  blockNumber: bigint;
  ethBalance: string;
  gasPrice: bigint;
}

const SOMNIA_WSS = "wss://api.infra.testnet.somnia.network";
const TOKOS_CONTRACT = "0x7Cb9df1bc191B16BeFF9fdEC2cd1ef91Cac18176";

export function useBlockchainData(address?: string | null) {
  const [data, setData] = useState<BlockchainData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const subscriptionRef = useRef<any>(null);

  const fetchData = useCallback(async () => {
    try {
      const [blockNumber, gasPrice] = await Promise.all([
        publicClient.getBlockNumber(),
        publicClient.getGasPrice(),
      ]);

      let ethBalance = "0";
      if (address) {
        const balance = await publicClient.getBalance({ address: address as `0x${string}` });
        ethBalance = formatEther(balance);
      }

      setData({
        blockNumber,
        ethBalance,
        gasPrice,
      });
      setLastUpdate(new Date());
    } catch (error) {
      console.error("Error fetching blockchain data:", error);
    }
  }, [address]);

  useEffect(() => {
    fetchData();

    // Polling fallback - fetch every 5 seconds
    const pollInterval = setInterval(() => {
      fetchData();
    }, 5000);

    // Reactivity: subscribe to new blocks with WebSocket
    const setupReactivity = async () => {
      try {
        const { SDK } = await import("@somnia-chain/reactivity");
        const { createPublicClient, webSocket } = await import("viem");

        const pc = createPublicClient({
          chain: {
            id: 50312,
            name: "Somnia Testnet",
            nativeCurrency: { name: "STT", symbol: "STT", decimals: 18 },
            rpcUrls: { default: { http: ["https://dream-rpc.somnia.network/"] } },
          },
          transport: webSocket(SOMNIA_WSS),
        });

        const sdk = new SDK({ public: pc });

        const subscription = await sdk.subscribe({
          ethCalls: [],
          eventContractSources: [TOKOS_CONTRACT],
          onData: (sdkData: any) => {
            fetchData();
          },
        });

        subscriptionRef.current = subscription;
      } catch (err) {
        // Reactivity SDK not available, using polling
      }
    };

    setupReactivity();

    // Cleanup: unsubscribe when component unmounts
    return () => {
      clearInterval(pollInterval);
      if (subscriptionRef.current) {
        try {
          if (typeof subscriptionRef.current.unsubscribe === 'function') {
            subscriptionRef.current.unsubscribe();
          }
        } catch (e) {
          // Ignore cleanup errors
        }
      }
    };
  }, [fetchData]);

  return { data, isLoading, refetch: fetchData, lastUpdate };
}
