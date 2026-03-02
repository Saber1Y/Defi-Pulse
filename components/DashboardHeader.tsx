'use client'

import { ConnectWallet } from './ConnectWallet'
import { Search, Bell } from 'lucide-react'

export function DashboardHeader() {
  return (
    <header className="border-b border-card-border bg-card sticky top-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-8">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-accent-cyan flex items-center justify-center">
              <span className="text-black text-sm font-bold">◆</span>
            </div>
            DeFi Pulse
          </h1>
          
          <nav className="hidden sm:flex items-center gap-6 text-sm">
            <a href="#" className="text-text-secondary hover:text-foreground transition">Explore</a>
            <a href="#" className="text-accent-cyan border-b-2 border-accent-cyan pb-1">Dashboard</a>
            <a href="#" className="text-text-secondary hover:text-foreground transition">Alerts</a>
            <a href="#" className="text-text-secondary hover:text-foreground transition">Docs</a>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center bg-zinc-900 rounded-lg px-4 py-2 gap-2 border border-card-border">
            <Search size={18} className="text-text-tertiary" />
            <input 
              type="text" 
              placeholder="Search protocols, pairs, or assets" 
              className="bg-transparent text-sm text-foreground placeholder-text-tertiary focus:outline-none w-64"
            />
          </div>
          
          <button className="p-2 hover:bg-zinc-900 rounded-lg transition">
            <Bell size={20} className="text-text-secondary" />
          </button>

          <ConnectWallet />
        </div>
      </div>
    </header>
  )
}
