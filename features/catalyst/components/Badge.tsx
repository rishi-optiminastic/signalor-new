import type { ReactNode } from 'react'

import { GREEN, NEG } from '@/features/catalyst/constants'

interface BadgeProps {
  positive: boolean
  children: ReactNode
}

/**
 * White chip with a thin vertical accent bar (green up / red down) and the
 * value in dark text — a compact "indicator" pill.
 */
export function Badge({ positive, children }: BadgeProps): JSX.Element {
  return (
    <span className="inline-flex items-center gap-1 rounded-sm border-1 border-[var(--cat-border)] bg-[var(--cat-card)] px-1 py-0.5 text-[11px] font-semibold text-[var(--cat-ink)] shadow-[0_1px_1px_rgba(16,24,40,.04)]">
      <span className="h-3 w-[4px] rounded-full" style={{ background: positive ? GREEN : NEG }} />
      {children}
    </span>
  )
}
