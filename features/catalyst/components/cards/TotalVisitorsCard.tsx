import { Card } from '@/features/catalyst/components/Card'
import { CardHead } from '@/features/catalyst/components/CardHead'
import { Delta } from '@/features/catalyst/components/Delta'
import { Metric } from '@/features/catalyst/components/Metric'
import { VISITOR_SPLIT } from '@/features/catalyst/constants'

export function TotalVisitorsCard(): JSX.Element {
  return (
    <Card>
      <CardHead title="Total Visitors" action="Report" />
      <Metric value="237,456" positive={false} badge="-1.4%" />
      <div className="mt-4 mb-auto grid grid-cols-3 gap-2">
        {VISITOR_SPLIT.map(v => (
          <div key={v.label}>
            <div className="mb-1 text-xs text-[var(--cat-ink-2)]">{v.label}</div>
            <div className="text-[22px] font-bold text-[var(--cat-ink)]">{v.pct}</div>
          </div>
        ))}
      </div>
      <div className="mt-3.5 grid grid-cols-3 gap-2">
        {VISITOR_SPLIT.map(v => (
          <div key={v.label}>
            <div className="mb-[7px]">
              <Delta positive={v.positive}>{v.change}</Delta>
            </div>
            <div className="h-[5px] rounded-sm" style={{ background: v.color }} />
          </div>
        ))}
      </div>
    </Card>
  )
}
