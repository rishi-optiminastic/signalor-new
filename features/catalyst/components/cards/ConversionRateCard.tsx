import { AreaChart } from '@/features/catalyst/components/AreaChart'
import { Card } from '@/features/catalyst/components/Card'
import { CardHead } from '@/features/catalyst/components/CardHead'
import { Delta } from '@/features/catalyst/components/Delta'
import { Metric } from '@/features/catalyst/components/Metric'

const MONTHS = ['FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL']

interface FunnelRow {
  name: string
  num: string
  change: string
  positive: boolean
}

const SOV_FUNNEL: FunnelRow[] = [
  { name: 'Prompts tracked', num: '248', change: '+8%', positive: true },
  { name: 'Cited in answers', num: '156', change: '+12%', positive: true },
  { name: 'Ranked #1', num: '62', change: '+4%', positive: true },
]

export function ConversionRateCard(): JSX.Element {
  return (
    <Card>
      <CardHead title="Share of Voice" action="Details" />
      <Metric value="62%" positive badge="+6.1%" />
      <div className="my-2.5 flex flex-col gap-2">
        {SOV_FUNNEL.map(f => (
          <div key={f.name} className="flex items-center text-[13px]">
            <span className="text-[var(--cat-ink-2)]">{f.name}</span>
            <span className="mr-3 ml-auto font-semibold text-[var(--cat-ink)]">{f.num}</span>
            <Delta positive={f.positive}>{f.change}</Delta>
          </div>
        ))}
      </div>
      <AreaChart />
      <div className="mt-1.5 flex justify-between text-[10px] text-[var(--cat-ink-3)]">
        {MONTHS.map(m => (
          <span key={m}>{m}</span>
        ))}
      </div>
    </Card>
  )
}
