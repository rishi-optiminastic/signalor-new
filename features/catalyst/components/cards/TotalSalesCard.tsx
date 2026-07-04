import { Compass, MessageSquare, Sparkles } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { Card } from '@/features/catalyst/components/Card'
import { CardHead } from '@/features/catalyst/components/CardHead'
import { Delta } from '@/features/catalyst/components/Delta'
import { LineChart } from '@/features/catalyst/components/LineChart'
import { Metric } from '@/features/catalyst/components/Metric'
import { RangeTabs } from '@/features/catalyst/components/RangeTabs'

interface EngineRow {
  icon: LucideIcon
  name: string
  score: string
  change: string
  positive: boolean
}

const ENGINES: EngineRow[] = [
  { icon: MessageSquare, name: 'ChatGPT', score: '82%', change: '+4.5%', positive: true },
  { icon: Compass, name: 'Perplexity', score: '61%', change: '-2.8%', positive: false },
  { icon: Sparkles, name: 'Gemini', score: '48%', change: '+3.2%', positive: true },
]

export function TotalSalesCard(): JSX.Element {
  return (
    <Card>
      <CardHead title="AI Visibility" action="Report" />
      <Metric value="74%" positive badge="+5.2%" />
      <RangeTabs />
      <LineChart />
      <div className="mt-3 flex flex-col gap-2.5">
        {ENGINES.map(c => (
          <div key={c.name} className="flex items-center gap-2.5 text-[13px]">
            <c.icon size={16} className="text-[var(--cat-ink-2)]" />
            <span className="font-medium text-[var(--cat-ink)]">{c.name}</span>
            <span className="ml-auto font-semibold text-[var(--cat-ink)]">{c.score}</span>
            <span className="w-[52px] text-right">
              <Delta positive={c.positive}>{c.change}</Delta>
            </span>
          </div>
        ))}
      </div>
    </Card>
  )
}
