import { Card } from '@/features/catalyst/components/Card'
import { CardHead } from '@/features/catalyst/components/CardHead'
import { Delta } from '@/features/catalyst/components/Delta'
import { LineChart } from '@/features/catalyst/components/LineChart'
import { Metric } from '@/features/catalyst/components/Metric'
import { RangeTabs } from '@/features/catalyst/components/RangeTabs'
import { SALES_CHANNELS } from '@/features/catalyst/constants'

export function TotalSalesCard(): JSX.Element {
  return (
    <Card>
      <CardHead title="Total Sales" action="Report" />
      <Metric value="$128.32" positive badge="+2%" />
      <RangeTabs />
      <LineChart />
      <div className="mt-3 flex flex-col gap-2.5">
        {SALES_CHANNELS.map(c => (
          <div key={c.name} className="flex items-center gap-2.5 text-[13px]">
            <c.icon size={16} className="text-[var(--cat-ink-2)]" />
            <span className="font-medium text-[var(--cat-ink)]">{c.name}</span>
            <span className="ml-auto font-semibold text-[var(--cat-ink)]">{c.amount}</span>
            <span className="w-[52px] text-right">
              <Delta positive={c.positive}>{c.change}</Delta>
            </span>
          </div>
        ))}
      </div>
    </Card>
  )
}
