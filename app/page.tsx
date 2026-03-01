'use client'

import { ConnectWallet } from '@/components/ConnectWallet'

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <header className="border-b border-zinc-800 p-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <h1 className="text-xl font-bold">DeFi Pulse</h1>
          <ConnectWallet />
        </div>
      </header>
      
      <main className="mx-auto max-w-7xl p-4">
        <div className="grid gap-6 md:grid-cols-2">
          <section className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
            <h2 className="mb-4 text-lg font-semibold">Protocol Pulse</h2>
            <p className="text-zinc-400">Connect wallet to view protocol stats</p>
          </section>
          
          <section className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
            <h2 className="mb-4 text-lg font-semibold">Your Positions</h2>
            <p className="text-zinc-400">Connect wallet to view your positions</p>
          </section>
        </div>
      </main>
    </div>
  )
}
