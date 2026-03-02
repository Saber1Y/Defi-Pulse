"use client";

import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
} from "recharts";

interface ProtocolMetrics {
  totalTVL: string;
  tvlChange: number;
  volume24h: string;
  volumeChange: number;
  tvlData: Array<{ date: string; value: number }>;
  volatilityData: Array<{ date: string; value: number }>;
}

interface ProtocolMonitoringProps {
  metrics: ProtocolMetrics;
}

export function ProtocolMonitoring({ metrics }: ProtocolMonitoringProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Protocol Monitoring</h2>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Total TVL */}
        <div className="bg-card border border-card-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-text-secondary text-sm mb-2">Total TVL</p>
              <p className="text-4xl font-bold">{metrics.totalTVL}</p>
            </div>
            <div className="w-10 h-10 bg-accent-cyan/10 rounded-lg flex items-center justify-center">
              <div className="w-2 h-2 bg-accent-cyan rounded-full"></div>
            </div>
          </div>
          <p className="text-accent-cyan text-sm">
            {metrics.tvlChange > 0 ? "+" : ""}
            {metrics.tvlChange}% monitored active
          </p>
        </div>

        {/* 24h Volume */}
        <div className="bg-card border border-card-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-text-secondary text-sm mb-2">24h Volume</p>
              <p className="text-4xl font-bold">{metrics.volume24h}</p>
            </div>
            <div className="w-10 h-10 bg-accent-cyan/10 rounded-lg flex items-center justify-center">
              <div className="w-2 h-2 bg-accent-cyan rounded-full"></div>
            </div>
          </div>
          <p className="text-accent-cyan text-sm">
            {metrics.volumeChange > 0 ? "+" : ""}
            {metrics.volumeChange}% from last hour
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* TVL Over Time */}
        <div className="bg-card border border-card-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-semibold">TVL Over Time</p>
              <p className="text-text-secondary text-sm">
                Protocol growth monitoring
              </p>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-xs bg-card border border-card-border rounded hover:bg-zinc-800 transition">
                1W
              </button>
              <button className="px-3 py-1 text-xs bg-accent-cyan/10 border border-accent-cyan rounded text-accent-cyan">
                1M
              </button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={metrics.tvlData}>
              <defs>
                <linearGradient id="colorTVL" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00d9ff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00d9ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                stroke="#6b7280"
                style={{ fontSize: "12px" }}
              />
              <YAxis stroke="#6b7280" style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a1f2e",
                  border: "1px solid #2a2f3e",
                  borderRadius: "8px",
                }}
                cursor={{ stroke: "#00d9ff" }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#00d9ff"
                fillOpacity={1}
                fill="url(#colorTVL)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Volatility Index */}
        <div className="bg-card border border-card-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-semibold">Volatility Index</p>
              <p className="text-text-secondary text-sm">
                Risk assessment tracking
              </p>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-xs bg-card border border-card-border rounded hover:bg-zinc-800 transition">
                1W
              </button>
              <button className="px-3 py-1 text-xs bg-accent-cyan/10 border border-accent-cyan rounded text-accent-cyan">
                1M
              </button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={metrics.volatilityData}>
              <defs>
                <linearGradient
                  id="colorVolatility"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#9d4edd" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#9d4edd" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                stroke="#6b7280"
                style={{ fontSize: "12px" }}
              />
              <YAxis stroke="#6b7280" style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a1f2e",
                  border: "1px solid #2a2f3e",
                  borderRadius: "8px",
                }}
                cursor={{ stroke: "#9d4edd" }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#9d4edd"
                dot={false}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
