'use client'

import { TransitionLink } from '@/components/TransitionLink'
import { Card } from '@/features/catalyst/components/Card'
import { CardHead } from '@/features/catalyst/components/CardHead'
import { useBrandPath } from '@/hooks/useBrandPath'
import { useGaData } from '@/hooks/useGaData'
import { BarChart3, Loader2 } from '@/lib/icons'

function Tile({ label, value }: { label: string; value: string }): JSX.Element {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[11px] text-[var(--cat-ink-3)]">{label}</span>
      <span className="text-[20px] font-bold tracking-tight text-[var(--cat-ink)] tabular-nums">
        {value}
      </span>
    </div>
  )
}

function duration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.round(seconds % 60)
  return m > 0 ? `${m}m ${s}s` : `${s}s`
}

function SnapshotFallback(): JSX.Element {
  const brandPath = useBrandPath()
  const { isLoading, syncing } = useGaData()
  if (isLoading || syncing) {
    return (
      <p className="flex items-center gap-1.5 text-[12px] leading-relaxed text-[var(--cat-ink-3)]">
        <Loader2 size={12} className="animate-spin" />
        {syncing
          ? 'First GA4 sync in progress — data lands in a minute or two.'
          : 'Loading traffic data…'}
      </p>
    )
  }
  return (
    <div className="flex flex-col items-start gap-2">
      <p className="text-[12px] leading-relaxed text-[var(--cat-ink-3)]">
        Connect Google Analytics to put your AI visibility next to real traffic.
      </p>
      <TransitionLink
        href={brandPath('integrations')}
        className="inline-flex items-center gap-1.5 rounded-md border border-[var(--cat-border)] px-3 py-1.5 text-[12px] font-medium text-[var(--cat-ink)] transition-colors hover:bg-[var(--cat-hover)]"
      >
        <BarChart3 size={13} />
        Connect GA4
      </TransitionLink>
    </div>
  )
}

/** Traffic context from GA4 — or the connect/syncing state when absent. */
export function GaSnapshotCard(): JSX.Element {
  const { data, syncing } = useGaData()

  return (
    <Card>
      <CardHead title="Site traffic · GA4" />
      {data && !syncing ? (
        <div className="grid grid-cols-3 gap-3">
          <Tile label="Sessions" value={data.sessions.toLocaleString()} />
          <Tile label="Organic" value={data.organic_sessions.toLocaleString()} />
          <Tile label="Avg session" value={duration(data.avg_session_duration)} />
        </div>
      ) : (
        <SnapshotFallback />
      )}
    </Card>
  )
}
