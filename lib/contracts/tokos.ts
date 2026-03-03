import { publicClient } from './client'
import { formatEther } from 'viem'

// TODO: Replace with actual Tokos contract addresses from explorer
export const TOKOS_ADDRESSES = {
  // Will be added when found from explorer
  LENDING_POOL: '0x0000000000000000000000000000000000000000',
} as const

// Aave V3 compatible ABI for reading user account data
const LENDING_POOL_ABI = [
  {
    name: 'getUserAccountData',
    type: 'function',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [
      { name: 'totalCollateralBase', type: 'uint256' },
      { name: 'totalDebtBase', type: 'uint256' },
      { name: 'availableBorrowsBase', type: 'uint256' },
      { name: 'currentLiquidationThreshold', type: 'uint256' },
      { name: 'ltv', type: 'uint256' },
      { name: 'healthFactor', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
] as const

export interface UserPosition {
  totalCollateralUSD: number
  totalDebtUSD: number
  availableBorrowsUSD: number
  liquidationThreshold: number
  ltv: number
  healthFactor: number
}

export async function getUserPosition(userAddress: string): Promise<UserPosition | null> {
  try {
    const result = await publicClient.readContract({
      address: TOKOS_ADDRESSES.LENDING_POOL,
      abi: LENDING_POOL_ABI,
      functionName: 'getUserAccountData',
      args: [userAddress as `0x${string}`],
    })

    const [totalCollateralBase, totalDebtBase, availableBorrowsBase, currentLiquidationThreshold, ltv, healthFactor] = result

    return {
      totalCollateralUSD: Number(formatEther(totalCollateralBase)) / 1e8,
      totalDebtUSD: Number(formatEther(totalDebtBase)) / 1e8,
      availableBorrowsUSD: Number(formatEther(availableBorrowsBase)) / 1e8,
      liquidationThreshold: Number(currentLiquidationThreshold) / 10000,
      ltv: Number(ltv) / 10000,
      healthFactor: Number(formatEther(healthFactor)) / 1e18,
    }
  } catch (error) {
    console.error('Error fetching user position:', error)
    return null
  }
}

export async function getProtocolStats() {
  // TODO: Implement with actual contract calls
  // For now, this would read from lending pool reserves
  return {
    totalTVL: 0,
    totalBorrowed: 0,
    activeUsers: 0,
  }
}
