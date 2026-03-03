import { createPublicClient, http } from 'viem'
import { somnia } from '../config'

export const publicClient = createPublicClient({
  chain: somnia,
  transport: http('https://dream-rpc.somnia.network/'),
})
