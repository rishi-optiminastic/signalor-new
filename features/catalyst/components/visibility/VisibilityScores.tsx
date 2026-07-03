import { OverallCard } from '@/features/catalyst/components/visibility/OverallCard'
import { ScoreCard } from '@/features/catalyst/components/visibility/ScoreCard'
import { SCORE_CARDS } from '@/features/catalyst/visibility-data'

export function VisibilityScores(): JSX.Element {
  return (
    <div className="cat-stagger grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-6">
      <OverallCard />
      {SCORE_CARDS.map(data => (
        <ScoreCard key={data.label} data={data} />
      ))}
    </div>
  )
}
