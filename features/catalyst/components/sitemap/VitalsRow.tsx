import { IndexedCard, type IndexedInfo } from '@/features/catalyst/components/sitemap/IndexedCard'
import { WebVitalCard } from '@/features/catalyst/components/sitemap/WebVitalCard'
import type { Vital } from '@/features/catalyst/sitemap-data'

interface VitalsRowProps {
  indexed: IndexedInfo
  vitals: Vital[]
}

export function VitalsRow({ indexed, vitals }: VitalsRowProps): JSX.Element {
  return (
    <div className="cat-stagger grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
      <IndexedCard indexed={indexed} />
      {vitals.map(vital => (
        <WebVitalCard key={vital.label} vital={vital} />
      ))}
    </div>
  )
}
