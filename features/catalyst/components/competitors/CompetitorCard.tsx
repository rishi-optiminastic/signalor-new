import { MoreVertical, Plus } from 'lucide-react'

import type { Competitor, Relation } from '@/features/catalyst/competitors-data'
import { RelationPill } from '@/features/catalyst/components/competitors/RelationPill'
import { GaugeRing } from '@/features/catalyst/components/visibility/GaugeRing'
import { BRAND, BRAND_SOFT } from '@/features/catalyst/constants'
import { scoreColor, scoreStatus } from '@/features/catalyst/visibility-data'

function Identity({ competitor }: { competitor: Competitor }): JSX.Element {
  const { name, initial, color, domain } = competitor
  return (
    <div className="flex min-w-0 items-center gap-3">
      <span
        className="grid h-10 w-10 shrink-0 place-items-center rounded-md text-[15px] font-bold text-white"
        style={{ background: color }}
      >
        {initial}
      </span>
      <div className="min-w-0">
        <div className="truncate text-[14px] font-semibold text-[var(--cat-ink)]">{name}</div>
        <a
          href={`https://${domain}`}
          target="_blank"
          rel="noreferrer"
          className="truncate text-[13px] font-medium hover:underline"
          style={{ color: BRAND }}
        >
          {domain}
        </a>
      </div>
    </div>
  )
}

function Footer({ relation }: { relation: Relation }): JSX.Element {
  return (
    <div className="mt-4 flex items-center justify-between gap-2 border-t border-[var(--cat-border-soft)] pt-3">
      <RelationPill relation={relation} />
      <button className="inline-flex items-center gap-1 rounded-md border border-dashed border-[var(--cat-border)] px-2.5 py-1 text-[12px] text-[var(--cat-ink-3)] transition-colors hover:bg-[var(--cat-hover)]">
        <Plus size={12} /> Add tags
      </button>
    </div>
  )
}

export function CompetitorCard({ competitor }: { competitor: Competitor }): JSX.Element {
  const { score, relation } = competitor
  const sc = scoreColor(score)
  const surface =
    relation === 'mine'
      ? { background: BRAND_SOFT, borderColor: 'rgba(224,74,61,.25)' }
      : { background: 'var(--cat-card)', borderColor: 'var(--cat-border)' }

  return (
    <div
      className="flex flex-col rounded-md border p-4 transition-shadow hover:shadow-[0_2px_12px_rgba(16,24,40,.07)]"
      style={surface}
    >
      <div className="flex items-start justify-between">
        <Identity competitor={competitor} />
        <button className="text-[var(--cat-ink-3)] transition-colors hover:text-[var(--cat-ink)]">
          <MoreVertical size={16} />
        </button>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <GaugeRing value={score} size={54} stroke={6} color={sc}>
          <span className="text-[15px] font-bold text-[var(--cat-ink)]">{score}</span>
        </GaugeRing>
        <div>
          <div className="text-[11px] font-semibold tracking-wide text-[var(--cat-ink-3)] uppercase">
            AI Score
          </div>
          <div className="text-[13px] font-semibold" style={{ color: sc }}>
            {scoreStatus(score)}
          </div>
        </div>
      </div>
      <Footer relation={relation} />
    </div>
  )
}
