"use client";

import { DashboardHeader } from "@/components/DashboardHeader";
import { AlertBanner } from "@/components/AlertBanner";
import { AlertsPanel } from "@/components/AlertsPanel";
import { ProtocolMonitoring } from "@/components/ProtocolMonitoring";
import { ActivePositionMonitoring } from "@/components/ActivePositionMonitoring";
import { PositionTrackingTable } from "@/components/PositionTrackingTable";

// Mock data
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

const mockPosition = {
  healthFactor: 1.85,
  totalSupply: "$24,102.50",
  totalBorrow: "$8,450.00",
  netAPY: "+4.12%",
  borrowPowerUsed: "35.00%",
};

const mockAssets = [
  {
    id: "eth",
    name: "Ethereum",
    symbol: "ETH",
    icon: "Ξ",
    balance: "4.50 ETH",
    value: "$15,750.00",
    supplyAPY: "3.25%",
    borrowAPY: "5.10%",
    status: "stable" as const,
  },
  {
    id: "usdc",
    name: "USDC Coin",
    symbol: "USDC",
    icon: "$",
    balance: "8,392.50 USDC",
    value: "$8,352.50",
    supplyAPY: "5.82%",
    borrowAPY: "7.15%",
    status: "warning" as const,
  },
  {
    id: "stt",
    name: "Somnia Token",
    symbol: "STT",
    icon: "◆",
    balance: "12,000.00 STT",
    value: "$1,440.00",
    supplyAPY: "14.0%",
    borrowAPY: "18.2%",
    status: "at-risk" as const,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardHeader />

      <main className="mx-auto max-w-7xl px-4 py-6">
        {/* Critical Alert */}
        <AlertBanner
          level="critical"
          title="CRITICAL ALERT: Health Factor is 1.2 - Imminent Liquidation Risk"
          message="Take action now to avoid liquidation"
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column - Protocol Monitoring */}
          <div className="lg:col-span-2">
            <ProtocolMonitoring metrics={mockProtocolMetrics} />
          </div>

          {/* Right Column - Alerts Panel */}
          <div>
            <AlertsPanel alerts={mockAlerts} />
          </div>
        </div>

        {/* Active Position Monitoring */}
        <ActivePositionMonitoring position={mockPosition} />

        {/* Position Tracking Table */}
        <div className="mt-12">
          <PositionTrackingTable assets={mockAssets} />
        </div>

        {/* Footer */}
        <footer className="mt-16 flex flex-col md:flex-row items-center justify-between text-text-tertiary text-xs py-8 border-t border-card-border">
          <div className="flex items-center gap-2">
            <span> DeFi Pulse Monitor</span>
            <span>
               Somnia Testnet Integration - Ready Only Dashboard
            </span>
          </div>
 
        </footer>
      </main>
    </div>
  );
}
