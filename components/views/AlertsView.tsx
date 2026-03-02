"use client";

import { useState } from "react";
import { Bell, Plus, Trash2, AlertTriangle } from "lucide-react";

interface AlertConfig {
  id: string;
  type: "health-factor" | "apy-change" | "liquidation";
  condition: string;
  value: string;
  enabled: boolean;
}

const mockAlerts: AlertConfig[] = [
  { id: "1", type: "health-factor", condition: "Below", value: "1.5", enabled: true },
  { id: "2", type: "health-factor", condition: "Below", value: "1.1", enabled: true },
  { id: "3", type: "liquidation", condition: "Any account", value: "", enabled: false },
];

export function AlertsView() {
  const [alerts, setAlerts] = useState<AlertConfig[]>(mockAlerts);

  const toggleAlert = (id: string) => {
    setAlerts(prev => prev.map(a => 
      a.id === id ? { ...a, enabled: !a.enabled } : a
    ));
  };

  const deleteAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Alerts</h2>
        <p className="text-text-secondary">Configure real-time notifications</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-card-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Your Alerts</h3>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-accent-cyan text-black rounded-lg text-sm font-semibold hover:bg-accent-cyan/90 transition">
              <Plus size={16} />
              New Alert
            </button>
          </div>

          <div className="space-y-3">
            {alerts.map((alert) => (
              <div 
                key={alert.id}
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  alert.enabled 
                    ? "bg-zinc-900/50 border-card-border" 
                    : "bg-zinc-900/20 border-transparent opacity-60"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    alert.type === "health-factor" ? "bg-accent-yellow/10" :
                    alert.type === "liquidation" ? "bg-accent-red/10" : "bg-accent-cyan/10"
                  }`}>
                    <AlertTriangle size={16} className={
                      alert.type === "health-factor" ? "text-accent-yellow" :
                      alert.type === "liquidation" ? "text-accent-red" : "text-accent-cyan"
                    } />
                  </div>
                  <div>
                    <p className="font-medium">
                      {alert.type === "health-factor" && `Health Factor ${alert.condition} ${alert.value}`}
                      {alert.type === "liquidation" && "Liquidation Alert"}
                      {alert.type === "apy-change" && "APY Change > 10%"}
                    </p>
                    <p className="text-xs text-text-tertiary">
                      {alert.type === "health-factor" && "Notify when health factor drops"}
                      {alert.type === "liquidation" && "Notify on any liquidation"}
                      {alert.type === "apy-change" && "Notify on significant APY changes"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleAlert(alert.id)}
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      alert.enabled ? "bg-accent-cyan" : "bg-zinc-700"
                    }`}
                  >
                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      alert.enabled ? "left-6" : "left-1"
                    }`} />
                  </button>
                  <button 
                    onClick={() => deleteAlert(alert.id)}
                    className="p-2 hover:bg-zinc-800 text-text-secondary rounded-lg transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-card-border rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Alert Statistics</h3>
          <div className="space-y-4">
            <div className="p-4 bg-zinc-900/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-text-secondary">Total Alerts</span>
                <span className="text-xl font-bold">3</span>
              </div>
            </div>
            <div className="p-4 bg-zinc-900/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-text-secondary">Active</span>
                <span className="text-xl font-bold text-accent-green">2</span>
              </div>
            </div>
            <div className="p-4 bg-zinc-900/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-text-secondary">Triggered Today</span>
                <span className="text-xl font-bold text-accent-yellow">1</span>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-accent-cyan/10 border border-accent-cyan/20 rounded-lg">
            <div className="flex items-start gap-3">
              <Bell size={20} className="text-accent-cyan mt-0.5" />
              <div>
                <p className="font-semibold text-accent-cyan">Real-time Alerts</p>
                <p className="text-sm text-text-secondary mt-1">
                  Alerts are delivered instantly via the Reactivity SDK - no polling, no delays
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
