import { Info } from 'lucide-react'

import { Card } from '@/features/catalyst/components/Card'
import { CardHead } from '@/features/catalyst/components/CardHead'
import { Heatmap } from '@/features/catalyst/components/Heatmap'
import { Metric } from '@/features/catalyst/components/Metric'

export function UserRetentionCard(): JSX.Element {
  return (
    <Card>
      <CardHead title="User Retention" action="Details" />
      <Metric value="24%" positive badge="+2.0%" />
      <Heatmap />
      <div className="grid grid-cols-12 gap-1 text-center text-[10px] text-[var(--cat-ink-3)]">
        {Array.from({ length: 12 }, (_, i) => (
          <span key={i}>{i + 1}</span>
        ))}
      </div>
      <div className="mt-3.5 flex items-center gap-2 rounded-md bg-[var(--cat-hover)] px-3 py-2.5 text-xs text-[var(--cat-ink-2)]">
        <Info size={14} className="text-[var(--cat-ink-3)]" />
        Last 12 months data updated at 1:51 PM.
      </div>
    </Card>
  )
}
