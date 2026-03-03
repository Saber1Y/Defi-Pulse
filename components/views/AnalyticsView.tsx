"use client";

import { ProtocolMonitoring } from "@/components/ProtocolMonitoring";

export function AnalyticsView() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Analytics</h2>
        <p className="text-text-secondary">
          Protocol metrics and market data
        </p>
      </div>

      <div className="bg-accent-cyan/10 border border-accent-cyan/30 rounded-xl p-6">
        <p className="text-accent-cyan font-medium">Analytics Coming Soon</p>
        <p className="text-text-secondary text-sm mt-2">
          TVL, volume, and protocol metrics will be fetched from Tokos lending pools
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-card-border rounded-xl p-6">
          <p className="text-text-secondary text-sm mb-2">Active Users</p>
          <p className="text-4xl font-bold">--</p>
        </div>

        <div className="bg-card border border-card-border rounded-xl p-6">
          <p className="text-text-secondary text-sm mb-2">Avg. Health Factor</p>
          <p className="text-4xl font-bold">--</p>
        </div>

        <div className="bg-card border border-card-border rounded-xl p-6">
          <p className="text-text-secondary text-sm mb-2"> Liquidation Volume</p>
          <p className="text-4xl font-bold">--</p>
        </div>
      </div>
    </div>
  );
}
