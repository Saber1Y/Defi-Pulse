"use client";

import { ActivePositionMonitoring } from "@/components/ActivePositionMonitoring";
import { PositionTrackingTable } from "@/components/PositionTrackingTable";

interface PortfolioViewProps {
  viewedAddress?: string | null;
}

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

      {!viewedAddress ? (
        <div className="bg-accent-yellow/10 border border-accent-yellow/30 rounded-xl p-6 text-center">
          <p className="text-accent-yellow font-medium">Connect your wallet or use Watch Address</p>
          <p className="text-text-secondary text-sm mt-2">
            Portfolio data will be fetched from Tokos lending protocol
          </p>
        </div>
      ) : (
        <>
          <ActivePositionMonitoring 
            position={{
              healthFactor: 0,
              totalSupply: "--",
              totalBorrow: "--",
              netAPY: "--",
              borrowPowerUsed: "--",
            }} 
            viewedAddress={viewedAddress} 
          />

          <div className="mt-12">
            <div className="bg-card border border-card-border rounded-xl p-6 text-center">
              <p className="text-text-secondary">
                Position data loading from blockchain...
              </p>
              <p className="text-text-tertiary text-sm mt-2">
                Address: {viewedAddress}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
