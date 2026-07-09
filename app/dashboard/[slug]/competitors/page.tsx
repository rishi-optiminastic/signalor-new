import { CatalystShell } from '@/features/catalyst/components/CatalystShell'
import { CompetitorsView } from '@/features/catalyst/components/competitors/CompetitorsView'

export default function CatalystCompetitorsPage(): JSX.Element {
  return (
    <CatalystShell>
      <CompetitorsView />
    </CatalystShell>
  )
}
