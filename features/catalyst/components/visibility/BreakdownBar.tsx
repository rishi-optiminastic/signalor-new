import { BRAND } from '@/features/catalyst/constants'

interface BreakdownBarProps {
  label: string
  value: number
  color?: string
}

export function BreakdownBar({ label, value, color = BRAND }: BreakdownBarProps): JSX.Element {
  const pct = Math.max(0, Math.min(100, value))
  return (
    <div className="flex items-center gap-3 text-[13px]">
      <span className="w-[132px] shrink-0 truncate text-[var(--cat-ink-2)]">{label}</span>
      <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--cat-track)]">
        <span
          className="block h-full rounded-full"
          style={{ width: `${pct}%`, background: color }}
        />
      </span>
      <span className="w-8 shrink-0 text-right font-semibold text-[var(--cat-ink)]">{value}</span>
    </div>
  )
}
