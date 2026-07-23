'use client'

import { TickBar } from '@/features/catalyst/components/brands/BrandBits'
import { Card } from '@/features/catalyst/components/Card'
import { CardHead } from '@/features/catalyst/components/CardHead'
import { EngineLogo } from '@/features/catalyst/components/EngineLogo'
import { Metric } from '@/features/catalyst/components/Metric'
import { useActiveProject } from '@/hooks/useActiveProject'
import { useBrandPath } from '@/hooks/useBrandPath'
import { useOverview, type OverviewEngine } from '@/hooks/useOverview'

/** One engine's share of voice: logo, name, a segmented meter, and the share. */
function SovRow({ engine }: { engine: OverviewEngine }): JSX.Element {
  return (
    <div className="flex items-center gap-2.5 py-[7px]">
      <EngineLogo name={engine.name} size={18} color={engine.color} />
      <span className="w-[82px] shrink-0 truncate text-[13px] font-medium text-[var(--cat-ink)]">
        {engine.name}
      </span>
      <span className="min-w-0 flex-1">
        <TickBar value={engine.sovPct} ticks={16} showValue={false} />
      </span>
      <span className="w-9 shrink-0 text-right text-[13px] font-semibold text-[var(--cat-ink)] tabular-nums">
        {engine.sovPct}%
      </span>
    </div>
  )
}

export function VisitorsChannelsCard(): JSX.Element {
  const { slug } = useActiveProject()
  const brandPath = useBrandPath()
  const { data } = useOverview(slug)
  const engines = data?.engines ?? []

  return (
    <Card className="h-full">
      <CardHead title="Share of Voice" action="Details" href={brandPath('competitors')} />
      <Metric
        value={data ? `${data.avgSov}%` : '—'}
        positive={data?.positive ?? true}
        badge={data ? `${data.mentionPct}% mention rate` : '—'}
      />
      {/* Scrollable so a long engine list never makes this card taller than the
          chart cards beside it — all three align to one row height. */}
      <div className="mt-3 min-h-0 flex-1 overflow-y-auto">
        {engines.length > 0 ? (
          engines.map(engine => <SovRow key={engine.key} engine={engine} />)
        ) : (
          <p className="py-6 text-center text-[12px] text-[var(--cat-ink-3)]">
            No share-of-voice data yet.
          </p>
        )}
      </div>
    </Card>
  )
}
