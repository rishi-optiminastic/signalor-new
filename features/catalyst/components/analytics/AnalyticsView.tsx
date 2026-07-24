'use client'

import Link from 'next/link'

import { GaCountryList } from '@/features/catalyst/components/analytics/GaCountryList'
import { DashHeader } from '@/features/catalyst/components/dash/DashStat'
import { DashStatRow, type DashStatData } from '@/features/catalyst/components/dash/DashStat'
import { useBrandPath } from '@/hooks/useBrandPath'
import { useGaData } from '@/hooks/useGaData'
import { useIntegrations } from '@/hooks/useIntegrations'
import type { GAData } from '@/lib/api/integrations'
import { BarChart3, Loader2, Settings2 } from '@/lib/icons'

const GA_PROPERTY_HREF = '/settings/integrations/google-analytics/property'

function Centered({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-[var(--cat-border)] bg-[var(--cat-card)] text-center">
      {children}
    </div>
  )
}

function Cta({ href, label }: { href: string; label: string }): JSX.Element {
  return (
    <Link
      href={href}
      className="mt-1 inline-flex h-9 items-center rounded-md px-4 text-[13px] font-semibold text-white"
      style={{ background: '#e04a3d' }}
    >
      {label}
    </Link>
  )
}

function ConnectGa4(): JSX.Element {
  const brandPath = useBrandPath()
  return (
    <Centered>
      <span className="grid h-11 w-11 place-items-center rounded-md bg-[rgba(224,74,61,0.1)] text-[#e04a3d]">
        <BarChart3 size={20} />
      </span>
      <div>
        <p className="text-[14px] font-semibold text-[var(--cat-ink)]">Connect Google Analytics</p>
        <p className="mt-1 max-w-sm text-[12px] text-[var(--cat-ink-3)]">
          Link GA4 to see how much traffic AI engines send you and where it lands.
        </p>
      </div>
      <Cta href={brandPath('integrations')} label="Connect analytics" />
    </Centered>
  )
}

/** Connected, synced, but the selected property has zero traffic — say so plainly
 *  rather than implying GA isn't connected (the old copy sent users in circles). */
function EmptyProperty(): JSX.Element {
  return (
    <Centered>
      <span className="grid h-11 w-11 place-items-center rounded-md bg-[var(--cat-hover)] text-[var(--cat-ink-3)]">
        <Settings2 size={20} />
      </span>
      <div>
        <p className="text-[14px] font-semibold text-[var(--cat-ink)]">
          No traffic on this GA4 property
        </p>
        <p className="mt-1 max-w-sm text-[12px] text-[var(--cat-ink-3)]">
          Google Analytics is connected, but the selected property has no sessions in the last 30
          days. Pick a different property to see data here.
        </p>
      </div>
      <Cta href={GA_PROPERTY_HREF} label="Change property" />
    </Centered>
  )
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.round(seconds % 60)
  return m > 0 ? `${m}m ${s}s` : `${s}s`
}

function toStats(data: GAData): DashStatData[] {
  const organicPct =
    data.sessions > 0 ? Math.round((data.organic_sessions / data.sessions) * 100) : 0
  return [
    { label: 'Sessions (30d)', value: data.sessions.toLocaleString() },
    { label: 'Organic', value: `${organicPct}%` },
    { label: 'Bounce rate', value: `${Math.round(data.bounce_rate * 100)}%` },
    { label: 'Avg. duration', value: formatDuration(data.avg_session_duration) },
  ]
}

function AnalyticsData({ data }: { data: GAData }): JSX.Element {
  return (
    <div className="space-y-4">
      <DashStatRow stats={toStats(data)} />
      {data.countries.length > 0 && (
        <div className="rounded-lg border border-[var(--cat-border)] bg-[var(--cat-card)] p-4">
          <p className="mb-2 text-[11px] font-semibold tracking-wide text-[var(--cat-ink-3)] uppercase">
            Sessions by country
          </p>
          <GaCountryList countries={data.countries} />
        </div>
      )}
    </div>
  )
}

function AnalyticsBody(): JSX.Element {
  const { connected, isLoading: statusLoading } = useIntegrations()
  const { data, isLoading: dataLoading, isEmpty } = useGaData()
  const gaConnected = connected.has('google-analytics')

  if (statusLoading || (gaConnected && dataLoading)) {
    return (
      <Centered>
        <Loader2 className="h-5 w-5 animate-spin text-[var(--cat-ink-3)]" />
      </Centered>
    )
  }
  if (!gaConnected) return <ConnectGa4 />
  if (!data || isEmpty) return <EmptyProperty />
  return <AnalyticsData data={data} />
}

export function AnalyticsView(): JSX.Element {
  return (
    <div className="w-full">
      <DashHeader
        title="Analytics"
        subtitle="How much traffic AI engines send you, and where it lands."
      />
      <AnalyticsBody />
    </div>
  )
}
