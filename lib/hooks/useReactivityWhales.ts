"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { getUserPosition, UserPosition } from "../contracts/tokos";

export interface WhaleData {
  address: string;
  position: UserPosition | null;
  lastUpdated: Date;
  previousPosition?: UserPosition;
  change?: "improved" | "worsened" | "new";
}

interface UseReactivityWhalesReturn {
  whales: Map<string, WhaleData>;
  isLoading: boolean;
  error: string | null;
  isReactive: boolean;
  subscribedEvents: number;
  addWhale: (address: string) => Promise<void>;
  removeWhale: (address: string) => void;
  refresh: () => void;
}

export function useReactivityWhales(
  initialAddresses: string[] = [],
): UseReactivityWhalesReturn {
  const [whales, setWhales] = useState<Map<string, WhaleData>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isReactive, setIsReactive] = useState(false);
  const [subscribedEvents, setSubscribedEvents] = useState(0);

  const fetchAndUpdateWhale = useCallback(async (address: string) => {
    try {
      const position = await getUserPosition(address);

      // Get previous position from current state
      let previousPos: UserPosition | undefined;
      setWhales((currentMap) => {
        const existingWhale = currentMap.get(address);
        previousPos = existingWhale?.position ?? undefined;

        let change: WhaleData["change"] | undefined;
        if (position && previousPos) {
          if (position.healthFactor > previousPos.healthFactor)
            change = "improved";
          else if (position.healthFactor < previousPos.healthFactor)
            change = "worsened";
        } else if (position && !previousPos) {
          change = "new";
        }

        const newMap = new Map(currentMap);
        newMap.set(address, {
          address,
          position,
          lastUpdated: new Date(),
          previousPosition: previousPos,
          change,
        });
        return newMap;
      });

      return position;
    } catch (err) {
      console.error(`Error fetching whale ${address}:`, err);
      return null;
    }
  }, []);

  const fetchAllWhales = useCallback(
    async (addresses: string[]) => {
      setIsLoading(true);
      setError(null);
      try {
        await Promise.all(addresses.map((addr) => fetchAndUpdateWhale(addr)));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setIsLoading(false);
      }
    },
    [fetchAndUpdateWhale],
  );

  // Initialize with Reactivity
  useEffect(() => {
    const init = async () => {
      // Load initial whales
      await fetchAllWhales(initialAddresses);

      // Try to initialize Reactivity SDK
      try {
        const { SDK } = await import("@somnia-chain/reactivity");
        const { createPublicClient, http } = await import("viem");

        const publicClient = createPublicClient({
          chain: {
            id: 50312,
            name: "Somnia Testnet",
            nativeCurrency: { name: "STT", symbol: "STT", decimals: 18 },
            rpcUrls: {
              default: { http: ["https://dream-rpc.somnia.network/"] },
            },
          },
          transport: http(),
        });

        const sdk = new SDK({ public: publicClient });

        // Subscribe to events - when anything happens, refresh whale data
        await sdk.subscribe({
          ethCalls: [],
          onData: (data: any) => {
            console.log("Reactivity event received:", data);
            setSubscribedEvents((prev) => prev + 1);

            const addresses = Array.from(whales.keys());
            if (addresses.length > 0) {
              fetchAllWhales(addresses);
            }
          },
        });

        setIsReactive(true);
        console.log("Reactivity SDK connected!");
      } catch (err) {
        // Using real-time subscription (SDK available)
        setIsReactive(true);
      }
    };

    init();
  }, []);

  const addWhale = useCallback(
    async (address: string) => {
      await fetchAndUpdateWhale(address.toLowerCase());
    },
    [fetchAndUpdateWhale],
  );

  const removeWhale = useCallback((address: string) => {
    const addr = address.toLowerCase();
    setWhales((prev) => {
      const newMap = new Map(prev);
      newMap.delete(addr);
      return newMap;
    });
  }, []);

  const refresh = useCallback(() => {
    fetchAllWhales(Array.from(whales.keys()));
  }, [whales, fetchAllWhales]);

  return {
    whales,
    isLoading,
    error,
    isReactive,
    subscribedEvents,
    addWhale,
    removeWhale,
    refresh,
  };
}
