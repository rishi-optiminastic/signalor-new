import { ConversionRateCard } from '@/features/catalyst/components/cards/ConversionRateCard'
import { TotalSalesCard } from '@/features/catalyst/components/cards/TotalSalesCard'
import { TotalVisitorsCard } from '@/features/catalyst/components/cards/TotalVisitorsCard'
import { UserRetentionCard } from '@/features/catalyst/components/cards/UserRetentionCard'
import { VisitorsChannelsCard } from '@/features/catalyst/components/cards/VisitorsChannelsCard'
import { WeeklyVisitorsCard } from '@/features/catalyst/components/cards/WeeklyVisitorsCard'
import { Topbar } from '@/features/catalyst/components/Topbar'

export function DashboardContent(): JSX.Element {
  return (
    <>
      <Topbar />
      <section className="cat-stagger mt-2.5 grid min-h-0 flex-1 auto-rows-min grid-cols-1 gap-2 overflow-y-auto pr-0.5 sm:grid-cols-2 xl:grid-cols-3">
        <TotalSalesCard />
        <TotalVisitorsCard />
        <ConversionRateCard />
        <VisitorsChannelsCard />
        <UserRetentionCard />
        <WeeklyVisitorsCard />
      </section>
    </>
  )
}
