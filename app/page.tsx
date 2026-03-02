"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Sidebar, MobileSidebar, PageView } from "@/components/Sidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { DashboardView } from "@/components/views/DashboardView";
import { PortfolioView } from "@/components/views/PortfolioView";
import { AnalyticsView } from "@/components/views/AnalyticsView";
import { WatchAddressView } from "@/components/views/WatchAddressView";
import { WhaleTrackersView } from "@/components/views/WhaleTrackersView";
import { AlertsView } from "@/components/views/AlertsView";

export default function Home() {
  const [currentView, setCurrentView] = useState<PageView>("dashboard");
  const [viewedAddress, setViewedAddress] = useState<string>("");
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleViewAddress = (address: string) => {
    setViewedAddress(address);
    setCurrentView("portfolio");
  };

  const handleClearView = () => {
    setViewedAddress("");
  };

  const handleToggleAlerts = () => {
    setAlertsOpen((prev) => !prev);
  };

  const renderView = () => {
    switch (currentView) {
      case "dashboard":
        return <DashboardView />;
      case "portfolio":
        return <PortfolioView viewedAddress={viewedAddress} />;
      case "analytics":
        return <AnalyticsView />;
      case "watch":
        return (
          <WatchAddressView
            viewedAddress={viewedAddress}
            onViewAddress={handleViewAddress}
            onClearView={handleClearView}
          />
        );
      case "whales":
        return <WhaleTrackersView />;
      case "alerts":
        return <AlertsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} isOpen={sidebarOpen} />
      <MobileSidebar 
        currentView={currentView} 
        onViewChange={setCurrentView}
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      <div className="flex-1 flex flex-col">
        <DashboardHeader
          viewedAddress={viewedAddress}
          onViewAddress={handleViewAddress}
          onClearView={handleClearView}
          onToggleAlerts={handleToggleAlerts}
          alertsOpen={alertsOpen}
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        />

        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {renderView()}

            <footer className="mt-16 flex flex-col md:flex-row items-center justify-between text-text-tertiary text-xs py-8 border-t border-card-border">
              <div className="flex items-center gap-2">
                <span>DeFi Pulse Monitor</span>
                <span>Somnia Testnet - Powered by Reactivity SDK</span>
              </div>
            </footer>
          </div>
        </main>
      </div>

      {alertsOpen && currentView !== "alerts" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setAlertsOpen(false)}
          />
          <div className="relative bg-card border border-card-border rounded-xl p-6 w-full max-w-md mx-4">
            <button 
              onClick={() => setAlertsOpen(false)}
              className="absolute top-4 right-4 p-2 hover:bg-zinc-900 rounded-lg transition"
            >
              <span className="sr-only">Close</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div className="text-center py-8">
              <p className="text-text-secondary">Quick alerts view - go to Alerts tab for full config</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
