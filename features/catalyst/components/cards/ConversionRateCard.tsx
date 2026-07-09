'use client'

import { AreaChart } from '@/features/catalyst/components/AreaChart'
import { Card } from '@/features/catalyst/components/Card'
import { CardHead } from '@/features/catalyst/components/CardHead'
import { Delta } from '@/features/catalyst/components/Delta'
import { Metric } from '@/features/catalyst/components/Metric'
import { useActiveProject } from '@/hooks/useActiveProject'
import { useOverview } from '@/hooks/useOverview'

interface FunnelRow {
  name: string
  num: number
  pct: number
}

interface FunnelInput {
  mentionPct: number
  recPct: number
  citePct: number
  mentioned: number
  recommended: number
  cited: number
}

function buildFunnel(i: FunnelInput): FunnelRow[] {
  return [
    { name: 'Mentioned', num: i.mentioned, pct: i.mentionPct },
    { name: 'Recommended', num: i.recommended, pct: i.recPct },
    { name: 'Cited', num: i.cited, pct: i.citePct },
  ]
}

export function ConversionRateCard(): JSX.Element {
  const { slug } = useActiveProject()
  const { data } = useOverview(slug)

  const funnel = data
    ? buildFunnel({
        mentionPct: data.mentionPct,
        recPct: data.recommendationPct,
        citePct: data.citationPct,
        mentioned: data.mentioned,
        recommended: data.recommended,
        cited: data.cited,
      })
    : []

  return (
    <Card>
      <CardHead title="Recommendation Rate" action="Details" />
      <Metric
        value={data ? `${data.recommendationPct}%` : '—'}
        positive={data?.positive ?? true}
        badge={data ? `${data.citationPct}% cited` : '—'}
      />
      <div className="my-2.5 flex flex-col gap-2">
        {funnel.map(row => (
          <div key={row.name} className="flex items-center text-[13px]">
            <span className="text-[var(--cat-ink-2)]">{row.name}</span>
            <span className="mr-3 ml-auto font-semibold text-[var(--cat-ink)]">{row.num}</span>
            <Delta positive={row.num > 0}>{row.pct}%</Delta>
          </div>
        ))}
      </div>
      <AreaChart data={data?.seriesPoints ?? []} />
      <div className="mt-1.5 text-[10px] text-[var(--cat-ink-3)]">
        Visibility score trend across analyses
      </div>
    </Card>
  )
}
