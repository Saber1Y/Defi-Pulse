"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { getUserPosition, UserPosition } from "../contracts/tokos";

const SOMNIA_WSS = "wss://api.infra.testnet.somnia.network";
const TOKOS_CONTRACT = "0x7Cb9df1bc191B16BeFF9fdEC2cd1ef91Cac18176";

interface UsePositionReturn {
  position: UserPosition | null;
  previousPosition: UserPosition | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  hasChange: boolean;
  changeType: "improved" | "worsened" | null;
}

export function usePosition(address?: string | null): UsePositionReturn {
  const [position, setPosition] = useState<UserPosition | null>(null);
  const [previousPosition, setPreviousPosition] = useState<UserPosition | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const subscriptionRef = useRef<any>(null);

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

    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
    }

    if (address) {
      const setupReactivity = async () => {
        try {
          const { SDK } = await import("@somnia-chain/reactivity");
          const { createPublicClient, webSocket } = await import("viem");

          const pc = createPublicClient({
            chain: {
              id: 50312,
              name: "Somnia Testnet",
              nativeCurrency: { name: "STT", symbol: "STT", decimals: 18 },
              rpcUrls: {
                default: { http: ["https://dream-rpc.somnia.network/"] },
              },
            },
            transport: webSocket(SOMNIA_WSS),
          });

          const sdk = new SDK({ public: pc });

          const subscription = await sdk.subscribe({
            ethCalls: [],
            eventContractSources: [TOKOS_CONTRACT],
            onData: (data: any) => {
              fetchPosition();
            },
          });

          subscriptionRef.current = subscription;
        } catch (err) {
          console.log(err);
        }
      };

      setupReactivity();
    }

    // Cleanup on unmount
    return () => {
      if (subscriptionRef.current) {
        try {
          if (typeof subscriptionRef.current.unsubscribe === "function") {
            subscriptionRef.current.unsubscribe();
          }
        } catch (e) {
          console.log(e);
        }
      }
    };
  }, [address]);

  const hasChange =
    position &&
    previousPosition &&
    position.healthFactor !== previousPosition.healthFactor;
  const changeType = hasChange
    ? position.healthFactor > previousPosition.healthFactor
      ? "improved"
      : "worsened"
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
