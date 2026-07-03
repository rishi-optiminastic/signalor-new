import type { LucideIcon } from 'lucide-react'

import { BRAND } from '@/features/catalyst/constants'
import { scoreColor } from '@/features/catalyst/visibility-data'

interface AnalysisHeaderProps {
  icon: LucideIcon
  name: string
  score: number
  badge?: boolean
}

export function AnalysisHeader({
  icon: Icon,
  name,
  score,
  badge = true,
}: AnalysisHeaderProps): JSX.Element {
  return (
    <div className="flex items-center gap-2.5">
      <span className="grid h-8 w-8 place-items-center rounded-full bg-[var(--cat-hover)]">
        <Icon size={16} style={{ color: BRAND }} />
      </span>
      <span className="text-[15px] font-semibold text-[var(--cat-ink)]">{name}</span>
      {badge && (
        <span
          className="rounded-full border px-2 py-0.5 text-[11px] font-medium"
          style={{ color: '#17A673', borderColor: 'rgba(23,166,115,.35)' }}
        >
          AI Analysis
        </span>
      )}
      <span className="ml-auto text-[16px] font-bold" style={{ color: scoreColor(score) }}>
        {score}
        <span className="text-[13px] font-semibold text-[var(--cat-ink-3)]">/100</span>
      </span>
    </div>
  )
}
