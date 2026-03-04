"use client";

import { useState, useEffect, useCallback } from "react";
import { getUserPosition, UserPosition } from "../contracts/tokos";

export interface WhaleData {
  address: string;
  position: UserPosition | null;
  lastUpdated: Date;
}

interface UseWhalesReturn {
  whales: Map<string, WhaleData>;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

// Sample whale addresses to track
export const WHALE_ADDRESSES = [
  '0x742d35Cc6634C0532925a3b844Bc9e7595f8fE12',
  '0x9fB29d6cB4e8B3fB8a4C5D6E7F8A1B2C3D4E5F6A',
  '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
  '0xABCDEF1234567890abcdef1234567890abcdef12',
  '0x1234567890abcdef1234567890abcdef12345678',
] as const;

export function useWhales(addresses: readonly string[] = WHALE_ADDRESSES): UseWhalesReturn {
  const [whales, setWhales] = useState<Map<string, WhaleData>>(new Map());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchWhales = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const results = new Map<string, WhaleData>();
      
      await Promise.all(
        addresses.map(async (address) => {
          try {
            const position = await getUserPosition(address);
            results.set(address, {
              address,
              position,
              lastUpdated: new Date(),
            });
          } catch (err) {
            results.set(address, {
              address,
              position: null,
              lastUpdated: new Date(),
            });
          }
        })
      );

      setWhales(results);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setIsLoading(false);
    }
  }, [addresses]);

  useEffect(() => {
    fetchWhales();
  }, [fetchWhales]);

  return { whales, isLoading, error, refetch: fetchWhales };
}
