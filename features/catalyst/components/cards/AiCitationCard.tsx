'use client'

import { TickBar } from '@/features/catalyst/components/brands/BrandBits'
import { Card } from '@/features/catalyst/components/Card'
import { CardHead } from '@/features/catalyst/components/CardHead'
import { Metric } from '@/features/catalyst/components/Metric'
import { useActiveProject } from '@/hooks/useActiveProject'
import { useBrandPath } from '@/hooks/useBrandPath'
import { useCitations } from '@/hooks/useCitations'
import { useOverview } from '@/hooks/useOverview'

interface SourceRow {
  label: string
  count: number
  pct: number
}

/** Split total citations into brand / competitor / other, as share-of-citations. */
function buildSources(brand: number, competitor: number, other: number): SourceRow[] {
  const total = brand + competitor + other
  const pct = (n: number): number => (total > 0 ? Math.round((n / total) * 100) : 0)
  return [
    { label: 'Your brand', count: brand, pct: pct(brand) },
    { label: 'Competitors', count: competitor, pct: pct(competitor) },
    { label: 'Other', count: other, pct: pct(other) },
  ]
}

function SourceMeterRow({ row }: { row: SourceRow }): JSX.Element {
  return (
    <div className="flex items-center gap-2.5 py-[7px]">
      <span className="w-[86px] shrink-0 truncate text-[13px] font-medium text-[var(--cat-ink)]">
        {row.label}
      </span>
      <span className="min-w-0 flex-1">
        <TickBar value={row.pct} ticks={16} showValue={false} />
      </span>
      <span className="w-14 shrink-0 text-right text-[13px] text-[var(--cat-ink-2)] tabular-nums">
        {row.count.toLocaleString('en-US')}
      </span>
    </div>
  )
}

export function AiCitationCard(): JSX.Element {
  const { slug } = useActiveProject()
  const brandPath = useBrandPath()
  const overview = useOverview(slug).data
  const citations = useCitations(slug).data

  const sources = citations
    ? buildSources(citations.brand, citations.competitor, citations.other)
    : []

  return (
    <Card>
      <CardHead title="Citation Coverage" action="Details" href={brandPath('visibility')} />
      <Metric
        value={overview ? `${overview.citationPct}%` : '—'}
        positive={(overview?.cited ?? 0) > 0}
        badge={overview ? `${overview.cited} of ${overview.total} answers` : '—'}
      />
      <p className="mt-1 text-[12px] text-[var(--cat-ink-3)]">
        Share of AI answers that cite your brand.
      </p>
      <div className="mt-3.5 border-t border-[var(--cat-border)] pt-3">
        <p className="mb-1 text-[11px] font-semibold tracking-wide text-[var(--cat-ink-3)] uppercase">
          Citation sources
        </p>
        {sources.length > 0 ? (
          sources.map(row => <SourceMeterRow key={row.label} row={row} />)
        ) : (
          <p className="py-4 text-center text-[12px] text-[var(--cat-ink-3)]">No citations yet.</p>
        )}
      </div>
    </Card>
  )
}
