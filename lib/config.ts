import { http, createConfig } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import type { Chain } from 'viem'

export const somnia: Chain = {
  id: 50312,
  name: 'Somnia Testnet',
  nativeCurrency: {
    name: 'Somnia Test Token',
    symbol: 'STT',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://dream-rpc.somnia.network/'],
    },
    public: {
      http: ['https://dream-rpc.somnia.network/'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Somnia Explorer',
      url: 'https://shannon-explorer.somnia.network/',
    },
  },
}

export const config = createConfig({
  chains: [mainnet, somnia] as const,
  multiInjectedProviderDiscovery: false,
  transports: {
    [mainnet.id]: http(),
    [somnia.id]: http(),
  },
})

export const somniaChain = somnia
