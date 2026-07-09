import { CatalystShell } from '@/features/catalyst/components/CatalystShell'
import { RecommendationsView } from '@/features/catalyst/components/recommendations/RecommendationsView'

export default function RecommendationsPage(): JSX.Element {
  return (
    <CatalystShell>
      <RecommendationsView />
    </CatalystShell>
  )
}
