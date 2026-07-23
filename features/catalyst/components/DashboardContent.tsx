'use client'

import { AiCitationCard } from '@/features/catalyst/components/cards/AiCitationCard'
import { CompetitorHeatmapCard } from '@/features/catalyst/components/cards/CompetitorHeatmapCard'
import { ConversionRateCard } from '@/features/catalyst/components/cards/ConversionRateCard'
import { EngagementOpportunitiesCard } from '@/features/catalyst/components/cards/EngagementOpportunitiesCard'
import { GeoScoreCard } from '@/features/catalyst/components/cards/GeoScoreCard'
import { TopSourcesCard } from '@/features/catalyst/components/cards/TopSourcesCard'
import { UserRetentionCard } from '@/features/catalyst/components/cards/UserRetentionCard'
import { VisibilityBreakdownCard } from '@/features/catalyst/components/cards/VisibilityBreakdownCard'
import { VisibilityTrendCard } from '@/features/catalyst/components/cards/VisibilityTrendCard'
import { VisitorsChannelsCard } from '@/features/catalyst/components/cards/VisitorsChannelsCard'
import { DashboardSkeleton } from '@/features/catalyst/components/DashboardSkeleton'
import { AiAssistantPanel } from '@/features/catalyst/components/overview/AiAssistantPanel'
import { DashboardGreeting } from '@/features/catalyst/components/overview/DashboardGreeting'
import { OverviewFiltersProvider } from '@/features/catalyst/components/overview/OverviewFilters'
import { WorldPresenceCard } from '@/features/catalyst/components/overview/WorldPresenceCard'
import { useDashboardReady } from '@/hooks/useDashboardReady'

export function DashboardContent(): JSX.Element {
  const ready = useDashboardReady()

  // This page's toolbar (range, engine filter, Export, Re-analyze) renders on the
  // greeting row via DashboardGreeting rather than in the shared GlobalBar.
  if (!ready) return <DashboardSkeleton />

  return (
    <OverviewFiltersProvider>
      <section className="cat-stagger grid min-h-0 flex-1 auto-rows-min grid-cols-1 gap-2 overflow-y-auto pr-0.5 sm:grid-cols-2 xl:grid-cols-3">
        <DashboardGreeting />
        <AiAssistantPanel />

        {/* Row 1 — hero visibility + ranking, engagement opportunities */}
        <GeoScoreCard />
        <EngagementOpportunitiesCard />

        {/* Row 2 — score trend, weighted breakdown */}
        <VisibilityTrendCard />
        <VisibilityBreakdownCard />

        {/* Row 3 — citation coverage, share of voice, recommendation rate */}
        <AiCitationCard />
        <VisitorsChannelsCard />
        <ConversionRateCard />

        {/* Row 4 — top AI sources, prompt coverage */}
        <TopSourcesCard />
        <UserRetentionCard />

        {/* Extended — competitor matrix + geographic presence */}
        <CompetitorHeatmapCard />
        <WorldPresenceCard />
      </section>
    </OverviewFiltersProvider>
  )
}
