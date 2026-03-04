"use client";

import { ActivePositionMonitoring } from "@/components/ActivePositionMonitoring";
import { usePosition } from "@/lib/hooks/usePosition";

interface PortfolioViewProps {
  viewedAddress?: string | null;
}

export function PortfolioView({ viewedAddress }: PortfolioViewProps) {
  const { position, isLoading, error } = usePosition(viewedAddress);

  const formatUSD = (value: number | undefined) => {
    if (value === undefined || value === 0) return "--";
    return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatHealthFactor = (value: number | undefined) => {
    if (value === undefined || value === 0) return "--";
    return value.toFixed(2);
  };

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
      ) : isLoading ? (
        <div className="bg-card border border-card-border rounded-xl p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-cyan mx-auto"></div>
          <p className="text-text-secondary mt-4">Fetching position from Tokos...</p>
        </div>
      ) : error ? (
        <div className="bg-accent-red/10 border border-accent-red/30 rounded-xl p-6">
          <p className="text-accent-red font-medium">Error fetching position</p>
          <p className="text-text-secondary text-sm mt-2">{error.message}</p>
          <p className="text-text-tertiary text-xs mt-2">Check console for details</p>
        </div>
      ) : !position ? (
        <div className="bg-accent-yellow/10 border border-accent-yellow/30 rounded-xl p-6 text-center">
          <p className="text-accent-yellow font-medium">No position found</p>
          <p className="text-text-secondary text-sm mt-2">
            This address has no active lending position on Tokos
          </p>
        </div>
      ) : (
        <>
          <ActivePositionMonitoring 
            position={{
              healthFactor: position.healthFactor,
              totalSupply: formatUSD(position.totalCollateralUSD),
              totalBorrow: formatUSD(position.totalDebtUSD),
              netAPY: "--",
              borrowPowerUsed: position.totalCollateralUSD > 0 
                ? `${((position.totalDebtUSD / position.totalCollateralUSD) * 100).toFixed(1)}%`
                : "--",
            }}
            viewedAddress={viewedAddress}
          />

          <div className="bg-card border border-card-border rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Position Details</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="p-4 bg-zinc-900/50 rounded-lg">
                <p className="text-text-tertiary text-sm">Available to Borrow</p>
                <p className="text-xl font-bold text-accent-cyan">
                  {formatUSD(position.availableBorrowsUSD)}
                </p>
              </div>
              <div className="p-4 bg-zinc-900/50 rounded-lg">
                <p className="text-text-tertiary text-sm">Liquidation Threshold</p>
                <p className="text-xl font-bold">
                  {position.liquidationThreshold > 0 
                    ? `${position.liquidationThreshold.toFixed(0)}%`
                    : "--"}
                </p>
              </div>
              <div className="p-4 bg-zinc-900/50 rounded-lg">
                <p className="text-text-tertiary text-sm">LTV</p>
                <p className="text-xl font-bold">
                  {position.ltv > 0 
                    ? `${position.ltv.toFixed(0)}%`
                    : "--"}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
