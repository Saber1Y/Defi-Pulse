"use client";

import { AlertBanner } from "@/components/AlertBanner";
import { ProtocolMonitoring } from "@/components/ProtocolMonitoring";
import { AlertsPanel } from "@/components/AlertsPanel";

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

const mockAlerts = [
  {
    id: "1",
    type: "health-factor" as const,
    title: "Health Factor Warning: 1.45",
    time: "5 minutes ago",
    severity: "warning" as const,
  },
  {
    id: "2",
    type: "apy" as const,
    title: "APY Change: STT Supply up to 14%",
    time: "8 minutes ago",
    severity: "info" as const,
  },
  {
    id: "3",
    type: "liquidation" as const,
    title: "Liquidation Risk: High",
    time: "49 minutes ago",
    severity: "critical" as const,
  },
];

export function DashboardView() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
        <p className="text-text-secondary">Real-time overview of DeFi protocol</p>
      </div>

      <AlertBanner
        level="critical"
        title="CRITICAL ALERT: Health Factor is 1.2 - Imminent Liquidation Risk"
        message="Take action now to avoid liquidation"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProtocolMonitoring metrics={mockProtocolMetrics} />
        </div>
        <div>
          <AlertsPanel alerts={mockAlerts} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-card-border rounded-xl p-4">
          <p className="text-text-secondary text-sm">Your Health Factor</p>
          <p className="text-3xl font-bold text-accent-cyan">1.85</p>
        </div>
        <div className="bg-card border border-card-border rounded-xl p-4">
          <p className="text-text-secondary text-sm">Total Supply</p>
          <p className="text-3xl font-bold">$24,102</p>
        </div>
        <div className="bg-card border border-card-border rounded-xl p-4">
          <p className="text-text-secondary text-sm">Total Borrow</p>
          <p className="text-3xl font-bold">$8,450</p>
        </div>
        <div className="bg-card border border-card-border rounded-xl p-4">
          <p className="text-text-secondary text-sm">Net Worth</p>
          <p className="text-3xl font-bold text-accent-green">$15,652</p>
        </div>
      </div>
    </div>
  );
}
