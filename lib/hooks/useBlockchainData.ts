"use client";

import { useState, useEffect, useCallback } from "react";
import { publicClient } from "../contracts/client";
import { formatEther } from "viem";

interface BlockchainData {
  blockNumber: bigint;
  ethBalance: string;
  gasPrice: bigint;
}

export function useBlockchainData(address?: string | null) {
  const [data, setData] = useState<BlockchainData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

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

    // Reactivity: subscribe to new blocks
    const setupReactivity = async () => {
      try {
        const { SDK } = await import("@somnia-chain/reactivity");
        const { createPublicClient, http } = await import("viem");

        const pc = createPublicClient({
          chain: {
            id: 50312,
            name: "Somnia Testnet",
            nativeCurrency: { name: "STT", symbol: "STT", decimals: 18 },
            rpcUrls: { default: { http: ["https://dream-rpc.somnia.network/"] } },
          },
          transport: http(),
        });

        const sdk = new SDK({ public: pc });

        await sdk.subscribe({
          ethCalls: [],
          onData: (sdkData: any) => {
            fetchData();
          },
        });
      } catch (err) {
        // Reactivity SDK not available, using polling
      }
    };

    setupReactivity();

    return () => clearInterval(pollInterval);
  }, [fetchData]);

  return { data, isLoading, refetch: fetchData, lastUpdate };
}
