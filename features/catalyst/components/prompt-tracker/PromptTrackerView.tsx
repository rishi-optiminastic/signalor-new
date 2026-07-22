'use client'

import { Loader2, Plus } from 'lucide-react'
import { useMemo, useState } from 'react'

import { DataState } from '@/features/catalyst/components/DataState'
import { PrimaryButton } from '@/features/catalyst/components/PrimaryButton'
import { CitationTrendCard } from '@/features/catalyst/components/prompt-tracker/CitationTrendCard'
import { FaqBuilderCard } from '@/features/catalyst/components/prompt-tracker/FaqBuilderCard'
import { NewPromptForm } from '@/features/catalyst/components/prompt-tracker/NewPromptForm'
import {
  ALL_DATES,
  matchesDateFilter,
  PromptDateFilter,
  type DateFilter,
} from '@/features/catalyst/components/prompt-tracker/PromptDateFilter'
import { PromptRow } from '@/features/catalyst/components/prompt-tracker/PromptRow'
import { PromptToolbar } from '@/features/catalyst/components/prompt-tracker/PromptToolbar'
import { TaskStatCard } from '@/features/catalyst/components/tasks/TaskStatCard'
import type { TrackedPrompt } from '@/features/catalyst/prompt-tracker-data'
import type { StatCard } from '@/features/catalyst/tasks-data'
import { useActiveProject } from '@/hooks/useActiveProject'
import { usePromptMutations } from '@/hooks/usePromptMutations'
import { buildPromptStats, usePrompts } from '@/hooks/usePrompts'

/** Most recent engine-check timestamp across a prompt's results (0 if none yet). */
function latestCheck(prompt: TrackedPrompt): number {
  return prompt.results.reduce((max, r) => {
    const t = r.checkedAt ? new Date(r.checkedAt).getTime() : 0
    return t > max ? t : max
  }, 0)
}

/** Keep prompts whose latest check passes the date filter (plus not-yet-checked ones). */
function filterByDate(prompts: TrackedPrompt[], filter: DateFilter): TrackedPrompt[] {
  return prompts.filter(p => {
    const latest = latestCheck(p)
    return latest === 0 || matchesDateFilter(latest, filter)
  })
}

interface HeaderProps {
  onNewPrompt: () => void
  filter: DateFilter
  onFilterChange: (filter: DateFilter) => void
}

function TrackerHeader({ onNewPrompt, filter, onFilterChange }: HeaderProps): JSX.Element {
  return (
    // relative z-40 keeps the date filter's popover above the stat cards below,
    // which sit in their own transformed (cat-stagger) stacking context.
    <div className="cat-rise relative z-40 mb-4 flex flex-wrap items-center gap-3">
      <div className="min-w-0">
        <h1 className="text-[19px] font-bold tracking-tight text-[var(--cat-ink)]">
          Prompt Tracker
        </h1>
        <p className="text-[13px] text-[var(--cat-ink-2)]">
          Watch how AI engines answer the prompts that matter to your category
        </p>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <PromptDateFilter filter={filter} onChange={onFilterChange} />
        <PrimaryButton icon={Plus} onClick={onNewPrompt}>
          New prompt
        </PrimaryButton>
      </div>
    </div>
  )
}

function StatGrid({ stats }: { stats: StatCard[] }): JSX.Element {
  return (
    <div className="cat-stagger mb-3 grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-6">
      {stats.map(stat => (
        <TaskStatCard key={stat.label} stat={stat} />
      ))}
    </div>
  )
}

interface ListProps {
  prompts: TrackedPrompt[]
  slug: string
  busyId: number | null
  onRecheck: (trackId: number) => void
  onRemove: (trackId: number) => void
}

function PromptList({ prompts, slug, busyId, onRecheck, onRemove }: ListProps): JSX.Element {
  if (prompts.length === 0) {
    return (
      <p className="cat-rise rounded-md border border-[var(--cat-border)] bg-[var(--cat-card)] px-4 py-6 text-center text-[13px] text-[var(--cat-ink-2)]">
        No prompts checked in this date range. Widen the range to see more.
      </p>
    )
  }
  return (
    <div className="cat-rise divide-y divide-[var(--cat-border)] overflow-hidden rounded-md border border-[var(--cat-border)] bg-[var(--cat-card)]">
      {prompts.map(p => (
        <PromptRow
          key={p.id}
          item={p}
          slug={slug}
          busy={busyId === p.id}
          onRecheck={onRecheck}
          onRemove={onRemove}
        />
      ))}
    </div>
  )
}

interface BodyProps extends ListProps {
  allCount: number
  stats: StatCard[]
}

function PromptBody({
  prompts,
  allCount,
  stats,
  slug,
  busyId,
  onRecheck,
  onRemove,
}: BodyProps): JSX.Element {
  const hasPending = prompts.some(p => p.results.length === 0)
  return (
    <>
      <PromptToolbar shown={prompts.length} total={allCount} />
      <StatGrid stats={stats} />
      <CitationTrendCard slug={slug} />
      {/* <PromptInsights prompts={prompts} /> */}
      {hasPending && (
        <p className="mb-2 flex items-center gap-1.5 text-[11px] text-[var(--cat-ink-3)]">
          <Loader2 size={12} className="animate-spin" />
          Some prompts are still being answered. This list refreshes automatically.
        </p>
      )}
      <PromptList
        prompts={prompts}
        slug={slug}
        busyId={busyId}
        onRecheck={onRecheck}
        onRemove={onRemove}
      />
      {slug && allCount > 0 && <FaqBuilderCard slug={slug} />}
    </>
  )
}

export function PromptTrackerView(): JSX.Element {
  const { slug, isLoading: projectLoading } = useActiveProject()
  const { data, isLoading, isError } = usePrompts(slug)
  const { add, recheck, remove, isAdding, busyId } = usePromptMutations(slug)
  const [composing, setComposing] = useState(false)
  const [filter, setFilter] = useState<DateFilter>(ALL_DATES)

  const filtered = useMemo(() => filterByDate(data?.prompts ?? [], filter), [data, filter])
  const stats = useMemo(() => buildPromptStats(filtered), [filtered])

  return (
    <div className="w-full">
      <TrackerHeader
        onNewPrompt={() => setComposing(c => !c)}
        filter={filter}
        onFilterChange={setFilter}
      />
      {composing && (
        <NewPromptForm isAdding={isAdding} onSubmit={add} onClose={() => setComposing(false)} />
      )}
      <DataState
        isLoading={projectLoading || isLoading}
        isError={isError}
        isEmpty={!slug || !data || data.prompts.length === 0}
        emptyTitle="No prompts tracked yet"
        emptyHint="Track a prompt to see how ChatGPT, Gemini, Perplexity and the rest answer it."
      >
        {data && (
          <PromptBody
            prompts={filtered}
            allCount={data.prompts.length}
            stats={stats}
            slug={slug ?? ''}
            busyId={busyId}
            onRecheck={recheck}
            onRemove={remove}
          />
        )}
      </DataState>
    </div>
  )
}
