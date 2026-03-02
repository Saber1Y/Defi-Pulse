"use client";

import { ActivePositionMonitoring } from "@/components/ActivePositionMonitoring";
import { PositionTrackingTable } from "@/components/PositionTrackingTable";

interface PortfolioViewProps {
  viewedAddress?: string;
}

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

export function PortfolioView({ viewedAddress }: PortfolioViewProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Portfolio</h2>
        <p className="text-text-secondary">
          {viewedAddress 
            ? `Viewing: ${viewedAddress.slice(0, 6)}...${viewedAddress.slice(-4)}`
            : "Your positions and collateral"}
        </p>
      </div>

      <ActivePositionMonitoring position={mockPosition} viewedAddress={viewedAddress} />

      <div className="mt-12">
        <PositionTrackingTable assets={mockAssets} viewedAddress={viewedAddress} />
      </div>
    </div>
  );
}
