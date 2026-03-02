"use client";

import { Bell } from "lucide-react";

interface Asset {
  id: string;
  name: string;
  symbol: string;
  icon: string;
  balance: string;
  value: string;
  supplyAPY: string;
  borrowAPY: string;
  status: "stable" | "warning" | "at-risk";
}

interface PositionTrackingTableProps {
  assets: Asset[];
  viewedAddress?: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "stable":
      return "bg-accent-green/10 text-accent-green border-accent-green/30";
    case "warning":
      return "bg-accent-yellow/10 text-accent-yellow border-accent-yellow/30";
    case "at-risk":
      return "bg-accent-red/10 text-accent-red border-accent-red/30";
    default:
      return "";
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "stable":
      return "STABLE";
    case "warning":
      return "WARNING";
    case "at-risk":
      return "AT RISK";
    default:
      return "";
  }
};

export function PositionTrackingTable({ assets, viewedAddress }: PositionTrackingTableProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold">Position Status Tracking</h2>
          {viewedAddress && (
            <span className="text-sm text-accent-cyan bg-accent-cyan/10 px-2 py-1 rounded">
              Viewing: {viewedAddress.slice(0, 6)}...{viewedAddress.slice(-4)}
            </span>
          )}
        </div>
        <button className="flex items-center gap-2 text-accent-cyan text-sm font-semibold hover:text-accent-cyan/80 transition">
          <Bell size={16} />
          Alert Notifications Enabled
        </button>
      </div>

      <div className="bg-card border border-card-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-card-border bg-zinc-900/50">
              <th className="px-6 py-4 text-left text-sm font-semibold text-text-secondary">
                ASSET
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-text-secondary">
                BALANCE
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-text-secondary">
                VALUE
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-text-secondary">
                SUPPLY APY
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-text-secondary">
                BORROW APY
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-text-secondary">
                STATUS
              </th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset, idx) => (
              <tr
                key={asset.id}
                className={`border-b border-card-border/50 hover:bg-zinc-900/30 transition ${idx === assets.length - 1 ? "border-b-0" : ""}`}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-bold">
                      {asset.icon}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {asset.name}
                      </p>
                      <p className="text-xs text-text-tertiary">
                        {asset.symbol}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-foreground">{asset.balance}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-foreground font-medium">{asset.value}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-accent-green font-semibold">
                    {asset.supplyAPY}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-accent-cyan font-semibold">
                    {asset.borrowAPY}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded text-xs font-semibold border ${getStatusColor(asset.status)}`}
                  >
                    {getStatusLabel(asset.status)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
