"use client";

import { useState, useEffect } from "react";

interface Position {
  healthFactor: number;
  totalSupply: string;
  totalBorrow: string;
  netAPY: string;
  borrowPowerUsed: string;
}

interface ActivePositionMonitoringProps {
  position: Position;
  viewedAddress?: string;
}

export function ActivePositionMonitoring({
  position,
  viewedAddress,
}: ActivePositionMonitoringProps) {
  const [displayHF, setDisplayHF] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayHF((prev) => {
        if (prev < position.healthFactor) {
          return Math.min(prev + 0.01, position.healthFactor);
        }
        return prev;
      });
    }, 20);
    return () => clearInterval(interval);
  }, [position.healthFactor]);

  // Health factor status
  const getHealthStatus = () => {
    if (position.healthFactor >= 2)
      return { label: "SAFE", color: "accent-green" };
    if (position.healthFactor >= 1.5)
      return { label: "WARNING", color: "accent-yellow" };
    return { label: "AT RISK", color: "accent-red" };
  };

  const healthStatus = getHealthStatus();
  const gaugePercentage = Math.min((displayHF / 3) * 100, 100);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-bold">Active Position Monitoring</h2>
        {viewedAddress && (
          <span className="text-sm text-accent-cyan bg-accent-cyan/10 px-2 py-1 rounded">
            Viewing: {viewedAddress.slice(0, 6)}...{viewedAddress.slice(-4)}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Health Factor Gauge */}
        <div className="bg-card border border-card-border rounded-xl p-6 flex flex-col items-center justify-center">
          <div className="relative w-48 h-48 mb-6">
            <svg
              className="w-full h-full transform -rotate-90"
              viewBox="0 0 200 200"
            >
              {/* Background circle */}
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="#2a2f3e"
                strokeWidth="12"
              />
              {/* Progress circle */}
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke={
                  healthStatus.color === "accent-red"
                    ? "#e63946"
                    : healthStatus.color === "accent-yellow"
                      ? "#ffd60a"
                      : "#06a77d"
                }
                strokeWidth="12"
                strokeDasharray={`${(gaugePercentage / 100) * 565.48} 565.48`}
                strokeLinecap="round"
                className="transition-all duration-300"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className={`${healthStatus.color} text-5xl font-bold`}>
                {displayHF.toFixed(2)}
              </div>
              <div className="text-text-secondary text-sm">HEALTH FACTOR</div>
            </div>
          </div>

          <div
            className={`px-3 py-1 rounded font-semibold text-sm ${healthStatus.color} border border-current border-opacity-30`}
          >
            STATUS: {healthStatus.label}
          </div>
        </div>

        {/* Total Supply */}
        <div className="bg-card border border-card-border rounded-xl p-6">
          <p className="text-text-secondary text-sm mb-2">
            Total Supply (Monitoring)
          </p>
          <p className="text-4xl font-bold mb-6">{position.totalSupply}</p>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-text-secondary text-sm">Net APY</span>
              <span className="text-accent-cyan font-semibold">
                {position.netAPY}
              </span>
            </div>
            <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-accent-cyan rounded-full"
                style={{ width: "65%" }}
              ></div>
            </div>
          </div>
        </div>

        {/* Total Borrow */}
        <div className="bg-card border border-card-border rounded-xl p-6">
          <p className="text-text-secondary text-sm mb-2">
            Total Borrow (Tracking)
          </p>
          <p className="text-4xl font-bold mb-6">{position.totalBorrow}</p>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-text-secondary text-sm">
                Borrow Power Used
              </span>
              <span className="text-accent-cyan font-semibold">
                {position.borrowPowerUsed}
              </span>
            </div>
            <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-accent-cyan rounded-full"
                style={{ width: `${parseFloat(position.borrowPowerUsed)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
