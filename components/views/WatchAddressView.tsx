"use client";

import { useState, useEffect } from "react";
import { Search, X, ExternalLink, Zap, TrendingUp, TrendingDown } from "lucide-react";
import { getUserPosition, UserPosition } from "@/lib/contracts/tokos";

interface WatchAddressViewProps {
  viewedAddress: string;
  onViewAddress: (address: string) => void;
  onClearView: () => void;
}

export function WatchAddressView({ viewedAddress, onViewAddress, onClearView }: WatchAddressViewProps) {
  const [addressInput, setAddressInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [position, setPosition] = useState<UserPosition | null>(null);
  const [prevPosition, setPrevPosition] = useState<UserPosition | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (addressInput.trim()) {
      onViewAddress(addressInput.trim());
      setIsSearching(false);
    }
  };

  const explorerUrl = `https://shannon-explorer.somnia.network/address/${viewedAddress}`;

  // Fetch position when viewedAddress changes
  useEffect(() => {
    if (!viewedAddress) return;

    const fetchPosition = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await getUserPosition(viewedAddress);
        if (result) {
          setPrevPosition(position);
          setPosition(result);
        } else {
          setPosition(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosition();

    // Setup Reactivity - listen for events and update instantly
    const setupReactivity = async () => {
      try {
        const { SDK } = await import('@somnia-chain/reactivity');
        const { createPublicClient, http } = await import('viem');
        
        const publicClient = createPublicClient({
          chain: { 
            id: 50312, 
            name: 'Somnia Testnet',
            nativeCurrency: { name: 'STT', symbol: 'STT', decimals: 18 },
            rpcUrls: { default: { http: ['https://dream-rpc.somnia.network/'] } },
          },
          transport: http(),
        });

        const sdk = new SDK({ public: publicClient });

        await sdk.subscribe({
          ethCalls: [],
          onData: (data: any) => {
            console.log("Reactivity: Address activity detected!");
            fetchPosition();
          },
        });

        console.log("Reactivity connected for Watch Address!");
      } catch (err) {
        // Setting up reactivity
      }
    };

    setupReactivity();
  }, [viewedAddress]);

  const formatUSD = (value: number | undefined | null) => {
    if (!value || value === 0) return "--";
    return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getStatus = (healthFactor: number | undefined | null) => {
    if (!healthFactor || healthFactor === 0) return { label: "No Position", color: "text-text-tertiary" };
    if (!isFinite(healthFactor)) return { label: "No Debt", color: "text-accent-green" };
    if (healthFactor >= 2) return { label: "Safe", color: "text-accent-green" };
    if (healthFactor >= 1.5) return { label: "Warning", color: "text-accent-yellow" };
    return { label: "Critical", color: "text-accent-red" };
  };

  const status = getStatus(position?.healthFactor);
  
  // Detect change
  const hasChange = position && prevPosition && position.healthFactor !== prevPosition.healthFactor;
  const isImproved = hasChange && position.healthFactor > prevPosition.healthFactor;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Watch Address</h2>
        <p className="text-text-secondary">
          View any address position with real-time updates via Reactivity SDK
        </p>
      </div>

      {/* Reactivity Banner */}
      <div className="bg-accent-cyan/10 border border-accent-cyan/30 rounded-xl p-4">
        <div className="flex items-center gap-2">
          <Zap size={18} className="text-accent-cyan" />
          <p className="text-accent-cyan text-sm">
            Real-time: Updates push instantly when this address interacts with Tokos
          </p>
        </div>
      </div>

      {viewedAddress ? (
        <div className="bg-card border border-card-border rounded-xl p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-text-secondary text-sm mb-1">Currently Viewing</p>
              <p className="text-xl font-mono text-accent-cyan">
                {viewedAddress.slice(0, 14)}...{viewedAddress.slice(-10)}
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

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-cyan"></div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-accent-red/10 border border-accent-red/30 rounded-lg p-4 mb-4">
              <p className="text-accent-red">Error: {error}</p>
              <p className="text-text-tertiary text-xs mt-1">Check console for details</p>
            </div>
          )}

          {/* Position Data */}
          {position && !isLoading && (
            <>
              {/* Health Factor with change indicator */}
              <div className={`rounded-xl p-6 mb-4 ${
                hasChange 
                  ? (isImproved ? 'bg-accent-green/10 border border-accent-green/30' : 'bg-accent-red/10 border border-accent-red/30')
                  : 'bg-zinc-900/50'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-text-secondary text-sm">Health Factor</p>
                    <div className="flex items-center gap-3">
                      <p className={`text-5xl font-bold ${status.color}`}>
                        {isFinite(position.healthFactor) ? position.healthFactor.toFixed(2) : "∞"}
                      </p>
                      {hasChange && (
                        <span className={`flex items-center gap-1 ${isImproved ? 'text-accent-green' : 'text-accent-red'}`}>
                          {isImproved ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                          {Math.abs(position.healthFactor - prevPosition.healthFactor).toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className={`px-4 py-2 rounded-lg font-semibold ${status.color} bg-current/10`}>
                    {status.label}
                  </span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-zinc-900/50 rounded-lg p-4">
                  <p className="text-text-tertiary text-sm">Total Collateral</p>
                  <p className="text-xl font-bold">{formatUSD(position.totalCollateralUSD)}</p>
                </div>
                <div className="bg-zinc-900/50 rounded-lg p-4">
                  <p className="text-text-tertiary text-sm">Total Debt</p>
                  <p className="text-xl font-bold">{formatUSD(position.totalDebtUSD)}</p>
                </div>
                <div className="bg-zinc-900/50 rounded-lg p-4">
                  <p className="text-text-tertiary text-sm">Available to Borrow</p>
                  <p className="text-xl font-bold text-accent-cyan">{formatUSD(position.availableBorrowsUSD)}</p>
                </div>
                <div className="bg-zinc-900/50 rounded-lg p-4">
                  <p className="text-text-tertiary text-sm">Liquidation Threshold</p>
                  <p className="text-xl font-bold">{position.liquidationThreshold > 0 ? `${position.liquidationThreshold.toFixed(0)}%` : "--"}</p>
                </div>
              </div>
            </>
          )}

          {/* No Position */}
          {!position && !isLoading && !error && (
            <div className="text-center py-12">
              <p className="text-text-secondary">No active position found for this address on Tokos</p>
              <p className="text-text-tertiary text-sm mt-2">This address has not supplied or borrowed on Tokos</p>
            </div>
          )}
        </div>
      ) : isSearching ? (
        <form onSubmit={handleSearch} className="bg-card border border-card-border rounded-xl p-6">
          <label className="block text-text-secondary text-sm mb-2">Enter address to watch</label>
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
            <button type="submit" className="px-6 py-3 bg-accent-cyan text-black font-semibold rounded-lg hover:bg-accent-cyan/90 transition">
              View
            </button>
            <button
              type="button"
              onClick={() => { setIsSearching(false); setAddressInput(""); }}
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
          <p className="text-text-secondary mb-6">Enter a wallet address to view their DeFi positions in real-time</p>
          <button
            onClick={() => setIsSearching(true)}
            className="px-6 py-3 bg-accent-cyan text-black font-semibold rounded-lg hover:bg-accent-cyan/90 transition"
          >
            Enter Address
          </button>
        </div>
      )}
    </div>
  );
}
