"use client";

import { useState, useEffect, useCallback } from "react";
import { getUserPosition, UserPosition } from "../contracts/tokos";

interface UsePositionReturn {
  position: UserPosition | null;
  previousPosition: UserPosition | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  hasChange: boolean;
  changeType: 'improved' | 'worsened' | null;
}

export function usePosition(address?: string | null): UsePositionReturn {
  const [position, setPosition] = useState<UserPosition | null>(null);
  const [previousPosition, setPreviousPosition] = useState<UserPosition | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchPosition = useCallback(async () => {
    if (!address) {
      setPosition(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const result = await getUserPosition(address);
      if (result) {
        setPreviousPosition(position);
        setPosition(result);
      } else {
        setPosition(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setIsLoading(false);
    }
  }, [address, position]);

  useEffect(() => {
    fetchPosition();

    // Setup Reactivity - instant updates when YOU interact with Tokos
    if (address) {
      const setupReactivity = async () => {
        try {
          const { SDK } = await import('@somnia-chain/reactivity');
          const { createPublicClient, http } = await import('viem');
          
          const publicClient = createPublicClient({
            chain: { 
              id: 50312, 
              name: 'Somnia Testnet',
              nativeCurrency: { name: 'STT', symbol: 'STT', decimals: 18 },
              rpcUrls: { default: { http: ['https://dream-rpc.somnia.network/'] } },
            },
            transport: http(),
          });

          const sdk = new SDK({ public: publicClient });

          await sdk.subscribe({
            ethCalls: [],
            onData: (data: any) => {
              console.log("Reactivity: Your position updated!");
              fetchPosition();
            },
          });

          console.log("Portfolio Reactivity connected!");
        } catch (err) {
          // Setting up portfolio reactivity
        }
      };

      setupReactivity();
    }
  }, [address]);

  const hasChange = position && previousPosition && position.healthFactor !== previousPosition.healthFactor;
  const changeType = hasChange 
    ? (position.healthFactor > previousPosition.healthFactor ? 'improved' : 'worsened')
    : null;

  return { 
    position, 
    previousPosition,
    isLoading, 
    error, 
    refetch: fetchPosition,
    hasChange: !!hasChange,
    changeType,
  };
}
