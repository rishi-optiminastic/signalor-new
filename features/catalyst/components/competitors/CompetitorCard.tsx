'use client'

import { TransitionLink } from '@/components/TransitionLink'
import type { Competitor, Relation } from '@/features/catalyst/competitors-data'
import { BrandFavicon } from '@/features/catalyst/components/competitors/BrandFavicon'
import { RelationPill } from '@/features/catalyst/components/competitors/RelationPill'
import { GaugeRing } from '@/features/catalyst/components/visibility/GaugeRing'
import { BRAND, BRAND_SOFT } from '@/features/catalyst/constants'
import { scoreColor, scoreStatus } from '@/features/catalyst/visibility-data'
import { useBrandPath } from '@/hooks/useBrandPath'
import { ChevronRight, Plus } from '@/lib/icons'

function Identity({ competitor }: { competitor: Competitor }): JSX.Element {
  const { id, name, initial, color, domain, relation } = competitor
  const brandPath = useBrandPath()
  const href = relation === 'mine' ? brandPath('pillars') : brandPath(`competitors/${id}`)
  return (
    <div className="flex min-w-0 items-center gap-3">
      <BrandFavicon domain={domain} name={initial} color={color} />
      <div className="min-w-0">
        <TransitionLink
          href={href}
          className="block truncate text-[14px] font-semibold text-[var(--cat-ink)] after:absolute after:inset-0"
        >
          {name}
        </TransitionLink>
        <a
          href={`https://${domain}`}
          target="_blank"
          rel="noreferrer"
          className="relative truncate text-[13px] font-medium hover:underline"
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
    <div className="relative mt-4 flex items-center justify-between gap-2 border-t border-[var(--cat-border-soft)] pt-3">
      <RelationPill relation={relation} />
      <button className="inline-flex items-center gap-1 rounded-md border border-dashed border-[var(--cat-border)] px-2.5 py-1 text-[12px] text-[var(--cat-ink-3)] transition-colors hover:bg-[var(--cat-hover)]">
        <Plus size={12} /> Add tags
      </button>
    </div>
  )
}

function ScoreBlock({ score }: { score: number }): JSX.Element {
  const sc = scoreColor(score)
  return (
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
  )
}

/** One benchmarked brand. The whole card opens its detailed analysis. */
export function CompetitorCard({ competitor }: { competitor: Competitor }): JSX.Element {
  const { score, relation, positioning } = competitor
  const surface =
    relation === 'mine'
      ? { background: BRAND_SOFT, borderColor: 'rgba(224,74,61,.25)' }
      : { background: 'var(--cat-card)', borderColor: 'var(--cat-border)' }

  return (
    <div
      className="group relative flex flex-col rounded-md border p-4 transition-shadow hover:shadow-[0_2px_12px_rgba(16,24,40,.07)]"
      style={surface}
    >
      <div className="flex items-start justify-between gap-2">
        <Identity competitor={competitor} />
        <ChevronRight
          size={16}
          className="mt-1 shrink-0 text-[var(--cat-ink-3)] transition-transform duration-200 group-hover:translate-x-0.5"
        />
      </div>
      {positioning && (
        <p className="mt-3 line-clamp-2 text-[12px] leading-relaxed text-[var(--cat-ink-3)]">
          {positioning}
        </p>
      )}
      <ScoreBlock score={score} />
      <Footer relation={relation} />
    </div>
  )
}
