import { SDK } from '@somnia-chain/reactivity'
import { createPublicClient, http } from 'viem'
import { somnia } from './config'

const publicClient = createPublicClient({
  chain: somnia,
  transport: http('https://dream-rpc.somnia.network/'),
})

export const sdk = new SDK({
  public: publicClient,
})

export { publicClient }
