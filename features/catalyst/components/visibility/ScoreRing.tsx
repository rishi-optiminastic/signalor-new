import type { ReactNode } from 'react'

import { BRAND } from '@/features/catalyst/constants'

interface ScoreRingProps {
  value: number
  size?: number
  stroke?: number
  color?: string
  children?: ReactNode
}

function RingSvg({
  size,
  stroke,
  color,
  offset,
  circumference,
}: {
  size: number
  stroke: number
  color: string
  offset: number
  circumference: number
}): JSX.Element {
  const r = (size - stroke) / 2
  const common = { cx: size / 2, cy: size / 2, r, fill: 'none', strokeWidth: stroke }
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle {...common} stroke="var(--cat-grid)" />
      <circle
        {...common}
        stroke={color}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
      />
    </svg>
  )
}

export function ScoreRing({
  value,
  size = 96,
  stroke = 8,
  color = BRAND,
  children,
}: ScoreRingProps): JSX.Element {
  const r = (size - stroke) / 2
  const circumference = 2 * Math.PI * r
  const pct = Math.max(0, Math.min(100, value))
  const offset = circumference * (1 - pct / 100)

  return (
    <div
      className="relative grid shrink-0 place-items-center"
      style={{ width: size, height: size }}
    >
      <RingSvg
        size={size}
        stroke={stroke}
        color={color}
        offset={offset}
        circumference={circumference}
      />
      <div className="absolute inset-0 grid place-items-center text-center leading-tight">
        {children}
      </div>
    </div>
  )
}
