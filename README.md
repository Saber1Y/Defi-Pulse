# DeFi Pulse

Real-time DeFi dashboard on Somnia - demonstrating the power of Reactivity SDK for instant on-chain updates.

## Overview

DeFi Pulse is a reactive dashboard that monitors DeFi positions on Somnia Testnet. It demonstrates real-time blockchain data updates without traditional polling.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Chain | Somnia Testnet (Chain ID: 50312) |
| Frontend | Next.js 16 + React 19 + TypeScript |
| Styling | Tailwind CSS |
| Wallet | Dynamic + wagmi |
| Reactivity | @somnia-chain/reactivity |
| Data | viem (direct contract calls) |

## Features

### Landing Page
- Full explanation of the project
- Feature overview with step-by-step guide
- Tech stack breakdown
- Call-to-action to enter dashboard

### Dashboard
- Live block number with auto-refresh (5s polling + Reactivity ready)
- Gas price tracking
- Real-time activity feed showing new blocks
- Connected wallet balance display
- Personal position summary

### Analytics
- Live network metrics (current block, block time, gas price)
- Token balance checker - query any address for native STT and ERC-20 balances
- Block time history chart
- Network stats for Somnia Testnet

### Watch Address
- Query any wallet address for lending position data
- Real-time updates via Reactivity SDK
- Health factor display with status indicators
- Position details (collateral, debt, available to borrow)

### Whale Trackers
- Track multiple wallet addresses
- Live activity feed showing position changes
- Example addresses for testing
- Near-liquidation table (HF < 1.5)
- Real-time updates via Reactivity SDK

### Alerts
- Configure health factor threshold alerts
- Add addresses to watch
- Alert history with timestamps
- Browser push notifications when alerts trigger
- Real-time checking via Reactivity SDK

## Reactivity SDK Integration

The app demonstrates Reactivity SDK for real-time updates:

| Feature | Without Reactivity | With Reactivity |
|---------|-------------------|-----------------|
| Dashboard | Poll every 5s | Push: instant block updates |
| Portfolio | Poll for position | Push: instant when data changes |
| Watch Address | Poll for updates | Push: see changes live |
| Whale Trackers | Poll positions | Push: whale moves in real-time |
| Alerts | Poll for triggers | Push: instant notification |

## Somnia Testnet Details

- **Chain ID**: 50312
- **RPC**: https://dream-rpc.somnia.network/
- **Explorer**: https://shannon-explorer.somnia.network/
- **Symbol**: STT (Somnia Test Token)

## Tokos Integration

- **Lending Pool**: 0x7Cb9df1bc191B16BeFF9fdEC2cd1ef91Cac18176
- Fetches user account data (collateral, debt, health factor)
- Supports multiple function names for compatibility

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Run development server: `npm run dev`
4. Open http://localhost:3000

## How to Demo

1. Visit the landing page to understand the project
2. Click "Enter Dashboard" to access the dashboard
3. Go to Analytics to check token balances
4. Add addresses in Whale Trackers to monitor
5. Configure alerts in the Alerts page and enable push notifications

## License

MIT
