"use client";

import { useState, useEffect, useRef } from "react";
import { ProtocolMonitoring } from "@/components/ProtocolMonitoring";
import { useBlockchainData } from "@/lib/hooks/useBlockchainData";
import { getProtocolStats } from "@/lib/contracts/tokos";

export function AnalyticsView() {
  const { data } = useBlockchainData();
  const [reserves, setReserves] = useState<string[]>([]);
  const [blockTimes, setBlockTimes] = useState<number[]>([]);
  const lastBlockRef = useRef<bigint>(BigInt(0));

  useEffect(() => {
    getProtocolStats().then(stats => {
      setReserves(stats.reserves || []);
    });
  }, []);

  useEffect(() => {
    if (data?.blockNumber && lastBlockRef.current > 0) {
      const diff = Number(data.blockNumber - lastBlockRef.current);
      if (diff > 0 && diff < 10) {
        setBlockTimes(prev => [...prev.slice(-19), diff]);
      }
    }
    if (data?.blockNumber) {
      lastBlockRef.current = data.blockNumber;
    }
  }, [data?.blockNumber]);

  const avgBlockTime = blockTimes.length > 0 
    ? (blockTimes.reduce((a, b) => a + b, 0) / blockTimes.length).toFixed(2)
    : "--";

  const formatGwei = (val: bigint | undefined) => {
    if (!val) return "--";
    return (Number(val) / 1e9).toFixed(2);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Analytics</h2>
        <p className="text-text-secondary">
          Live blockchain metrics with real-time updates
        </p>
      </div>

      <div className="bg-accent-cyan/10 border border-accent-cyan/30 rounded-xl p-4">
        <p className="text-accent-cyan font-medium">⚡ Live Blockchain Data via Reactivity SDK</p>
        <p className="text-text-secondary text-sm mt-1">
          Auto-updates when new blocks are mined - no refresh needed
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-card border border-card-border rounded-xl p-6">
          <p className="text-text-secondary text-sm mb-2">Current Block</p>
          <p className="text-4xl font-bold text-accent-cyan">
            #{data?.blockNumber?.toString() || "--"}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-accent-green rounded-full animate-pulse"></span>
            <span className="text-xs text-text-tertiary">Live</span>
          </div>
        </div>

        <div className="bg-card border border-card-border rounded-xl p-6">
          <p className="text-text-secondary text-sm mb-2">Avg Block Time</p>
          <p className="text-4xl font-bold">{avgBlockTime}s</p>
          <p className="text-text-tertiary text-sm">last 20 blocks</p>
        </div>

        <div className="bg-card border border-card-border rounded-xl p-6">
          <p className="text-text-secondary text-sm mb-2">Gas Price</p>
          <p className="text-4xl font-bold">{formatGwei(data?.gasPrice)}</p>
          <p className="text-text-tertiary text-sm">Gwei</p>
        </div>

        <div className="bg-card border border-card-border rounded-xl p-6">
          <p className="text-text-secondary text-sm mb-2">Tokos Reserves</p>
          <p className="text-4xl font-bold">{reserves.length}</p>
          <p className="text-text-tertiary text-sm">assets</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-card-border rounded-xl p-6">
          <p className="text-text-secondary text-sm mb-2">Somnia Network TPS</p>
          <p className="text-4xl font-bold text-accent-green">1M+</p>
          <p className="text-text-tertiary text-sm">theoretical max</p>
        </div>

        <div className="bg-card border border-card-border rounded-xl p-6">
          <p className="text-text-secondary text-sm mb-2">Finality</p>
          <p className="text-4xl font-bold">&lt;1s</p>
          <p className="text-text-tertiary text-sm">sub-second</p>
        </div>

        <div className="bg-card border border-card-border rounded-xl p-6">
          <p className="text-text-secondary text-sm mb-2"> Block Count (Reactivity)</p>
          <div className="flex items-baseline gap-2">
            <p className="text-4xl font-bold text-accent-cyan">{blockTimes.length}</p>
            <p className="text-text-tertiary text-sm">updates</p>
          </div>
        </div>
      </div>

      <div className="bg-card border border-card-border rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Block Time History</h3>
        <div className="h-32 flex items-end gap-1">
          {blockTimes.length === 0 ? (
            <p className="text-text-tertiary">Collecting data...</p>
          ) : (
            blockTimes.map((time, i) => (
              <div
                key={i}
                className="flex-1 bg-accent-cyan/60 rounded-t"
                style={{ height: `${Math.min(time * 20, 100)}%` }}
                title={`Block time: ${time}s`}
              />
            ))
          )}
        </div>
        <p className="text-text-tertiary text-xs mt-2">Last {blockTimes.length} blocks</p>
      </div>
    </div>
  );
}
