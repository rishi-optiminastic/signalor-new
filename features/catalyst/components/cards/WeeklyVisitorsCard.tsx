import { Card } from '@/features/catalyst/components/Card'
import { CardHead } from '@/features/catalyst/components/CardHead'
import { Metric } from '@/features/catalyst/components/Metric'
import { Radar } from '@/features/catalyst/components/Radar'
import { BRAND, GREEN } from '@/features/catalyst/constants'

export function WeeklyVisitorsCard(): JSX.Element {
  return (
    <Card>
      <CardHead title="Weekly Visitors" action="Details" />
      <Metric value="16,008" positive badge="+1.1%" />
      <div className="my-1.5 inline-flex gap-1 self-start rounded-md bg-[var(--cat-track)] p-[3px]">
        <button className="inline-flex items-center gap-1.5 rounded-sm bg-[var(--cat-card)] px-2.5 py-[5px] text-xs font-semibold text-[var(--cat-ink)] shadow-sm">
          <span className="h-2 w-2 rounded-full" style={{ background: BRAND }} />
          New visitors
        </button>
        <button className="inline-flex items-center gap-1.5 rounded-sm px-2.5 py-[5px] text-xs font-medium text-[var(--cat-ink-2)]">
          <span className="h-2 w-2 rounded-full" style={{ background: GREEN }} />
          Returning visitors
        </button>
      </div>
      <Radar />
    </Card>
  )
}
