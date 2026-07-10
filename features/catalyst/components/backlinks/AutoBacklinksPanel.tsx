'use client'

import { Loader2, Plus } from 'lucide-react'

import { AUTO_SITES } from '@/features/catalyst/backlinks-data'
import { AutoCategoryList } from '@/features/catalyst/components/backlinks/AutoCategoryList'
import { BacklinksMessage } from '@/features/catalyst/components/backlinks/BacklinksMessage'
import { useActiveRunSlug } from '@/features/catalyst/components/backlinks/hooks/useActiveRunSlug'
import {
  useAutoBacklinks,
  useAutoPublishAll,
  useBacklinkSchedule,
  useToggleSchedule,
} from '@/features/catalyst/components/backlinks/hooks/useAutoBacklinks'
import { ScheduleToggle } from '@/features/catalyst/components/backlinks/ScheduleToggle'
import { DashStatRow, type DashStatData } from '@/features/catalyst/components/dash/DashStat'
import { PrimaryButton } from '@/features/catalyst/components/PrimaryButton'
import type { AutoBacklink } from '@/lib/api/backlinks'

export function AutoBacklinksPanel(): JSX.Element {
  const { slug, isLoading: slugLoading, isError: slugError } = useActiveRunSlug()
  const auto = useAutoBacklinks(slug)
  const schedule = useBacklinkSchedule(slug)
  const toggleSchedule = useToggleSchedule(slug)
  const publishAll = useAutoPublishAll(slug)

  const rows = auto.data?.rows ?? []
  const canAdd = auto.data?.canAddToday ?? false
  const scheduleOn = schedule.data?.is_active ?? false
  const loading = slugLoading || (Boolean(slug) && auto.isLoading)
  const error = slugError || auto.isError

  const onToggle = (): void => {
    if (slug) toggleSchedule.mutate(!scheduleOn)
  }

  return (
    <div>
      <div className="mb-5">
        <DashStatRow stats={buildStats(rows, scheduleOn)} />
      </div>
      <AutoToolbar
        slug={slug}
        publishAll={publishAll}
        scheduleOn={scheduleOn}
        onToggle={onToggle}
      />
      <PublishStatus mutation={publishAll} canAdd={canAdd} hasSlug={Boolean(slug)} />
      <AutoBody loading={loading} error={error} hasSlug={Boolean(slug)} rows={rows} />
    </div>
  )
}

interface AutoToolbarProps {
  slug: string | null
  publishAll: ReturnType<typeof useAutoPublishAll>
  scheduleOn: boolean
  onToggle: () => void
}

/** Right-aligned toolbar: the "Add" (publish-all) CTA and the daily-schedule toggle. */
function AutoToolbar({ slug, publishAll, scheduleOn, onToggle }: AutoToolbarProps): JSX.Element {
  // Only hard-block on a missing run (nothing to attach backlinks to) or an
  // in-flight publish. The once-per-day cap is enforced server-side (429) and
  // shown via PublishStatus, so we don't silently disable for it here.
  const disabled = !slug || publishAll.isPending
  return (
    <div className="mb-4 flex flex-wrap items-center justify-end gap-3">
      <PrimaryButton
        icon={publishAll.isPending ? Loader2 : Plus}
        disabled={disabled}
        onClick={() => publishAll.mutate()}
        title={!slug ? 'Run an analysis for this brand first' : undefined}
      >
        {publishAll.isPending ? 'Publishing…' : 'Add'}
      </PrimaryButton>
      <ScheduleToggle enabled={scheduleOn} onToggle={onToggle} />
    </div>
  )
}

interface PublishStatusProps {
  mutation: ReturnType<typeof useAutoPublishAll>
  canAdd: boolean
  hasSlug: boolean
}

/** Inline feedback for the Add action (no toast library in this app). */
function PublishStatus({ mutation, canAdd, hasSlug }: PublishStatusProps): JSX.Element | null {
  if (mutation.isPending) {
    return (
      <p className="mb-3 text-right text-[12px] text-neutral-500">
        Generating and publishing five blogs… this can take a minute or two.
      </p>
    )
  }
  if (mutation.isError) {
    return (
      <p className="mb-3 text-right text-[12px] text-red-600">
        {mutation.error.message || 'Could not publish backlinks. Please try again.'}
      </p>
    )
  }
  if (mutation.isSuccess) {
    const n = mutation.data.created.length
    return (
      <p className="mb-3 text-right text-[12px] text-emerald-600">
        Published {n} new backlink{n === 1 ? '' : 's'} across the satellite sites.
      </p>
    )
  }
  if (hasSlug && !canAdd) {
    return (
      <p className="mb-3 text-right text-[12px] text-neutral-500">
        You’ve already added today’s backlinks — the next batch can be added tomorrow.
      </p>
    )
  }
  return null
}

interface AutoBodyProps {
  loading: boolean
  error: boolean
  hasSlug: boolean
  rows: AutoBacklink[]
}

function AutoBody({ loading, error, hasSlug, rows }: AutoBodyProps): JSX.Element {
  if (loading) return <BacklinksMessage title="Loading your auto-backlinks…" />
  if (error) {
    return (
      <BacklinksMessage
        title="Couldn’t load auto-backlinks"
        detail="Please refresh — if it keeps failing, the analysis backend may be unreachable."
      />
    )
  }
  if (!hasSlug) {
    return (
      <BacklinksMessage
        title="No analysis run yet"
        detail="Run an analysis for this brand to start publishing auto-backlinks."
      />
    )
  }
  return <AutoCategoryList rows={rows} />
}

function buildStats(rows: AutoBacklink[], scheduleOn: boolean): DashStatData[] {
  const liveCount = rows.filter(r => Boolean(r.url)).length
  return [
    { label: 'Blogs published', value: String(rows.length) },
    { label: 'Live backlinks', value: String(liveCount) },
    { label: 'Categories', value: String(AUTO_SITES.length) },
    { label: 'Daily auto-run', value: scheduleOn ? 'On' : 'Off' },
  ]
}
