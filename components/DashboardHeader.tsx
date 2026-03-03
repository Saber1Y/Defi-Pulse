"use client";

import { ConnectWallet } from "./ConnectWallet";
import { Search, Bell, X, Menu, PanelLeftClose, PanelLeft } from "lucide-react";
import { useState } from "react";

interface DashboardHeaderProps {
  viewedAddress: string;
  onViewAddress: (address: string) => void;
  onClearView: () => void;
  onToggleAlerts: () => void;
  alertsOpen: boolean;
  onMenuToggle?: () => void;
  sidebarOpen?: boolean;
  isWalletConnected?: boolean;
}

export function DashboardHeader({
  viewedAddress,
  onViewAddress,
  onClearView,
  onToggleAlerts,
  alertsOpen,
  onMenuToggle,
  sidebarOpen,
  isWalletConnected,
}: DashboardHeaderProps) {
  const [addressInput, setAddressInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (addressInput.trim()) {
      onViewAddress(addressInput.trim());
      setIsSearching(false);
    }
  };

  return (
    <header className="border-b border-card-border bg-card sticky top-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-8">
          <h1 className="text-xl font-bold flex items-center gap-2">
            DeFi Pulse
          </h1>

          <nav className="hidden sm:flex items-center gap-6 text-sm">
            <a
              href="#"
              className="text-accent-cyan border-b-2 border-accent-cyan pb-1"
            >
              Dashboard
            </a>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {onMenuToggle && (
            <button 
              onClick={onMenuToggle}
              className="p-2 hover:bg-zinc-900 rounded-lg transition"
              title={sidebarOpen ? "Close sidebar" : "Open sidebar"}
            >
              {sidebarOpen ? (
                <PanelLeftClose size={20} />
              ) : (
                <PanelLeft size={20} />
              )}
            </button>
          )}
          {viewedAddress ? (
            <div className="flex items-center gap-2 bg-accent-cyan/10 border border-accent-cyan/30 rounded-lg px-3 py-2">
              <span className="text-sm text-accent-cyan">
                Viewing: {viewedAddress.slice(0, 6)}...{viewedAddress.slice(-4)}
              </span>
              <button
                onClick={onClearView}
                className="p-1 hover:bg-accent-cyan/20 rounded transition"
              >
                <X size={16} className="text-accent-cyan" />
              </button>
            </div>
          ) : isSearching ? (
            <form onSubmit={handleSearch} className="flex items-center">
              <div className="flex items-center bg-zinc-900 rounded-lg px-4 py-2 gap-2 border border-card-border">
                <Search size={18} className="text-text-tertiary" />
                <input
                  type="text"
                  placeholder="Enter address (0x...)"
                  value={addressInput}
                  onChange={(e) => setAddressInput(e.target.value)}
                  className="bg-transparent text-sm text-foreground placeholder-text-tertiary focus:outline-none w-48"
                  autoFocus
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsSearching(false);
                  setAddressInput("");
                }}
                className="ml-2 text-text-secondary hover:text-foreground"
              >
                Cancel
              </button>
            </form>
          ) : (
            <button
              onClick={() => setIsSearching(true)}
              className="hidden md:flex items-center bg-zinc-900 rounded-lg px-4 py-2 gap-2 border border-card-border hover:border-accent-cyan/50 transition"
            >
              <Search size={18} className="text-text-tertiary" />
              <span className="text-sm text-text-tertiary">
                View address
              </span>
            </button>
          )}

          <button 
            onClick={onToggleAlerts}
            className={`p-2 hover:bg-zinc-900 rounded-lg transition relative ${alertsOpen ? 'bg-zinc-900' : ''}`}
          >
            <Bell size={20} className={alertsOpen ? "text-accent-cyan" : "text-text-secondary"} />
          </button>

          <ConnectWallet />
        </div>
      </div>
    </header>
  );
}
