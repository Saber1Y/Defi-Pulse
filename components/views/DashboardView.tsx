"use client";

import { useState, useEffect, useRef } from "react";
import { AlertBanner } from "@/components/AlertBanner";
import { ProtocolMonitoring } from "@/components/ProtocolMonitoring";
import { AlertsPanel } from "@/components/AlertsPanel";
import { useBlockchainData } from "@/lib/hooks/useBlockchainData";
import { getUserPosition } from "@/lib/contracts/tokos";
import { Zap, Activity, Blocks } from "lucide-react";

interface DashboardViewProps {
  walletAddress: string | null;
}

export function DashboardView({ walletAddress }: DashboardViewProps) {
  const { data: blockchainData, refetch } = useBlockchainData(walletAddress);
  const [position, setPosition] = useState<any>(null);
  const [isLoadingPos, setIsLoadingPos] = useState(false);
  const [activityLog, setActivityLog] = useState<{time: Date, message: string, type: string}[]>([]);
  const prevBlockRef = useRef<bigint>(BigInt(0));

  useEffect(() => {
    if (walletAddress) {
      setIsLoadingPos(true);
      getUserPosition(walletAddress).then((pos) => {
        setPosition(pos);
        setIsLoadingPos(false);
      });
    }
  }, [walletAddress]);

  useEffect(() => {
    if (blockchainData?.blockNumber && prevBlockRef.current > 0) {
      const newBlocks = Number(blockchainData.blockNumber - prevBlockRef.current);
      if (newBlocks > 0) {
        setActivityLog(prev => [{
          time: new Date(),
          message: `New block mined: #${blockchainData.blockNumber}`,
          type: 'block'
        }, ...prev].slice(0, 10));
      }
    }
    if (blockchainData?.blockNumber) {
      prevBlockRef.current = blockchainData.blockNumber;
    }
  }, [blockchainData?.blockNumber]);

  const formatETH = (val: string) => {
    if (!val) return "--";
    const num = parseFloat(val);
    if (num === 0) return "0";
    return num.toFixed(4);
  };

  const formatUSD = (val: number) => {
    if (!val || val === 0) return "--";
    return `$${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
        <p className="text-text-secondary">
          Real-time overview of DeFi protocol
        </p>
      </div>

      <div className="bg-accent-cyan/10 border border-accent-cyan/30 rounded-xl p-4 flex items-center gap-3">
        <Zap size={20} className="text-accent-cyan" />
        <div>
          <p className="text-accent-cyan text-sm font-medium">Reactivity SDK Active</p>
          <p className="text-text-secondary text-xs">Updates push automatically - no polling needed</p>
        </div>
      </div>

      {walletAddress ? (
        <div className="bg-card border border-card-border rounded-xl p-4">
          <p className="text-accent-cyan text-sm">
             Connected: {walletAddress.slice(0, 10)}...{walletAddress.slice(-8)}
          </p>
          <p className="text-text-secondary text-xs mt-1">
            Balance: {formatETH(blockchainData?.ethBalance || "0")} STT
          </p>
        </div>
      ) : (
        <div className="bg-accent-yellow/10 border border-accent-yellow/30 rounded-xl p-4">
          <p className="text-accent-yellow text-sm">
             Connect wallet to view portfolio data
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-card-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Blocks size={20} className="text-accent-cyan" />
                <p className="text-text-secondary">Current Block</p>
              </div>
              <span className="flex items-center gap-2 text-xs text-accent-green">
                <span className="w-2 h-2 bg-accent-green rounded-full animate-pulse"></span>
                Live
              </span>
            </div>
            <p className="text-4xl font-bold text-accent-cyan">
              #{blockchainData?.blockNumber?.toString() || "--"}
            </p>
            <p className="text-text-tertiary text-sm mt-2">
              Gas: {blockchainData?.gasPrice ? formatETH(blockchainData.gasPrice.toString()) : "--"} Gwei
            </p>
          </div>

          <div className="bg-card border border-card-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity size={20} className="text-accent-cyan" />
                <p className="text-text-secondary">Live Activity Feed</p>
              </div>
              <span className="text-xs text-text-tertiary">{activityLog.length} events</span>
            </div>
            <div className="space-y-2">
              {activityLog.length === 0 ? (
                <p className="text-text-tertiary text-sm">Waiting for block updates...</p>
              ) : (
                activityLog.map((event, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary">{event.message}</span>
                    <span className="text-text-tertiary text-xs">{event.time.toLocaleTimeString()}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <AlertsPanel alerts={[]} />
          
          <div className="bg-card border border-card-border rounded-xl p-4">
            <p className="text-text-secondary text-sm mb-4">Your Position</p>
            <div className="space-y-3">
              <div>
                <p className="text-text-tertiary text-xs">Health Factor</p>
                <p className="text-2xl font-bold text-accent-cyan">
                  {position?.healthFactor ? (Number.isFinite(position.healthFactor) ? position.healthFactor.toFixed(2) : "∞") : "--"}
                </p>
              </div>
              <div>
                <p className="text-text-tertiary text-xs">Total Supply</p>
                <p className="text-xl font-bold">{formatUSD(position?.totalCollateralUSD || 0)}</p>
              </div>
              <div>
                <p className="text-text-tertiary text-xs">Total Borrow</p>
                <p className="text-xl font-bold">{formatUSD(position?.totalDebtUSD || 0)}</p>
              </div>
              <div>
                <p className="text-text-tertiary text-xs">Net Worth</p>
                <p className="text-xl font-bold text-accent-green">
                  {formatUSD((position?.totalCollateralUSD || 0) - (position?.totalDebtUSD || 0))}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
