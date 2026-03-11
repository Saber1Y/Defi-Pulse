"use client";

import { useState, useEffect, useRef } from "react";
import { useBlockchainData } from "@/lib/hooks/useBlockchainData";
import { getTokenBalance } from "@/lib/contracts/tokos";
import { Wallet, Activity, Zap, Clock, Fuel, TrendingUp } from "lucide-react";

export function AnalyticsView() {
  const { data, lastUpdate } = useBlockchainData();
  const [tokenBalances, setTokenBalances] = useState<
    { address: string; balance: string; symbol: string }[]
  >([]);
  const [inputAddress, setInputAddress] = useState("");
  const [blockTimes, setBlockTimes] = useState<number[]>([]);
  const [tps, setTps] = useState<number>(0);
  const lastBlockRef = useRef<bigint>(BigInt(0));
  const startBlockRef = useRef<bigint>(BigInt(0));
  const startTimeRef = useRef<number>(Date.now());

  // Testnet STT token
  const STT_TOKEN = "0x7f89af8b3c0A68F536Ff20433927F4573CF001A3";

  useEffect(() => {
    if (data?.blockNumber && lastBlockRef.current > 0) {
      const diff = Number(data.blockNumber - lastBlockRef.current);
      if (diff > 0 && diff < 10) {
        setBlockTimes((prev) => [...prev.slice(-19), diff]);

        // Calculate TPS (rough estimate)
        if (startBlockRef.current === BigInt(0)) {
          startBlockRef.current = data.blockNumber;
          startTimeRef.current = Date.now();
        } else {
          const blocksMined = Number(data.blockNumber - startBlockRef.current);
          const timeElapsed = (Date.now() - startTimeRef.current) / 1000;
          if (timeElapsed > 10) {
            setTps(Math.round((blocksMined / timeElapsed) * 100)); // rough TPS estimate
          }
        }
      }
    }
    if (data?.blockNumber) {
      lastBlockRef.current = data.blockNumber;
    }
  }, [data?.blockNumber]);

  const fetchTokenBalance = async () => {
    if (!inputAddress.startsWith("0x") || inputAddress.length !== 42) return;

    const [native, stt] = await Promise.all([
      data?.ethBalance || "0",
      getTokenBalance(STT_TOKEN, inputAddress),
    ]);

    setTokenBalances((prev) => {
      const filtered = prev.filter(
        (t) => t.address !== inputAddress.toLowerCase(),
      );
      const newBalances = [
        {
          address: inputAddress.toLowerCase(),
          balance: native,
          symbol: "STT (Native)",
        },
      ];
      if (stt) {
        newBalances.push({
          address: inputAddress.toLowerCase(),
          balance: stt.balance,
          symbol: stt.symbol,
        });
      }
      return [...filtered, ...newBalances];
    });
  };

  const avgBlockTime =
    blockTimes.length > 0
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
          Live blockchain metrics - powered by Reactivity SDK
        </p>
      </div>

      {lastUpdate && (
        <div className="text-xs text-text-tertiary">
          Last update: {lastUpdate.toLocaleTimeString()}
        </div>
      )}

      {/* Network Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-card-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity size={16} className="text-accent-cyan" />
            <span className="text-text-secondary text-sm">Current Block</span>
          </div>
          <p className="text-2xl font-bold text-accent-cyan">
            #{data?.blockNumber?.toString() || "--"}
          </p>
        </div>

        <div className="bg-card border border-card-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={16} className="text-accent-cyan" />
            <span className="text-text-secondary text-sm">Block Time</span>
          </div>
          <p className="text-2xl font-bold">{avgBlockTime}s</p>
        </div>

        <div className="bg-card border border-card-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Fuel size={16} className="text-accent-cyan" />
            <span className="text-text-secondary text-sm">Gas Price</span>
          </div>
          <p className="text-2xl font-bold">{formatGwei(data?.gasPrice)}</p>
          <p className="text-text-tertiary text-xs">Gwei</p>
        </div>

        <div className="bg-card border border-card-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-accent-cyan" />
            <span className="text-text-secondary text-sm">Network</span>
          </div>
          <p className="text-2xl font-bold">Somnia</p>
          <p className="text-text-tertiary text-xs">Testnet</p>
        </div>
      </div>

      {/* Token Balance Checker */}
      <div className="bg-card border border-card-border rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Wallet size={20} className="text-accent-cyan" />
          <h3 className="text-lg font-semibold">Token Balance Checker</h3>
        </div>

        <div className="flex gap-3 mb-4">
          <input
            type="text"
            placeholder="Enter wallet address (0x...)"
            value={inputAddress}
            onChange={(e) => setInputAddress(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchTokenBalance()}
            className="flex-1 bg-zinc-900 border border-card-border rounded-lg px-4 py-2 text-foreground placeholder-text-tertiary focus:outline-none focus:border-accent-cyan font-mono text-sm"
          />
          <button
            onClick={fetchTokenBalance}
            disabled={!inputAddress}
            className="px-4 py-2 bg-accent-cyan text-black font-semibold rounded-lg hover:bg-accent-cyan/90 transition disabled:opacity-50"
          >
            Check
          </button>
        </div>

        {tokenBalances.length > 0 && (
          <div className="space-y-2">
            {tokenBalances.map((token, i) => (
              <div
                key={i}
                className="flex justify-between items-center p-3 bg-zinc-900/50 rounded-lg"
              >
                <span className="text-text-secondary">{token.symbol}</span>
                <span className="font-bold text-accent-cyan">
                  {parseFloat(token.balance).toFixed(4)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Block Time History */}
      <div className="bg-card border border-card-border rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">
          Block Time History (Last 20 blocks)
        </h3>
        <div className="h-32 flex items-end gap-1">
          {blockTimes.length === 0 ? (
            <div className="w-full flex items-center justify-center text-text-tertiary">
              Collecting block data...
            </div>
          ) : (
            blockTimes.map((time, i) => (
              <div
                key={i}
                className="flex-1 bg-accent-cyan/60 rounded-t hover:bg-accent-cyan transition-colors cursor-pointer"
                style={{ height: `${Math.min(time * 20, 100)}%` }}
                title={`Block time: ${time}s`}
              />
            ))
          )}
        </div>
        <div className="flex justify-between mt-2 text-xs text-text-tertiary">
          <span>0s</span>
          <span>{blockTimes.length} blocks</span>
          <span>~10s</span>
        </div>
      </div>

      {/* Reactivity Info */}
      <div className="bg-accent-cyan/10 border border-accent-cyan/30 rounded-xl p-4 flex items-center gap-3">
        <Zap size={20} className="text-accent-cyan" />
        <div>
          <p className="text-accent-cyan font-medium">Reactivity SDK Active</p>
        </div>
      </div>
    </div>
  );
}
