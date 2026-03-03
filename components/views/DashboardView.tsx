"use client";

import { AlertBanner } from "@/components/AlertBanner";
import { ProtocolMonitoring } from "@/components/ProtocolMonitoring";
import { AlertsPanel } from "@/components/AlertsPanel";

interface DashboardViewProps {
  walletAddress: string | null;
}

export function DashboardView({ walletAddress }: DashboardViewProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
        <p className="text-text-secondary">
          Real-time overview of DeFi protocol
        </p>
      </div>

      {walletAddress ? (
        <div className="bg-accent-cyan/10 border border-accent-cyan/30 rounded-xl p-4">
          <p className="text-accent-cyan text-sm">
             Connected: {walletAddress.slice(0, 10)}...{walletAddress.slice(-8)}
          </p>
          <p className="text-text-secondary text-xs mt-1">
            Portfolio data will load from blockchain
          </p>
        </div>
      ) : (
        <div className="bg-accent-yellow/10 border border-accent-yellow/30 rounded-xl p-4">
          <p className="text-accent-yellow text-sm">
             Connect wallet to view portfolio data
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-card border border-card-border rounded-xl p-6">
            <p className="text-text-secondary mb-2">Total TVL</p>
            <p className="text-3xl font-bold text-accent-cyan">Coming Soon</p>
            <p className="text-text-tertiary text-sm mt-2">Connect to Tokos protocol</p>
          </div>
        </div>
        <div>
          <AlertsPanel alerts={[]} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-card-border rounded-xl p-4">
          <p className="text-text-secondary text-sm">Your Health Factor</p>
          <p className="text-3xl font-bold text-accent-cyan">--</p>
        </div>
        <div className="bg-card border border-card-border rounded-xl p-4">
          <p className="text-text-secondary text-sm">Total Supply</p>
          <p className="text-3xl font-bold">--</p>
        </div>
        <div className="bg-card border border-card-border rounded-xl p-4">
          <p className="text-text-secondary text-sm">Total Borrow</p>
          <p className="text-3xl font-bold">--</p>
        </div>
        <div className="bg-card border border-card-border rounded-xl p-4">
          <p className="text-text-secondary text-sm">Net Worth</p>
          <p className="text-3xl font-bold text-accent-green">--</p>
        </div>
      </div>
    </div>
  );
}
