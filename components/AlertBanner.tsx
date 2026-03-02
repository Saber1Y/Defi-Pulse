'use client'

import { AlertTriangle, X } from 'lucide-react'
import { useState } from 'react'

interface AlertBannerProps {
  level: 'critical' | 'warning' | 'info'
  title: string
  message: string
}

export function AlertBanner({ level, title, message }: AlertBannerProps) {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  const bgColor = level === 'critical' ? 'bg-red-900/20 border-red-800' : 'bg-yellow-900/20 border-yellow-800'
  const textColor = level === 'critical' ? 'text-red-400' : 'text-yellow-400'
  const iconColor = level === 'critical' ? 'text-accent-red' : 'text-accent-yellow'
  const bgBtnHover = level === 'critical' ? 'hover:bg-red-900/30' : 'hover:bg-yellow-900/30'

  return (
    <div className={`${bgColor} border rounded-lg p-4 mb-4 flex items-center justify-between`}>
      <div className="flex items-center gap-3">
        <AlertTriangle size={24} className={iconColor} />
        <div>
          <h3 className="font-semibold text-white">{title}</h3>
          <p className={`text-sm ${textColor}`}>{message}</p>
        </div>
      </div>
      <button 
        onClick={() => setIsVisible(false)}
        className={`p-1 ${bgBtnHover} rounded transition`}
      >
        <X size={20} className={textColor} />
      </button>
    </div>
  )
}
