import { publicClient } from './client'
import { formatEther } from 'viem'


export const TOKOS_ADDRESSES = {
  LENDING_POOL: '0x7Cb9df1bc191B16BeFF9fdEC2cd1ef91Cac18176',
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
  // Alternative: getAccountData
  {
    name: 'getAccountData',
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

async function tryReadContract(userAddress: `0x${string}`, functionName: 'getUserAccountData' | 'getAccountData') {
  try {
    const result = await publicClient.readContract({
      address: TOKOS_ADDRESSES.LENDING_POOL,
      abi: LENDING_POOL_ABI,
      functionName,
      args: [userAddress],
    })
    return result
  } catch {
    return null
  }
}

export async function getUserPosition(userAddress: string): Promise<UserPosition | null> {
  try {
    // Try getUserAccountData first
    let result = await tryReadContract(userAddress as `0x${string}`, 'getUserAccountData')
    
    // Try getAccountData if first failed
    if (!result) {
      result = await tryReadContract(userAddress as `0x${string}`, 'getAccountData')
    }

    if (!result) {
      console.log('Contract found but no function worked. Need to check actual ABI.')
      return null
    }

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
