<p align="center">
  <img src="/defipulse.png" alt="DeFi Pulse" width="400" />
</p>

<p align="center">
  Real-time DeFi dashboard for Tokos lending positions on Somnia, powered by Reactivity SDK.
</p>

<p align="center">
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs" />
  <img alt="React" src="https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white" />
  <img alt="Tailwind" src="https://img.shields.io/badge/Tailwind-38B2AC?logo=tailwindcss&logoColor=white" />
  <img alt="Somnia" src="https://img.shields.io/badge/Somnia-Testnet-6366F1" />
</p>

## About

DeFi Pulse is a real-time dashboard that lets users monitor their Tokos lending positions on Somnia Testnet. It integrates directly with the Tokos protocol to fetch and display user positions, health factors, and collateral data in real-time.

The project showcases Somnia's Reactivity SDK for instant on-chain updates - no more refreshing pages or waiting for polls.

## Built for Tokos Users

This dashboard connects directly to Tokos lending pool to show:
- Total collateral supplied
- Total debt borrowed
- Available borrow power
- Health factor and liquidation risk
- Position changes over time

When users supply or borrow on Tokos, they can track their positions here with live updates.

## Features

### Watch Any Address
Enter any wallet address to view their Tokos lending position. See their collateral, debt, health factor, and available to borrow - all updating in real-time when the address interacts with Tokos.

### Whale Trackers
Monitor multiple addresses at once. Great for tracking whale wallets, team treasuries, or any address you want to keep an eye on. Shows activity feed when positions change.

### Alerts System
Set health factor thresholds (e.g., alert me when HF drops below 1.5). Get browser push notifications when positions approach liquidation. Alerts check in real-time as blocks come in.

### Analytics & Token Balances
Check any address's STT token balance (native and ERC-20). View live network stats including block times and gas prices.

### Dashboard
See your connected wallet's position at a glance. Watch the live block counter update as new blocks are mined - this is Reactivity SDK in action.

## How It Works

The app reads directly from Tokos smart contracts:
- Lending Pool: `0x7Cb9df1bc191B16BeFF9fdEC2cd1ef91Cac18176`
- Calls `getUserAccountData(address)` to fetch position details

Reactivity SDK subscribes to Tokos events. When users supply, borrow, or repay on Tokos, the dashboard updates instantly - no refreshing needed.

## Why Reactivity SDK

Traditional dApps poll for updates every few seconds. With Reactivity SDK:
- Updates push the moment blocks confirm
- No wasted API calls
- Feels like a native app
- Lower latency for time-sensitive data like liquidation risk

## Tech Stack

- Next.js 16 + React 19 + TypeScript
- Tailwind CSS for styling
- viem for contract reads
- @somnia-chain/reactivity for real-time updates
- Dynamic + wagmi for wallet connection

## Getting Started

```bash
npm install
npm run dev
```

Visit http://localhost:3000

## Testing the Demo

1. Go to app.tokos.fi on testnet
2. Connect wallet and make a supply/borrow transaction
3. Use your wallet address in DeFi Pulse to see your position
4. Watch the block number - it updates in real-time

## Network

- **Chain**: Somnia Testnet (50312)
- **RPC**: https://dream-rpc.somnia.network/
- **Explorer**: https://shannon-explorer.somnia.network/

## License

MIT
