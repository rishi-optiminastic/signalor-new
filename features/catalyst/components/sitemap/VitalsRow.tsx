import { IndexedCard } from '@/features/catalyst/components/sitemap/IndexedCard'
import { WebVitalCard } from '@/features/catalyst/components/sitemap/WebVitalCard'
import { VITALS } from '@/features/catalyst/sitemap-data'

export function VitalsRow(): JSX.Element {
  return (
    <div className="cat-stagger grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
      <IndexedCard />
      {VITALS.map(vital => (
        <WebVitalCard key={vital.label} vital={vital} />
      ))}
    </div>
  )
}
