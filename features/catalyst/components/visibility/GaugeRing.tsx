import type { ReactNode } from 'react'

import { BRAND } from '@/features/catalyst/constants'

interface GaugeRingProps {
  value: number
  size?: number
  stroke?: number
  color?: string
  children?: ReactNode
}

const ARC = 0.75 // 270° gauge with the gap at the bottom

/** A three-quarter radial gauge — arc fills clockwise, gap centered at bottom. */
export function GaugeRing({
  value,
  size = 92,
  stroke = 8,
  color = BRAND,
  children,
}: GaugeRingProps): JSX.Element {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const pct = Math.max(0, Math.min(100, value)) / 100
  const common = {
    cx: size / 2,
    cy: size / 2,
    r,
    fill: 'none',
    strokeWidth: stroke,
    strokeLinecap: 'round' as const,
    style: { transform: 'rotate(135deg)', transformOrigin: 'center' },
  }
  return (
    <div
      className="relative grid shrink-0 place-items-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size}>
        <circle {...common} stroke="var(--cat-grid)" strokeDasharray={`${circ * ARC} ${circ}`} />
        {pct > 0 && (
          <circle {...common} stroke={color} strokeDasharray={`${circ * ARC * pct} ${circ}`} />
        )}
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center leading-none">
        {children}
      </div>
    </div>
  )
}
