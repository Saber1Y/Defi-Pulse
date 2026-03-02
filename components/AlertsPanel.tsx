"use client";

import { AlertTriangle, TrendingUp, AlertCircle } from "lucide-react";

interface Alert {
  id: string;
  type: "health-factor" | "apy" | "liquidation";
  title: string;
  time: string;
  severity: "critical" | "warning" | "info";
}

interface AlertsPanelProps {
  alerts: Alert[];
}

export function AlertsPanel({ alerts }: AlertsPanelProps) {
  return (
    <div className="bg-card border border-card-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Recent Alerts</h3>
        <a
          href="#"
          className="text-accent-cyan text-xs font-semibold hover:underline"
        >
          VIEW ALL READ
        </a>
      </div>

      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="flex items-start gap-3 p-3 bg-zinc-900/50 rounded-lg border border-card-border hover:border-card-border/50 transition"
          >
            <div className="mt-1">
              {alert.severity === "critical" && (
                <AlertTriangle size={18} className="text-accent-red" />
              )}
              {alert.severity === "warning" && (
                <AlertCircle size={18} className="text-accent-yellow" />
              )}
              {alert.severity === "info" && (
                <TrendingUp size={18} className="text-accent-green" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">
                {alert.title}
              </p>
              <p className="text-xs text-text-tertiary">{alert.time}</p>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-4 py-2 bg-accent-cyan text-black text-sm font-semibold rounded-lg hover:bg-accent-cyan/90 transition">
        ALERT CONFIG
      </button>
    </div>
  );
}
