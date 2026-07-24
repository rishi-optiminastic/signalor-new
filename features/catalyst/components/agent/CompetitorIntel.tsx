'use client'

import { AgentSectionPanel } from '@/features/catalyst/components/agent/AgentSectionPanel'
import { useAgentCompetitors } from '@/hooks/useAgentCompetitors'
import type { Competitor } from '@/lib/api/analyzer'
import { Eye } from '@/lib/icons'

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

function CompetitorRow({ competitor }: { competitor: Competitor }): JSX.Element {
  const score = Math.round(competitor.composite_score ?? competitor.relevance_score ?? 0)
  return (
    <div className="flex items-center gap-3 px-4 py-2.5">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-[var(--cat-hover)] text-[12px] font-bold text-[var(--cat-ink-2)] uppercase">
        {(competitor.name[0] ?? '?').toUpperCase()}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-medium text-[var(--cat-ink)]">{competitor.name}</p>
        <p className="truncate text-[11px] text-[var(--cat-ink-3)]">
          {competitor.positioning || hostOf(competitor.url)}
        </p>
      </div>
      {competitor.tier && (
        <span className="hidden shrink-0 rounded-sm bg-[var(--cat-hover)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--cat-ink-3)] md:inline">
          {competitor.tier}
        </span>
      )}
      {competitor.scored && (
        <span className="w-10 shrink-0 text-right text-[13px] font-semibold text-[var(--cat-ink)] tabular-nums">
          {score}
        </span>
      )}
    </div>
  )
}

export function CompetitorIntel(): JSX.Element | null {
  const { competitors, isLoading, hasData } = useAgentCompetitors()
  if (isLoading || !hasData) return null

  return (
    <AgentSectionPanel icon={Eye} title="Competitor intel" count={competitors.length}>
      <div className="divide-y divide-[var(--cat-border-soft)]">
        {competitors.map(c => (
          <CompetitorRow key={c.id} competitor={c} />
        ))}
      </div>
    </AgentSectionPanel>
  )
}
