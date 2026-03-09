<p align="center">
  <img src="/defipulse.png" alt="DeFi Pulse" width="400" />
</p>

<p align="center">
  Real-time DeFi dashboard on Somnia, demonstrating Reactivity SDK for instant on-chain updates.
</p>

<p align="center">
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs" />
  <img alt="React" src="https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white" />
  <img alt="Tailwind" src="https://img.shields.io/badge/Tailwind-38B2AC?logo=tailwindcss&logoColor=white" />
  <img alt="Somnia" src="https://img.shields.io/badge/Somnia-Testnet-6366F1" />
</p>

## Overview

DeFi Pulse is a reactive dashboard that monitors DeFi positions on Somnia Testnet, demonstrating real-time blockchain data updates without traditional polling.

The app showcases:
- Live block tracking with auto-refresh
- Token balance checking for any address
- Wallet position monitoring
- Whale tracking with activity feeds
- Configurable alerts with browser push notifications

## Features

### Landing Page
Full explanation of the project with feature overview and step-by-step guide.

### Dashboard
- Live block number with real-time updates
- Gas price tracking
- Activity feed showing new blocks
- Connected wallet balance display

### Analytics
- Live network metrics (block, block time, gas price)
- Token balance checker for any wallet address
- Block time history visualization

### Watch Address
- Query any wallet for lending position data
- Health factor display with status indicators
- Position details (collateral, debt, available to borrow)

### Whale Trackers
- Monitor multiple wallet addresses
- Live activity feed showing position changes
- Near-liquidation table (HF < 1.5)

### Alerts
- Configure health factor threshold alerts
- Browser push notifications when alerts trigger
- Alert history with timestamps

## Tech Stack

- **Chain**: Somnia Testnet (Chain ID: 50312)
- **Frontend**: Next.js 16 + React 19 + TypeScript
- **Styling**: Tailwind CSS
- **Wallet**: Dynamic + wagmi
- **Reactivity**: @somnia-chain/reactivity
- **Data**: viem (direct contract calls)

## Reactivity SDK Demo

| Feature | Without Reactivity | With Reactivity |
|---------|-------------------|-----------------|
| Dashboard | Poll every 5s | Push: instant block updates |
| Watch Address | Poll for updates | Push: see changes live |
| Whale Trackers | Poll positions | Push: whale moves in real-time |
| Alerts | Poll for triggers | Push: instant notification |

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Demo Flow

1. Visit the landing page to understand the project
2. Click "Enter Dashboard" to access the dashboard
3. Go to Analytics to check token balances
4. Add addresses in Whale Trackers to monitor
5. Configure alerts in the Alerts page

## Contract

- **Tokos Lending Pool**: `0x7Cb9df1bc191B16BeFF9fdEC2cd1ef91Cac18176` (Testnet)

## Somnia Testnet Details

- **Chain ID**: 50312
- **RPC**: https://dream-rpc.somnia.network/
- **Explorer**: https://shannon-explorer.somnia.network/
- **Symbol**: STT (Somnia Test Token)

## License

MIT
