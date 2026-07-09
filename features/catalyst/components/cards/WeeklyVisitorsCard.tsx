'use client'

import { Card } from '@/features/catalyst/components/Card'
import { CardHead } from '@/features/catalyst/components/CardHead'
import { Metric } from '@/features/catalyst/components/Metric'
import { Radar, type RadarSeries } from '@/features/catalyst/components/Radar'
import { BRAND } from '@/features/catalyst/constants'
import { useActiveProject } from '@/hooks/useActiveProject'
import { usePillars } from '@/hooks/usePillars'

export function WeeklyVisitorsCard(): JSX.Element {
  const { slug } = useActiveProject()
  const { data } = usePillars(slug)

  const pillars = data?.pillars ?? []
  const axes = pillars.map(p => p.label)
  const series: RadarSeries[] = [{ vals: pillars.map(p => p.score / 100), color: BRAND }]

  return (
    <Card>
      <CardHead title="GEO Pillars" action="Details" />
      <Metric
        value={data ? `${data.composite}` : '—'}
        positive
        badge={data?.strongest ? data.strongest.label : '—'}
      />
      <div className="my-1.5 inline-flex gap-1 self-start rounded-md bg-[var(--cat-track)] p-[3px]">
        <span className="inline-flex items-center gap-1.5 rounded-sm bg-[var(--cat-card)] px-2.5 py-[5px] text-xs font-semibold text-[var(--cat-ink)] shadow-sm">
          <span className="h-2 w-2 rounded-full" style={{ background: BRAND }} />
          Pillar score
        </span>
      </div>
      {axes.length > 0 ? (
        <Radar axes={axes} series={series} />
      ) : (
        <div className="grid h-[240px] place-items-center text-[12px] text-[var(--cat-ink-3)]">
          No pillar data yet
        </div>
      )}
    </Card>
  )
}
