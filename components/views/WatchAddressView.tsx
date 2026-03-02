"use client";

import { useState } from "react";
import { Search, X, ExternalLink } from "lucide-react";

interface WatchAddressViewProps {
  viewedAddress: string;
  onViewAddress: (address: string) => void;
  onClearView: () => void;
}

export function WatchAddressView({ viewedAddress, onViewAddress, onClearView }: WatchAddressViewProps) {
  const [addressInput, setAddressInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (addressInput.trim()) {
      onViewAddress(addressInput.trim());
      setIsSearching(false);
    }
  };

  const explorerUrl = `https://shannon-explorer.somnia.network/address/${viewedAddress}`;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Watch Address</h2>
        <p className="text-text-secondary">View any address positions in real-time</p>
      </div>

      {viewedAddress ? (
        <div className="bg-card border border-card-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-text-secondary text-sm mb-1">Currently Viewing</p>
              <p className="text-xl font-mono text-accent-cyan">
                {viewedAddress.slice(0, 10)}...{viewedAddress.slice(-8)}
              </p>
            </div>
            <div className="flex gap-2">
              <a
                href={explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 rounded-lg transition"
              >
                <ExternalLink size={16} />
                Explorer
              </a>
              <button
                onClick={onClearView}
                className="flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 rounded-lg transition"
              >
                <X size={16} />
                Clear
              </button>
            </div>
          </div>

          <div className="p-4 bg-zinc-900/50 rounded-lg text-center">
            <p className="text-text-secondary">
              Position data will load here in real-time via Reactivity SDK
            </p>
          </div>
        </div>
      ) : isSearching ? (
        <form onSubmit={handleSearch} className="bg-card border border-card-border rounded-xl p-6">
          <label className="block text-text-secondary text-sm mb-2">
            Enter address to watch
          </label>
          <div className="flex gap-4">
            <div className="flex-1 flex items-center bg-zinc-900 rounded-lg px-4 py-3 gap-2 border border-card-border">
              <Search size={18} className="text-text-tertiary" />
              <input
                type="text"
                placeholder="0x..."
                value={addressInput}
                onChange={(e) => setAddressInput(e.target.value)}
                className="flex-1 bg-transparent text-foreground placeholder-text-tertiary focus:outline-none font-mono"
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-accent-cyan text-black font-semibold rounded-lg hover:bg-accent-cyan/90 transition"
            >
              View
            </button>
            <button
              type="button"
              onClick={() => {
                setIsSearching(false);
                setAddressInput("");
              }}
              className="px-6 py-3 bg-zinc-900 text-foreground rounded-lg hover:bg-zinc-800 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-card border border-card-border rounded-xl p-6 text-center py-12">
          <Search size={48} className="mx-auto mb-4 text-text-tertiary" />
          <p className="text-lg font-semibold mb-2">Search Any Address</p>
          <p className="text-text-secondary mb-6">
            Enter a wallet address to view their DeFi positions in real-time
          </p>
          <button
            onClick={() => setIsSearching(true)}
            className="px-6 py-3 bg-accent-cyan text-black font-semibold rounded-lg hover:bg-accent-cyan/90 transition"
          >
            Enter Address
          </button>
        </div>
      )}

      <div className="bg-card border border-card-border rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">How it works</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-accent-cyan/20 flex items-center justify-center text-accent-cyan text-sm font-bold">1</div>
            <p className="text-text-secondary">Enter any Somnia address (0x...)</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-accent-cyan/20 flex items-center justify-center text-accent-cyan text-sm font-bold">2</div>
            <p className="text-text-secondary">View their supply/borrow positions instantly</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-accent-cyan/20 flex items-center justify-center text-accent-cyan text-sm font-bold">3</div>
            <p className="text-text-secondary">Updates push in real-time - no refreshing needed</p>
          </div>
        </div>
      </div>
    </div>
  );
}
