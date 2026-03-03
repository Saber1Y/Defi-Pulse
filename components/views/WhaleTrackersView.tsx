"use client";

import { useState } from "react";
import { Plus, Eye } from "lucide-react";

export function WhaleTrackersView() {
  const [watching, setWatching] = useState<string[]>([]);

  const toggleWatch = (address: string) => {
    setWatching((prev) => 
      prev.includes(address) 
        ? prev.filter((a) => a !== address)
        : [...prev, address]
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Whale Trackers</h2>
        <p className="text-text-secondary">
          Monitor large positions and get real-time alerts
        </p>
      </div>

      <div className="bg-accent-cyan/10 border border-accent-cyan/30 rounded-xl p-6">
        <p className="text-accent-cyan font-medium">Whale Trackers Coming Soon</p>
        <p className="text-text-secondary text-sm mt-2">
          Watch any address and get real-time updates when they supply/borrow
        </p>
        <p className="text-text-tertiary text-xs mt-2">
          Powered by Somnia Reactivity SDK - no polling needed
        </p>
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

          <div className="text-center py-8 text-text-secondary">
            <p>No whales tracked yet</p>
            <p className="text-sm text-text-tertiary mt-2">Add whale addresses to monitor</p>
          </div>
        </div>

        <div className="bg-card border border-card-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Live Activity</h3>
            <span className="flex items-center gap-2 text-xs text-accent-green">
              <span className="w-2 h-2 bg-accent-green rounded-full"></span>
              Reactivity Ready
            </span>
          </div>

          <div className="text-center py-8 text-text-secondary">
            <p>Activity feed will show real-time updates</p>
            <p className="text-sm text-text-tertiary mt-2">Powered by push notifications</p>
          </div>
        </div>
      </div>
    </div>
  );
}
