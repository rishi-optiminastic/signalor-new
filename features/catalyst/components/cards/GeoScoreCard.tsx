'use client'

import { Info } from 'lucide-react'
import { useState } from 'react'

import { Badge } from '@/features/catalyst/components/Badge'
import { Card } from '@/features/catalyst/components/Card'
import { CardHead } from '@/features/catalyst/components/CardHead'
import { AnimatedScore } from '@/features/catalyst/components/cards/AnimatedScore'
import { Delta } from '@/features/catalyst/components/Delta'
import { LineChart } from '@/features/catalyst/components/LineChart'
import { RangeTabs, type Range } from '@/features/catalyst/components/RangeTabs'
import { GREEN, NEG } from '@/features/catalyst/constants'
import { useActiveProject } from '@/hooks/useActiveProject'
import { useBrandPath } from '@/hooks/useBrandPath'
import { scoreReason, useGeoScore } from '@/hooks/useGeoScore'

/** Colored info dot (green up / red down) that reveals the score-change reason
 *  on hover or keyboard focus. */
function ScoreReasonInfo({ reason, positive }: { reason: string; positive: boolean }): JSX.Element {
  return (
    <span className="group relative inline-flex">
      <button
        type="button"
        aria-label="Why the score changed"
        className="inline-flex cursor-help items-center"
      >
        <Info size={15} style={{ color: positive ? GREEN : NEG }} />
      </button>
      <span
        role="tooltip"
        className="pointer-events-none absolute top-full left-0 z-50 mt-1.5 w-64 rounded-md border border-[var(--cat-border)] bg-[var(--cat-card)] p-2.5 text-[11.5px] leading-relaxed text-[var(--cat-ink-2)] opacity-0 shadow-xl transition-opacity duration-150 group-focus-within:opacity-100 group-hover:opacity-100"
      >
        {reason}
      </span>
    </span>
  )
}

export function GeoScoreCard(): JSX.Element {
  const { slug } = useActiveProject()
  const brandPath = useBrandPath()
  const [range, setRange] = useState<Range>('1W')
  const { data } = useGeoScore(slug, range)

  return (
    <Card>
      <CardHead title="GEO Score" action="Details" href={brandPath('geo')} />
      <div className="flex items-center gap-2.5">
        <AnimatedScore value={data?.score} />
        <Badge positive={data?.positive ?? true}>{data ? data.delta : '—'}</Badge>
        {data && <ScoreReasonInfo reason={scoreReason(data)} positive={data.positive} />}
      </div>
      <RangeTabs value={range} onChange={setRange} />
      <LineChart data={data?.points ?? []} />
      <div className="mt-3 flex flex-col gap-2.5">
        {(data?.engines ?? []).map(engine => (
          <div key={engine.key} className="flex items-center gap-2.5 text-[13px]">
            <engine.icon size={16} className="text-[var(--cat-ink-2)]" />
            <span className="font-medium text-[var(--cat-ink)]">{engine.name}</span>
            <span className="ml-auto font-semibold text-[var(--cat-ink)]">{engine.value}</span>
            <span className="w-[64px] text-right">
              <Delta positive={engine.positive}>{engine.mentions} mentions</Delta>
            </span>
          </div>
        ))}
      </div>
    </Card>
  )
}
