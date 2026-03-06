import { publicClient } from './client'
import { formatEther } from 'viem'

export async function getAddressBalance(address: string): Promise<string> {
  try {
    const balance = await publicClient.getBalance({ address: address as `0x${string}` })
    return formatEther(balance)
  } catch {
    return '0'
  }
}

// ERC-20 balanceOf function
const ERC20_ABI = [
  {
    name: 'balanceOf',
    type: 'function',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    name: 'symbol',
    type: 'function',
    inputs: [],
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
  },
  {
    name: 'decimals',
    type: 'function',
    inputs: [],
    outputs: [{ name: '', type: 'uint8' }],
    stateMutability: 'view',
  },
] as const

export async function getTokenBalance(tokenAddress: string, walletAddress: string): Promise<{ balance: string; symbol: string; decimals: number } | null> {
  try {
    const [balance, symbol, decimals] = await Promise.all([
      publicClient.readContract({
        address: tokenAddress as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: [walletAddress as `0x${string}`],
      }),
      publicClient.readContract({
        address: tokenAddress as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'symbol',
      }),
      publicClient.readContract({
        address: tokenAddress as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'decimals',
      }),
    ])
    
    return {
      balance: formatEther(balance),
      symbol,
      decimals: Number(decimals),
    }
  } catch (error) {
    console.error('Error fetching token balance:', error)
    return null
  }
}


export const TOKOS_ADDRESSES = {
  LENDING_POOL: '0x7Cb9df1bc191B16BeFF9fdEC2cd1ef91Cac18176',
  POOL_LOGIC: '0x054d3103c6fDbF091B2E42BdaF46b0BA24A60938',
  POOL_DATA_PROVIDER: '0x6A8c1d9ff923B75D662Ee839E4AD8949279bAF10',
  REGISTRY: '0xac5ba04B233A8Dfe0d013c705Ce6B7B36179bCB7',
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
  {
    name: 'getUserAccountData',
    type: 'function',
    inputs: [],
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
  {
    name: 'accountData',
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
  {
    name: 'userAccountData',
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
  {
    name: 'getReservesList',
    type: 'function',
    inputs: [],
    outputs: [{ name: 'reserves', type: 'address[]' }],
    stateMutability: 'view',
  },
  {
    name: 'getAllMarkets',
    type: 'function',
    inputs: [],
    outputs: [{ name: 'markets', type: 'address[]' }],
    stateMutability: 'view',
  },
] as const

const FUNCTION_NAMES = [
  'getUserAccountData',
  'getAccountData', 
  'accountData',
  'userAccountData',
] as const

export interface UserPosition {
  totalCollateralUSD: number
  totalDebtUSD: number
  availableBorrowsUSD: number
  liquidationThreshold: number
  ltv: number
  healthFactor: number
}

async function tryReadContract(userAddress: `0x${string}`, functionName: typeof FUNCTION_NAMES[number]) {
  try {
    const result = await publicClient.readContract({
      address: TOKOS_ADDRESSES.LENDING_POOL,
      abi: LENDING_POOL_ABI,
      functionName,
      args: [userAddress],
    })
    return result
  } catch (error: any) {
    return null
  }
}

export async function getUserPosition(userAddress: string): Promise<UserPosition | null> {
  console.log('Fetching position for:', userAddress, 'from:', TOKOS_ADDRESSES.LENDING_POOL)
  
  for (const functionName of FUNCTION_NAMES) {
    try {
      const result = await tryReadContract(userAddress as `0x${string}`, functionName)
      
      if (result) {
        console.log('Tokos function found:', functionName)
        console.log('Raw values:', result)
        
        const [totalCollateralBase, totalDebtBase, availableBorrowsBase, currentLiquidationThreshold, ltv, healthFactor] = result as [bigint, bigint, bigint, bigint, bigint, bigint]

        console.log('Parsed values (no divide):', {
          totalCollateral: Number(formatEther(totalCollateralBase)),
          totalDebt: Number(formatEther(totalDebtBase)),
          availableBorrows: Number(formatEther(availableBorrowsBase)),
          liquidationThreshold: Number(currentLiquidationThreshold),
          ltv: Number(ltv),
          healthFactor: Number(formatEther(healthFactor)),
        })

        const isZeroPosition = totalCollateralBase === BigInt(0) && totalDebtBase === BigInt(0)

        const healthFactorValue = isZeroPosition 
          ? Infinity 
          : Number(formatEther(healthFactor)) / 1e18

        return {
          totalCollateralUSD: Number(formatEther(totalCollateralBase)),
          totalDebtUSD: Number(formatEther(totalDebtBase)),
          availableBorrowsUSD: Number(formatEther(availableBorrowsBase)),
          liquidationThreshold: isZeroPosition ? 0 : Number(currentLiquidationThreshold) / 10000,
          ltv: isZeroPosition ? 0 : Number(ltv) / 10000,
          healthFactor: healthFactorValue,
        }
      }
    } catch (error) {
      continue
    }
  }

  console.log('Contract found but no function worked. Need to check actual ABI.')
  return null
}

export async function getProtocolStats() {
  console.log('Tokos addresses:', TOKOS_ADDRESSES)
  
  try {
    const reservesList = await publicClient.readContract({
      address: TOKOS_ADDRESSES.LENDING_POOL,
      abi: LENDING_POOL_ABI,
      functionName: 'getReservesList',
    })
    console.log('Reserves:', reservesList)

    // Try to get count from data provider
    let userCount = 0
    try {
      const poolDataProviderAbi = [{
        name: 'getAllMarkets',
        type: 'function',
        inputs: [],
        outputs: [{ name: 'markets', type: 'address[]' }],
        stateMutability: 'view',
      }]
      const markets = await publicClient.readContract({
        address: TOKOS_ADDRESSES.POOL_DATA_PROVIDER,
        abi: poolDataProviderAbi,
        functionName: 'getAllMarkets',
      })
      console.log('Markets:', markets)
    } catch (e) {
      console.log('Could not get markets')
    }
    
    return {
      reserves: [...reservesList],
    }
  } catch (error) {
    console.log('Could not fetch reserves:', error)
    return { reserves: [] }
  }
}
