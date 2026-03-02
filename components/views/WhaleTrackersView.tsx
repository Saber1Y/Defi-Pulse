"use client";

import { useState } from "react";
import { Plus, Trash2, TrendingUp, TrendingDown, AlertTriangle, Eye } from "lucide-react";

interface Whale {
  id: string;
  address: string;
  totalValue: string;
  healthFactor: number;
  status: "safe" | "warning" | "danger";
  lastAction: string;
}

const mockWhales: Whale[] = [
  { id: "1", address: "0x742d35Cc6634C0532925a3b844Bc9e7595f8fE12", totalValue: "$2.4M", healthFactor: 2.1, status: "safe", lastAction: "Supply ETH" },
  { id: "2", address: "0x9fB29d6cB4e8B3fB8a4C5D6E7F8A1B2C3D4E5F6A", totalValue: "$1.8M", healthFactor: 1.4, status: "warning", lastAction: "Borrow USDC" },
  { id: "3", address: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b", totalValue: "$980K", healthFactor: 1.05, status: "danger", lastAction: "Near Liquidation" },
  { id: "4", address: "0xABCDEF1234567890abcdef1234567890abcdef12", totalValue: "$750K", healthFactor: 3.2, status: "safe", lastAction: "Repay Loan" },
];

const mockRecentActivity = [
  { id: "1", address: "0x742d...E12", action: "Supplied", amount: "50 ETH", time: "2 min ago", type: "positive" },
  { id: "2", address: "0x9fB2...F6A", action: "Borrowed", amount: "$100K USDC", time: "5 min ago", type: "neutral" },
  { id: "3", address: "0x1a2b...0b", action: "Health Factor", amount: "1.05 (Critical)", time: "8 min ago", type: "danger" },
  { id: "4", address: "0xABCD...12", action: "Repaid", amount: "$25K", time: "12 min ago", type: "positive" },
];

export function WhaleTrackersView() {
  const [whales, setWhales] = useState<Whale[]>(mockWhales);
  const [watching, setWatching] = useState<string[]>([]);

  const toggleWatch = (address: string) => {
    setWatching(prev => 
      prev.includes(address) 
        ? prev.filter(a => a !== address)
        : [...prev, address]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "safe": return "text-accent-green";
      case "warning": return "text-accent-yellow";
      case "danger": return "text-accent-red";
      default: return "text-text-secondary";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Whale Trackers</h2>
        <p className="text-text-secondary">Monitor large positions and get real-time alerts</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-card-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Tracked Whales</h3>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-accent-cyan/10 text-accent-cyan rounded-lg text-sm hover:bg-accent-cyan/20 transition">
              <Plus size={16} />
              Add Whale
            </button>
          </div>

          <div className="space-y-3">
            {whales.map((whale) => (
              <div 
                key={whale.id} 
                className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-lg hover:bg-zinc-900 transition"
              >
                <div className="flex-1">
                  <p className="font-mono text-sm">
                    {whale.address.slice(0, 8)}...{whale.address.slice(-6)}
                  </p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-text-secondary">
                    <span>{whale.totalValue}</span>
                    <span className={getStatusColor(whale.status)}>HF: {whale.healthFactor}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleWatch(whale.address)}
                    className={`p-2 rounded-lg transition ${
                      watching.includes(whale.address) 
                        ? "bg-accent-cyan/20 text-accent-cyan" 
                        : "hover:bg-zinc-800 text-text-secondary"
                    }`}
                  >
                    <Eye size={16} />
                  </button>
                  <button className="p-2 hover:bg-zinc-800 text-text-secondary rounded-lg transition">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-card-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Live Activity</h3>
            <span className="flex items-center gap-2 text-xs text-accent-green">
              <span className="w-2 h-2 bg-accent-green rounded-full animate-pulse"></span>
              Real-time
            </span>
          </div>

          <div className="space-y-3">
            {mockRecentActivity.map((activity) => (
              <div 
                key={activity.id} 
                className="flex items-center justify-between p-3 bg-zinc-900/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    activity.type === "positive" ? "bg-accent-green/10" :
                    activity.type === "danger" ? "bg-accent-red/10" : "bg-zinc-800"
                  }`}>
                    {activity.type === "positive" ? (
                      <TrendingUp size={16} className="text-accent-green" />
                    ) : activity.type === "danger" ? (
                      <AlertTriangle size={16} className="text-accent-red" />
                    ) : (
                      <TrendingDown size={16} className="text-text-secondary" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-text-tertiary">{activity.address}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${
                    activity.type === "positive" ? "text-accent-green" :
                    activity.type === "danger" ? "text-accent-red" : "text-foreground"
                  }`}>{activity.amount}</p>
                  <p className="text-xs text-text-tertiary">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-card border border-card-border rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Near Liquidation</h3>
        <p className="text-text-secondary text-sm mb-4">
          Accounts at risk of liquidation - monitored in real-time
        </p>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-card-border">
                <th className="px-4 py-3 text-left text-sm font-semibold text-text-secondary">Address</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-text-secondary">Total Value</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-text-secondary">Health Factor</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-text-secondary">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-text-secondary">Action</th>
              </tr>
            </thead>
            <tbody>
              {whales.filter(w => w.status === "danger").map((whale) => (
                <tr key={whale.id} className="border-b border-card-border/50">
                  <td className="px-4 py-3 font-mono text-sm">{whale.address.slice(0, 10)}...{whale.address.slice(-8)}</td>
                  <td className="px-4 py-3">{whale.totalValue}</td>
                  <td className="px-4 py-3 text-accent-red font-bold">{whale.healthFactor.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-accent-red/10 text-accent-red rounded text-xs font-semibold">
                      CRITICAL
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button 
                      onClick={() => toggleWatch(whale.address)}
                      className={`px-3 py-1 rounded text-xs font-semibold ${
                        watching.includes(whale.address)
                          ? "bg-accent-cyan text-black"
                          : "bg-accent-cyan/10 text-accent-cyan"
                      }`}
                    >
                      {watching.includes(whale.address) ? "Watching" : "Watch"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
