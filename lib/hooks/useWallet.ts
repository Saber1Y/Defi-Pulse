"use client";

import { useState, useEffect } from "react";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";

interface UseWalletReturn {
  address: string | null;
  isConnected: boolean;
}

export function useWallet(): UseWalletReturn {
  const { primaryWallet } = useDynamicContext();
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (primaryWallet) {
      const addr = primaryWallet.address;
      setAddress(addr);
      setIsConnected(true);
    } else {
      setAddress(null);
      setIsConnected(false);
    }
  }, [primaryWallet]);

  return {
    address,
    isConnected,
  };
}
