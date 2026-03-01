'use client'

import { DynamicWidget } from '@/lib/providers'

export function ConnectWallet() {
  return (
    <div className="flex items-center">
      <DynamicWidget />
    </div>
  )
}
