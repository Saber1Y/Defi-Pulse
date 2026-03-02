"use client";

import { ProtocolMonitoring } from "@/components/ProtocolMonitoring";

const mockProtocolMetrics = {
  totalTVL: "$124,582,042",
  tvlChange: 15.2,
  volume24h: "$12,841,902",
  volumeChange: 12.8,
  tvlData: [
    { date: "MAY 01", value: 95000000 },
    { date: "MAY 08", value: 102000000 },
    { date: "MAY 15", value: 108000000 },
    { date: "MAY 22", value: 115000000 },
    { date: "MAY 29", value: 124582042 },
  ],
  volatilityData: [
    { date: "MAY 01", value: 25 },
    { date: "MAY 08", value: 32 },
    { date: "MAY 15", value: 28 },
    { date: "MAY 22", value: 38 },
    { date: "MAY 29", value: 35 },
  ],
};

export function AnalyticsView() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Analytics</h2>
        <p className="text-text-secondary">Protocol metrics and market data</p>
      </div>

      <ProtocolMonitoring metrics={mockProtocolMetrics} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-card-border rounded-xl p-6">
          <p className="text-text-secondary text-sm mb-2">Active Users</p>
          <p className="text-4xl font-bold">12,847</p>
          <p className="text-accent-green text-sm mt-2">+8.3% from yesterday</p>
        </div>

        <div className="bg-card border border-card-border rounded-xl p-6">
          <p className="text-text-secondary text-sm mb-2">Avg. Health Factor</p>
          <p className="text-4xl font-bold">2.45</p>
          <p className="text-accent-green text-sm mt-2">Healthy portfolio</p>
        </div>

        <div className="bg-card border border-card-border rounded-xl p-6">
          <p className="text-text-secondary text-sm mb-2">Liquidation Volume</p>
          <p className="text-4xl font-bold">$124,532</p>
          <p className="text-accent-red text-sm mt-2">-2.1% from yesterday</p>
        </div>
      </div>

      <div className="bg-card border border-card-border rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Per-Protocol APY Ranges</h3>
        <div className="space-y-4">
          {[
            { protocol: "Somnia Lending", supplyLow: "3.2%", supplyHigh: "14.5%", borrowLow: "5.1%", borrowHigh: "18.2%" },
            { protocol: "Aave V3", supplyLow: "2.8%", supplyHigh: "12.1%", borrowLow: "4.5%", borrowHigh: "15.8%" },
            { protocol: "Compound", supplyLow: "2.1%", supplyHigh: "8.5%", borrowLow: "3.9%", borrowHigh: "12.3%" },
          ].map((p) => (
            <div key={p.protocol} className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-lg">
              <span className="font-medium">{p.protocol}</span>
              <div className="flex gap-8 text-sm">
                <div>
                  <span className="text-text-tertiary">Supply: </span>
                  <span className="text-accent-green">{p.supplyLow} - {p.supplyHigh}</span>
                </div>
                <div>
                  <span className="text-text-tertiary">Borrow: </span>
                  <span className="text-accent-cyan">{p.borrowLow} - {p.borrowHigh}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
