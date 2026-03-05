"use client";

import { useState } from "react";
import { TrendingUp, TrendingDown, Plus, X, Zap } from "lucide-react";
import { useReactivityWhales } from "@/lib/hooks/useReactivityWhales";

interface WhaleTrackersViewProps {
  walletAddress?: string | null;
}

export function WhaleTrackersView({ walletAddress }: WhaleTrackersViewProps) {
  const [customAddress, setCustomAddress] = useState("");
  const [addError, setAddError] = useState<string | null>(null);

  // Use connected wallet as default if available
  const initialAddresses = walletAddress ? [walletAddress] : [
    '0xa415bcad94286f59290d8e861008f00a13cb400',
  ]

  const exampleAddresses = [
    { addr: '0xa415bcad94286f59290d8e861008f00a13cb400', label: 'Tokos Active User' },
    { addr: '0x28530a47B3A2de8088378d8B3c30fA0b6c1EDa47', label: 'Tokos User' },
    { addr: '0x9ba207c3cda7d7c57a5aa3c7d4d5a6bde2c723', label: 'Whale' },
  ];

  const {
    whales,
    isLoading,
    error,
    subscribedEvents,
    addWhale,
    removeWhale,
    refresh,
  } = useReactivityWhales(initialAddresses);

  const handleAddWhale = async () => {
    if (!customAddress.startsWith("0x") || customAddress.length !== 42) {
      setAddError("Invalid Ethereum address");
      return;
    }
    await addWhale(customAddress.toLowerCase());
    setCustomAddress("");
    setAddError(null);
  };

  const getStatus = (healthFactor: number | undefined | null) => {
    if (!healthFactor || healthFactor === 0)
      return { label: "No Position", color: "text-text-tertiary", bg: "bg-zinc-800", border: "border-zinc-700" };
    if (healthFactor >= 2) return { label: "Safe", color: "text-accent-green", bg: "bg-accent-green/20", border: "border-accent-green/30" };
    if (healthFactor >= 1.5)
      return { label: "Warning", color: "text-accent-yellow", bg: "bg-accent-yellow/20", border: "border-accent-yellow/30" };
    return { label: "Critical", color: "text-accent-red", bg: "bg-accent-red/20", border: "border-accent-red/30" };
  };

  const formatUSD = (value: number | undefined | null) => {
    if (!value || value === 0) return "--";
    return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatTime = (date: Date) => date.toLocaleTimeString();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Whale Trackers</h2>
        <p className="text-text-secondary">
          Monitor any address with real-time updates via Somnia Reactivity SDK
        </p>
      </div>

      {/* Reactivity Status Banner */}
      <div className="bg-gradient-to-r from-accent-cyan/20 via-accent-cyan/10 to-transparent border border-accent-cyan/30 rounded-xl p-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-accent-cyan"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent-cyan/10 rounded-full blur-3xl"></div>
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent-cyan/20 rounded-lg">
              <Zap size={24} className="text-accent-cyan" />
            </div>
            <div>
              <p className="text-accent-cyan font-semibold text-lg">
                ⚡ Powered by Somnia Reactivity SDK
              </p>
              <p className="text-text-secondary text-sm">
                Real-time updates without polling - instant push when data changes
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-text-tertiary text-xs">Events received</p>
            <p className="text-accent-cyan font-bold text-xl">
              {subscribedEvents}
            </p>
          </div>
        </div>
      </div>

      {/* Add Whale Input */}
      <div className="bg-card border border-card-border rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Add Address to Watch</h3>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="0x..."
            value={customAddress}
            onChange={(e) => setCustomAddress(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddWhale()}
            className="flex-1 bg-zinc-900 border border-card-border rounded-lg px-4 py-2 text-foreground placeholder-text-tertiary focus:outline-none focus:border-accent-cyan font-mono text-sm"
          />
          <button
            onClick={handleAddWhale}
            disabled={!customAddress}
            className="px-4 py-2 bg-accent-cyan text-black font-semibold rounded-lg hover:bg-accent-cyan/90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Plus size={18} />
            Add
          </button>
        </div>
        {addError && <p className="text-accent-red text-sm mt-2">{addError}</p>}
        <p className="text-text-tertiary text-xs mt-2">
          Enter any wallet address - you&apos;ll get instant updates when they
          interact with Tokos
        </p>
        
        {/* Example Addresses */}
        <div className="mt-4 pt-4 border-t border-card-border">
          <p className="text-text-tertiary text-xs mb-2">Try these addresses:</p>
          <div className="flex flex-wrap gap-2">
            {exampleAddresses.map((ex) => (
              <button
                key={ex.addr}
                onClick={() => { setCustomAddress(ex.addr); }}
                className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-xs text-text-secondary font-mono transition"
                title={ex.label}
              >
                {ex.addr.slice(0, 10)}...{ex.addr.slice(-8)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {isLoading && whales.size === 0 && (
        <div className="bg-card border border-card-border rounded-xl p-8 flex items-center gap-3 justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent-cyan"></div>
          <p className="text-text-secondary">Connecting to Reactivity...</p>
        </div>
      )}

      {error && (
        <div className="bg-accent-red/10 border border-accent-red/30 rounded-xl p-4">
          <p className="text-accent-red font-medium">Error: {error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tracked Addresses */}
        <div className="bg-card border border-card-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              Tracked Addresses ({whales.size})
            </h3>
            <button
              onClick={refresh}
              disabled={isLoading}
              className="flex items-center gap-2 px-3 py-1.5 bg-accent-cyan/10 text-accent-cyan rounded-lg text-sm hover:bg-accent-cyan/20 transition disabled:opacity-50"
            >
              {isLoading ? "Loading..." : "Refresh"}
            </button>
          </div>

          <div className="space-y-3">
            {Array.from(whales.values()).map((whale) => {
              const status = getStatus(whale.position?.healthFactor);
              return (
                <div
                  key={whale.address}
                  className={`flex items-center justify-between p-4 rounded-lg transition ${
                    whale.change === "worsened"
                      ? "bg-accent-red/10 border border-accent-red/30"
                      : whale.change === "improved"
                        ? "bg-accent-green/10 border border-accent-green/30"
                        : whale.change === "new"
                          ? "bg-accent-cyan/10 border border-accent-cyan/30"
                          : "bg-zinc-900/50"
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-mono text-sm">
                        {whale.address.slice(0, 10)}...{whale.address.slice(-8)}
                      </p>
                      {whale.change === "worsened" && (
                        <TrendingDown size={14} className="text-accent-red" />
                      )}
                      {whale.change === "improved" && (
                        <TrendingUp size={14} className="text-accent-green" />
                      )}
                    </div>
                    <p className={`text-xs mt-1 ${status.color}`}>
                      HF: {whale.position?.healthFactor?.toFixed(2) || "--"} •{" "}
                      {formatUSD(whale.position?.totalCollateralUSD)}
                    </p>
                    <p className="text-text-tertiary text-xs">
                      {formatTime(whale.lastUpdated)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${status.bg} ${status.color} border ${status.border}`}>
                      {status.label}
                    </span>
                    <button
                      onClick={() => removeWhale(whale.address)}
                      className="p-2 hover:bg-zinc-800 rounded-lg"
                    >
                      <X size={16} className="text-text-secondary" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {whales.size === 0 && !isLoading && (
            <div className="text-center py-8 text-text-secondary">
              <p>No addresses tracked</p>
              <p className="text-sm text-text-tertiary mt-2">
                Add an address above
              </p>
            </div>
          )}
        </div>

        {/* Activity Feed */}
        <div className="bg-card border border-card-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Live Activity Feed</h3>
            <span className="flex items-center gap-2 text-xs text-accent-cyan">
              <span className="w-2 h-2 bg-accent-cyan rounded-full animate-pulse"></span>
              Real-time
            </span>
          </div>

          <div className="space-y-3">
            {Array.from(whales.values())
              .filter((w) => w.change)
              .slice(0, 8)
              .map((whale) => (
                <div
                  key={`activity-${whale.address}`}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    whale.change === "worsened"
                      ? "bg-accent-red/10"
                      : whale.change === "improved"
                        ? "bg-accent-green/10"
                        : "bg-accent-cyan/10"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        whale.change === "worsened"
                          ? "bg-accent-red/20"
                          : whale.change === "improved"
                            ? "bg-accent-green/20"
                            : "bg-accent-cyan/20"
                      }`}
                    >
                      {whale.change === "worsened" ? (
                        <TrendingDown size={16} className="text-accent-red" />
                      ) : whale.change === "improved" ? (
                        <TrendingUp size={16} className="text-accent-green" />
                      ) : (
                        <Plus size={16} className="text-accent-cyan" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {whale.change === "worsened" &&
                          "Health Factor Decreased"}
                        {whale.change === "improved" &&
                          "Health Factor Increased"}
                        {whale.change === "new" && "New Position"}
                      </p>
                      <p className="text-xs text-text-tertiary">
                        {whale.address.slice(0, 8)}...{whale.address.slice(-6)}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-text-tertiary">
                    {formatTime(whale.lastUpdated)}
                  </p>
                </div>
              ))}
          </div>

          {Array.from(whales.values()).filter((w) => w.change).length === 0 && (
            <div className="text-center py-8 text-text-secondary">
              <p>No activity yet</p>
              <p className="text-sm text-text-tertiary mt-2">
                Activity will appear here in real-time
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Near Liquidation Table */}
      <div className="bg-card border border-card-border rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">
          Near Liquidation (HF &lt; 1.5)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-card-border">
                <th className="px-4 py-3 text-left text-sm font-semibold text-text-secondary">
                  Address
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-text-secondary">
                  Collateral
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-text-secondary">
                  Debt
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-text-secondary">
                  Health Factor
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-text-secondary">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.from(whales.values())
                .filter(
                  (w) =>
                    w.position &&
                    w.position.healthFactor > 0 &&
                    w.position.healthFactor < 1.5,
                )
                .map((whale) => (
                  <tr
                    key={whale.address}
                    className="border-b border-card-border/50"
                  >
                    <td className="px-4 py-3 font-mono text-sm">
                      {whale.address.slice(0, 12)}...{whale.address.slice(-8)}
                    </td>
                    <td className="px-4 py-3">
                      {formatUSD(whale.position?.totalCollateralUSD)}
                    </td>
                    <td className="px-4 py-3">
                      {formatUSD(whale.position?.totalDebtUSD)}
                    </td>
                    <td className="px-4 py-3 font-bold">
                      <span
                        className={
                          whale.position!.healthFactor < 1.1
                            ? "text-accent-red"
                            : "text-accent-yellow"
                        }
                      >
                        {whale.position?.healthFactor.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          whale.position!.healthFactor < 1.1
                            ? "bg-accent-red/10 text-accent-red"
                            : "bg-accent-yellow/10 text-accent-yellow"
                        }`}
                      >
                        {whale.position!.healthFactor < 1.1
                          ? "CRITICAL"
                          : "WARNING"}
                      </span>
                    </td>
                  </tr>
                ))}
              {Array.from(whales.values()).filter(
                (w) =>
                  w.position &&
                  w.position.healthFactor > 0 &&
                  w.position.healthFactor < 1.5,
              ).length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-text-secondary"
                  >
                    No accounts near liquidation
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
