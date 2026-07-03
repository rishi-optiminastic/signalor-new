import { AreaChart } from '@/features/catalyst/components/AreaChart'
import { Card } from '@/features/catalyst/components/Card'
import { CardHead } from '@/features/catalyst/components/CardHead'
import { Delta } from '@/features/catalyst/components/Delta'
import { Metric } from '@/features/catalyst/components/Metric'
import { FUNNEL } from '@/features/catalyst/constants'

const MONTHS = ['FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL']

export function ConversionRateCard(): JSX.Element {
  return (
    <Card>
      <CardHead title="Conversion Rate" action="Details" />
      <Metric value="16.9%" positive badge="+2.1%" />
      <div className="my-2.5 flex flex-col gap-2">
        {FUNNEL.map(f => (
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
