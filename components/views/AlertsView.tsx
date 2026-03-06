"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Bell, Plus, Trash2, AlertTriangle, Zap, CheckCircle } from "lucide-react";
import { getUserPosition, UserPosition } from "@/lib/contracts/tokos";
import { requestNotificationPermission, showNotification } from "@/lib/notifications";

interface AlertConfig {
  id: string;
  type: "health-factor" | "liquidation" | "balance";
  condition: "below" | "above" | "change";
  value: string;
  enabled: boolean;
}

interface AlertEvent {
  id: string;
  alertId: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface WatchedAddress {
  address: string;
  position: UserPosition | null;
  previousPosition: UserPosition | null;
}

export function AlertsView() {
  const [alerts, setAlerts] = useState<AlertConfig[]>([
    { id: "1", type: "health-factor", condition: "below", value: "1.5", enabled: true },
    { id: "2", type: "health-factor", condition: "below", value: "1.1", enabled: true },
  ]);
  const [watchedAddresses, setWatchedAddresses] = useState<string[]>([]);
  const [watchedData, setWatchedData] = useState<Map<string, WatchedAddress>>(new Map());
  const [alertEvents, setAlertEvents] = useState<AlertEvent[]>([]);
  const [newAddress, setNewAddress] = useState("");
  const [triggeredCount, setTriggeredCount] = useState(0);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  // Request notification permission on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotificationsEnabled(Notification.permission === 'granted');
    }
  }, []);

  const enableNotifications = () => {
    const granted = requestNotificationPermission();
    setNotificationsEnabled(granted);
  };

  const checkAlerts = useCallback(async (address: string, position: UserPosition | null, previous: UserPosition | null) => {
    const newEvents: AlertEvent[] = [];
    
    for (const alert of alerts) {
      if (!alert.enabled) continue;
      
      if (alert.type === "health-factor" && position) {
        const hf = Number(position.healthFactor);
        const threshold = parseFloat(alert.value);
        
        if (alert.condition === "below" && hf > 0 && hf < threshold && (!previous || Number(previous.healthFactor) >= threshold)) {
          newEvents.push({
            id: `${Date.now()}-${Math.random()}`,
            alertId: alert.id,
            message: `[ALERT] ${address.slice(0, 8)}...${address.slice(-6)} Health Factor dropped to ${hf.toFixed(2)} (below ${threshold})`,
            timestamp: new Date(),
            read: false,
          });
        }
      }
    }
    
    if (newEvents.length > 0) {
      setAlertEvents(prev => [...newEvents, ...prev].slice(0, 50));
      setTriggeredCount(prev => prev + newEvents.length);
      
      // Show push notification
      if (notificationsEnabled) {
        newEvents.forEach(event => {
          showNotification('DeFi Pulse Alert', event.message);
        });
      }
    }
  }, [alerts, notificationsEnabled]);

  useEffect(() => {
    const fetchAllPositions = async () => {
      for (const addr of watchedAddresses) {
        const position = await getUserPosition(addr);
        setWatchedData(prev => {
          const prevPos = prev.get(addr)?.position || null;
          const newMap = new Map(prev);
          newMap.set(addr, { address: addr, position, previousPosition: prevPos });
          return newMap;
        });
        
        if (position) {
          const prevPos = watchedData.get(addr)?.position || null;
          await checkAlerts(addr, position, prevPos);
        }
      }
    };

    if (watchedAddresses.length > 0) {
      fetchAllPositions();
      
      const setupReactivity = async () => {
        try {
          const { SDK } = await import("@somnia-chain/reactivity");
          const { createPublicClient, http } = await import("viem");
          
          const publicClient = createPublicClient({
            chain: { id: 50312, name: 'Somnia Testnet', nativeCurrency: { name: 'STT', symbol: 'STT', decimals: 18 }, rpcUrls: { default: { http: ['https://dream-rpc.somnia.network/'] } } },
            transport: http(),
          });
          
          const sdk = new SDK({ public: publicClient });
          
          await sdk.subscribe({
            ethCalls: [],
            onData: () => fetchAllPositions(),
          });
        } catch (err) {}
      };
      
      setupReactivity();
    }
  }, [watchedAddresses]);

  const addAlert = () => {
    const newAlert: AlertConfig = {
      id: Date.now().toString(),
      type: "health-factor",
      condition: "below",
      value: "1.5",
      enabled: true,
    };
    setAlerts([...alerts, newAlert]);
  };

  const deleteAlert = (id: string) => {
    setAlerts(alerts.filter(a => a.id !== id));
  };

  const toggleAlert = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a));
  };

  const addWatchAddress = () => {
    if (newAddress.startsWith("0x") && newAddress.length === 42) {
      if (!watchedAddresses.includes(newAddress.toLowerCase())) {
        setWatchedAddresses([...watchedAddresses, newAddress.toLowerCase()]);
      }
      setNewAddress("");
    }
  };

  const removeWatchAddress = (addr: string) => {
    setWatchedAddresses(watchedAddresses.filter(a => a !== addr));
    setWatchedData(prev => {
      const newMap = new Map(prev);
      newMap.delete(addr);
      return newMap;
    });
  };

  const markAllRead = () => {
    setAlertEvents(prev => prev.map(e => ({ ...e, read: true })));
  };

  const unreadCount = alertEvents.filter(e => !e.read).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Alerts</h2>
        <p className="text-text-secondary">Configure real-time notifications via Reactivity SDK</p>
      </div>

      <div className="bg-accent-cyan/10 border border-accent-cyan/30 rounded-xl p-4 flex items-center gap-3">
        <Zap size={20} className="text-accent-cyan" />
        <div>
          <p className="text-accent-cyan text-sm font-medium">Reactive Alerts</p>
          <p className="text-text-secondary text-xs">Alerts trigger instantly when conditions are met</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-card-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Alert Rules</h3>
              <button onClick={addAlert} className="flex items-center gap-2 px-3 py-1.5 bg-accent-cyan text-black rounded-lg text-sm font-semibold hover:bg-accent-cyan/90 transition">
                <Plus size={16} />
                New Alert
              </button>
            </div>

            <div className="space-y-3">
              {alerts.map((alert) => (
                <div key={alert.id} className={`flex items-center justify-between p-4 rounded-lg border ${alert.enabled ? "bg-zinc-900/50 border-card-border" : "bg-zinc-900/20 border-transparent opacity-60"}`}>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${alert.type === "health-factor" ? "bg-accent-yellow/10" : "bg-accent-red/10"}`}>
                      <AlertTriangle size={16} className={alert.type === "health-factor" ? "text-accent-yellow" : "text-accent-red"} />
                    </div>
                    <div>
                      <p className="font-medium">
                        {alert.type === "health-factor" && `Health Factor ${alert.condition} ${alert.value}`}
                        {alert.type === "liquidation" && "Liquidation Alert"}
                        {alert.type === "balance" && "Balance Change"}
                      </p>
                      <p className="text-xs text-text-tertiary">
                        {alert.type === "health-factor" && "Notify when health factor drops"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => toggleAlert(alert.id)} className={`relative w-11 h-6 rounded-full transition-colors ${alert.enabled ? "bg-accent-cyan" : "bg-zinc-700"}`}>
                      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${alert.enabled ? "left-6" : "left-1"}`} />
                    </button>
                    <button onClick={() => deleteAlert(alert.id)} className="p-2 hover:bg-zinc-800 text-text-secondary rounded-lg transition">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-card-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Watched Addresses</h3>
              <div className="flex gap-2">
                <input type="text" placeholder="0x..." value={newAddress} onChange={e => setNewAddress(e.target.value)} onKeyDown={e => e.key === "Enter" && addWatchAddress()} className="bg-zinc-900 border border-card-border rounded-lg px-3 py-1.5 text-sm text-foreground placeholder-text-tertiary focus:outline-none focus:border-accent-cyan font-mono" />
                <button onClick={addWatchAddress} disabled={!newAddress} className="px-3 py-1.5 bg-accent-cyan text-black rounded-lg text-sm font-semibold hover:bg-accent-cyan/90 transition disabled:opacity-50">
                  Add
                </button>
              </div>
            </div>
            <div className="space-y-2">
              {watchedAddresses.length === 0 ? (
                <p className="text-text-tertiary text-sm">Add addresses to monitor their positions</p>
              ) : (
                watchedAddresses.map(addr => {
                  const data = watchedData.get(addr);
                  return (
                    <div key={addr} className="flex items-center justify-between p-3 bg-zinc-900/50 rounded-lg">
                      <div>
                        <p className="font-mono text-sm">{addr.slice(0, 14)}...{addr.slice(-8)}</p>
                        <p className="text-xs text-text-tertiary">
                          HF: {data?.position?.healthFactor ? (Number.isFinite(data.position.healthFactor) ? data.position.healthFactor.toFixed(2) : "∞") : "--"}
                        </p>
                      </div>
                      <button onClick={() => removeWatchAddress(addr)} className="p-1 hover:bg-zinc-800 text-text-secondary rounded">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="bg-card border border-card-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Alert History</h3>
              {unreadCount > 0 && <button onClick={markAllRead} className="text-xs text-accent-cyan hover:underline">Mark all read</button>}
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {alertEvents.length === 0 ? (
                <p className="text-text-tertiary text-sm">No alerts triggered yet</p>
              ) : (
                alertEvents.map(event => (
                  <div key={event.id} className={`flex items-center gap-3 p-3 rounded-lg ${event.read ? "bg-zinc-900/30" : "bg-accent-yellow/10"}`}>
                    <AlertTriangle size={16} className="text-accent-yellow" />
                    <div className="flex-1">
                      <p className="text-sm">{event.message}</p>
                      <p className="text-xs text-text-tertiary">{event.timestamp.toLocaleString()}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card border border-card-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Push Notifications</h3>
              <button
                onClick={enableNotifications}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${
                  notificationsEnabled 
                    ? "bg-accent-green/20 text-accent-green border border-accent-green/30"
                    : "bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/30"
                }`}
              >
                {notificationsEnabled ? "Enabled" : "Enable"}
              </button>
            </div>
            <p className="text-text-secondary text-sm">
              {notificationsEnabled 
                ? "You will receive browser notifications when alerts trigger."
                : "Click to enable browser notifications for real-time alerts."}
            </p>
          </div>

          <div className="bg-card border border-card-border rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Alert Statistics</h3>
            <div className="space-y-4">
              <div className="p-4 bg-zinc-900/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-text-secondary">Total Rules</span>
                  <span className="text-xl font-bold">{alerts.length}</span>
                </div>
              </div>
              <div className="p-4 bg-zinc-900/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-text-secondary">Active</span>
                  <span className="text-xl font-bold text-accent-green">{alerts.filter(a => a.enabled).length}</span>
                </div>
              </div>
              <div className="p-4 bg-zinc-900/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-text-secondary">Triggered</span>
                  <span className="text-xl font-bold text-accent-yellow">{triggeredCount}</span>
                </div>
              </div>
              <div className="p-4 bg-zinc-900/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-text-secondary">Watched Addresses</span>
                  <span className="text-xl font-bold">{watchedAddresses.length}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-card-border rounded-xl p-6">
            <div className="flex items-start gap-3">
              <Bell size={20} className="text-accent-cyan mt-0.5" />
              <div>
                <p className="font-semibold text-accent-cyan">How It Works</p>
                <p className="text-sm text-text-secondary mt-2">
                  1. Add addresses to watch<br/>
                  2. Create alert rules<br/>
                  3. Get instant notifications when conditions are met via Reactivity SDK
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
