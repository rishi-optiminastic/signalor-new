import { Eye } from 'lucide-react'

import { BarMeter } from '@/features/catalyst/components/visibility/BarMeter'
import { MetricDelta } from '@/features/catalyst/components/visibility/MetricDelta'
import { VisCardHead } from '@/features/catalyst/components/visibility/VisCardHead'
import { BRAND } from '@/features/catalyst/constants'
import type { OverallVis } from '@/hooks/useVisibility'

export function OverallVisibilityCard({ data }: { data: OverallVis }): JSX.Element {
  return (
    <div className="flex flex-col gap-3 rounded-md border border-[var(--cat-border)] bg-[var(--cat-card)] p-4">
      <VisCardHead icon={Eye} title="Overall Visibility" iconColor={BRAND} />
      <div className="flex items-end gap-2.5">
        <span className="text-[32px] leading-none font-bold tracking-tight text-[var(--cat-ink)]">
          {data.score}
          <span className="ml-1 text-[15px] font-semibold text-[var(--cat-ink-3)]">/100</span>
        </span>
        <span className="mb-0.5">
          <MetricDelta value={data.delta} positive={data.positive} />
        </span>
      </div>
      <BarMeter value={data.score} color={BRAND} />
      <div className="text-[12px] text-[var(--cat-ink-3)]">
        {data.detected} of {data.total} platforms detected · Signalor
      </div>
    </div>
  )
}
