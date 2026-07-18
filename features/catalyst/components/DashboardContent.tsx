'use client'

import { AiCitationCard } from '@/features/catalyst/components/cards/AiCitationCard'
import { CompetitorHeatmapCard } from '@/features/catalyst/components/cards/CompetitorHeatmapCard'
import { ConversionRateCard } from '@/features/catalyst/components/cards/ConversionRateCard'
import { GeoScoreCard } from '@/features/catalyst/components/cards/GeoScoreCard'
import { UserRetentionCard } from '@/features/catalyst/components/cards/UserRetentionCard'
import { VisitorsChannelsCard } from '@/features/catalyst/components/cards/VisitorsChannelsCard'
import { WeeklyVisitorsCard } from '@/features/catalyst/components/cards/WeeklyVisitorsCard'
import { DashboardSkeleton } from '@/features/catalyst/components/DashboardSkeleton'
import { AiAssistantPanel } from '@/features/catalyst/components/overview/AiAssistantPanel'
import { DashboardGreeting } from '@/features/catalyst/components/overview/DashboardGreeting'
import { WorldPresenceCard } from '@/features/catalyst/components/overview/WorldPresenceCard'
import { useDashboardReady } from '@/hooks/useDashboardReady'

export function DashboardContent(): JSX.Element {
  const ready = useDashboardReady()

  // This page's toolbar (range, engine filter, Re-analyze) renders on the
  // greeting row via DashboardGreeting rather than in the shared GlobalBar.
  if (!ready) return <DashboardSkeleton />

  return (
    <section className="cat-stagger grid min-h-0 flex-1 auto-rows-min grid-cols-1 gap-2 overflow-y-auto pr-0.5 sm:grid-cols-2 xl:grid-cols-3">
      <DashboardGreeting />
      <AiAssistantPanel />
      <GeoScoreCard />
      <AiCitationCard />
      <ConversionRateCard />
      <VisitorsChannelsCard />
      <UserRetentionCard />
      <WeeklyVisitorsCard />
      <CompetitorHeatmapCard />
      <WorldPresenceCard />
    </section>
  )
}
