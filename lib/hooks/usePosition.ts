"use client";

import { useState, useEffect, useCallback } from "react";
import { getUserPosition, UserPosition } from "../contracts/tokos";

interface UsePositionReturn {
  position: UserPosition | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function usePosition(address?: string | null): UsePositionReturn {
  const [position, setPosition] = useState<UserPosition | null>(null);
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
      setPosition(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  useEffect(() => {
    fetchPosition();
  }, [fetchPosition]);

  return { position, isLoading, error, refetch: fetchPosition };
}
