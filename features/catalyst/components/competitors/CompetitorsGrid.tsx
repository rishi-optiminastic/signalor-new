import { COMPETITORS } from '@/features/catalyst/competitors-data'
import { CompetitorCard } from '@/features/catalyst/components/competitors/CompetitorCard'

export function CompetitorsGrid(): JSX.Element {
  return (
    <div className="cat-stagger grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
      {COMPETITORS.map(competitor => (
        <CompetitorCard key={competitor.domain} competitor={competitor} />
      ))}
    </div>
  )
}
