'use client'

import { BarChart3, Loader2 } from 'lucide-react'
import Link from 'next/link'

import { DashHeader } from '@/features/catalyst/components/dash/DashStat'
import { useBrandPath } from '@/hooks/useBrandPath'
import { useIntegrations } from '@/hooks/useIntegrations'

function Centered({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-[var(--cat-border)] bg-[var(--cat-card)] text-center">
      {children}
    </div>
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
      <Link
        href={brandPath('integrations')}
        className="mt-1 inline-flex h-9 items-center rounded-md px-4 text-[13px] font-semibold text-white"
        style={{ background: '#e04a3d' }}
      >
        Connect analytics
      </Link>
    </Centered>
  )
}

function AnalyticsBody({
  isLoading,
  gaConnected,
}: {
  isLoading: boolean
  gaConnected: boolean
}): JSX.Element {
  if (isLoading) {
    return (
      <Centered>
        <Loader2 className="h-5 w-5 animate-spin text-[var(--cat-ink-3)]" />
      </Centered>
    )
  }
  if (!gaConnected) return <ConnectGa4 />
  return (
    <Centered>
      <p className="text-[13px] font-medium text-[var(--cat-ink)]">No analytics data yet</p>
      <p className="max-w-sm text-[12px] text-[var(--cat-ink-3)]">
        GA4 is connected — traffic data will appear here after the next sync.
      </p>
    </Centered>
  )
}

export function AnalyticsView(): JSX.Element {
  const { connected, isLoading } = useIntegrations()
  const gaConnected = connected.has('google-analytics')

  return (
    <div className="w-full">
      <DashHeader
        title="Analytics"
        subtitle="How much traffic AI engines send you, and where it lands."
      />
      <AnalyticsBody isLoading={isLoading} gaConnected={gaConnected} />
    </div>
  )
}
