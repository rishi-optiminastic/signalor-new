import type { Competitor } from '@/features/catalyst/competitors-data'
import { CompetitorCard } from '@/features/catalyst/components/competitors/CompetitorCard'

export function CompetitorsGrid({ competitors }: { competitors: Competitor[] }): JSX.Element {
  return (
    <div className="cat-stagger grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
      {competitors.map(competitor => (
        <CompetitorCard key={competitor.domain || competitor.name} competitor={competitor} />
      ))}
    </div>
  )
}
