'use client'

import { Card } from '@/features/catalyst/components/Card'
import { CardHead } from '@/features/catalyst/components/CardHead'
import { ChannelLegend, type ChannelSegment } from '@/features/catalyst/components/ChannelLegend'
import { ChannelTable, type ChannelTableRow } from '@/features/catalyst/components/ChannelTable'
import { Metric } from '@/features/catalyst/components/Metric'
import { useActiveProject } from '@/hooks/useActiveProject'
import { useOverview } from '@/hooks/useOverview'

export function VisitorsChannelsCard(): JSX.Element {
  const { slug } = useActiveProject()
  const { data } = useOverview(slug)

  const segments: ChannelSegment[] = (data?.engines ?? [])
    .slice(0, 3)
    .map(e => ({ label: e.name, color: e.color, weight: e.sovPct }))

  const rows: ChannelTableRow[] = (data?.engines ?? []).map(e => ({
    name: e.name,
    color: e.color,
    percent: `${e.sovPct}%`,
    total: String(e.mentioned),
  }))

  return (
    <Card>
      <CardHead title="Share of Voice" action="Details" />
      <Metric
        value={data ? `${data.avgSov}%` : '—'}
        positive={data?.positive ?? true}
        badge={data ? `${data.mentionPct}%` : '—'}
      />
      <ChannelLegend segments={segments} />
      <ChannelTable rows={rows} />
      <button className="mt-3 h-[38px] w-full rounded-md border border-[var(--cat-border)] text-[13px] font-semibold text-[var(--cat-ink)] transition-colors hover:bg-[var(--cat-hover)]">
        View reports
      </button>
    </Card>
  )
}
