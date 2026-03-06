"use client";

import { 
  LayoutDashboard, 
  Wallet, 
  BarChart3, 
  Search, 
  Waves,
  Bell,
  X
} from "lucide-react";

export type PageView = "dashboard" | "portfolio" | "analytics" | "watch" | "whales" | "alerts";

interface SidebarProps {
  currentView: PageView;
  onViewChange: (view: PageView) => void;
  isOpen: boolean;
}

const navItems: { id: PageView; label: string; icon: React.ReactNode }[] = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
  { id: "portfolio", label: "Portfolio", icon: <Wallet size={20} /> },
  { id: "analytics", label: "Analytics", icon: <BarChart3 size={20} /> },
  { id: "watch", label: "Watch Address", icon: <Search size={20} /> },
  { id: "whales", label: "Whale Trackers", icon: <Waves size={20} /> },
  { id: "alerts", label: "Alerts", icon: <Bell size={20} /> },
];

export function Sidebar({ currentView, onViewChange, isOpen }: SidebarProps) {
  return (
    <aside 
      className={`bg-card border-r border-card-border min-h-screen flex flex-col transition-all duration-300 ${
        isOpen ? "w-64" : "w-0 lg:w-16"
      } overflow-hidden`}
    >
      <div className={`p-4 border-b border-card-border flex items-center ${isOpen ? "justify-between" : "justify-center"}`}>
        {isOpen ? (
          <>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <span className="text-accent-cyan">■</span>
              DeFi Pulse
            </h1>
          </>
        ) : (
          <span className="text-accent-cyan text-2xl font-bold">■</span>
        )}
      </div>

      <nav className="flex-1 p-2">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition ${
                  isOpen 
                    ? "justify-start" 
                    : "justify-center lg:justify-start lg:px-4"
                } ${
                  currentView === item.id
                    ? "bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/30"
                    : "text-text-secondary hover:bg-zinc-900 hover:text-foreground"
                }`}
                title={!isOpen ? item.label : undefined}
              >
                {item.icon}
                {isOpen && <span className="font-medium">{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className={`p-4 border-t border-card-border ${isOpen ? "" : "hidden lg:block lg:p-2"}`}>
        {isOpen ? (
          <div className="text-xs text-text-tertiary">
            <p>Somnia Testnet</p>
            <p className="mt-1">Powered by Reactivity SDK</p>
          </div>
        ) : (
          <div className="text-xs text-text-tertiary text-center lg:text-left">
            <p>Reactivity</p>
          </div>
        )}
      </div>
    </aside>
  );
}

interface MobileSidebarProps {
  currentView: PageView;
  onViewChange: (view: PageView) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function MobileSidebar({ currentView, onViewChange, isOpen, onClose }: MobileSidebarProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <aside className="absolute left-0 top-0 w-64 bg-card border-r border-card-border min-h-screen flex flex-col">
        <div className="p-4 border-b border-card-border flex items-center justify-between">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <span className="text-accent-cyan">■</span>
            DeFi Pulse
          </h1>
          <button onClick={onClose} className="p-2 hover:bg-zinc-900 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => {
                    onViewChange(item.id);
                    onClose();
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    currentView === item.id
                      ? "bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/30"
                      : "text-text-secondary hover:bg-zinc-900 hover:text-foreground"
                  }`}
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </div>
  );
}
