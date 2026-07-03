import { BRAND, GREEN } from '@/features/catalyst/constants'

const R = 6
const C = 2 * Math.PI * R

interface ProgressCellProps {
  value: number
}

export function ProgressCell({ value }: ProgressCellProps): JSX.Element {
  const pct = Math.max(0, Math.min(100, value))
  const done = pct >= 100
  const none = pct <= 0

  let color = BRAND
  if (done) color = GREEN
  else if (none) color = '#D4D4D4'

  let label = `${pct}% Completed`
  if (done) label = 'Done'
  else if (none) label = 'Not Started'

  return (
    <span className="inline-flex items-center gap-2 text-[13px] text-[var(--cat-ink)]">
      <svg width={16} height={16} viewBox="0 0 16 16" className="shrink-0">
        <circle cx="8" cy="8" r={R} fill="none" stroke="var(--cat-grid)" strokeWidth="2.5" />
        {!none && (
          <circle
            cx="8"
            cy="8"
            r={R}
            fill="none"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={C * (1 - pct / 100)}
            transform="rotate(-90 8 8)"
          />
        )}
      </svg>
      {label}
    </span>
  )
}
