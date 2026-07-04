import { Card } from '@/features/catalyst/components/Card'
import { CardHead } from '@/features/catalyst/components/CardHead'
import { Delta } from '@/features/catalyst/components/Delta'
import { Metric } from '@/features/catalyst/components/Metric'
import { BLUE, BRAND, PURPLE } from '@/features/catalyst/constants'

interface CitationRow {
  label: string
  pct: string
  change: string
  positive: boolean
  color: string
}

const CITATIONS: CitationRow[] = [
  { label: 'Answers', pct: '58%', change: '+12%', positive: true, color: BRAND },
  { label: 'Sources', pct: '27%', change: '+5%', positive: true, color: BLUE },
  { label: 'Mentions', pct: '15%', change: '-2%', positive: false, color: PURPLE },
]

export function TotalVisitorsCard(): JSX.Element {
  return (
    <Card>
      <CardHead title="AI Citations" action="Report" />
      <Metric value="3,910" positive badge="+34%" />
      <div className="mt-4 mb-auto grid grid-cols-3 gap-2">
        {CITATIONS.map(v => (
          <div key={v.label}>
            <div className="mb-1 text-xs text-[var(--cat-ink-2)]">{v.label}</div>
            <div className="text-[22px] font-bold text-[var(--cat-ink)]">{v.pct}</div>
          </div>
        ))}
      </div>
      <div className="mt-3.5 grid grid-cols-3 gap-2">
        {CITATIONS.map(v => (
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
