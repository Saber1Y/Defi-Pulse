# DeFi Pulse

Real-time DeFi dashboard on Somnia — combining personal margin tracking with global protocol analytics. Built with Somnia Reactivity SDK for instant, on-chain updates.

## Overview

DeFi Pulse is a reactive dashboard that lets users:
- **Track personal positions** across lending protocols (supplied, borrowed, health factor)
- **Monitor protocol analytics** in real-time (TVL, volume, active users)
- **Receive alerts** when health factor drops (warning at 1.5, critical at 1.1)

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

### Personal Margin Dashboard
- One-click wallet connect (Dynamic)
- Total supplied / borrowed in USD
- Net worth calculation
- Health factor with real-time alerts
- Per-asset breakdown (supply/borrow amounts, collateral status, APY)

### Protocol Pulse
- Combined TVL across tracked protocols
- 24h volume
- Active user count
- Per-protocol supply/borrow APY ranges

### Real-time Updates
- No polling — uses Somnia Reactivity SDK
- Instant UI updates when blocks produce new data




## Somnia Testnet Details

- **Chain ID**: 50312
- **RPC**: https://dream-rpc.somnia.network/
- **Explorer**: https://shannon-explorer.somnia.network/
- **Symbol**: STT (Somnia Test Token)

## License

MIT
