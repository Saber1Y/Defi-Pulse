"use client";


import { useDynamicContext } from "@dynamic-labs/sdk-react-core";

interface UseWalletReturn {
  address: string | null;
  isConnected: boolean;
}

export function useWallet(): UseWalletReturn {
  const { primaryWallet } = useDynamicContext();
  const address = primaryWallet?.address ?? null;
  const isConnected = !!primaryWallet;

  return {
    address,
    isConnected,
  };
}
