import { CatalystShell } from '@/features/catalyst/components/CatalystShell'
import { TeamView } from '@/features/catalyst/components/team/TeamView'

export default function CatalystTeamPage(): JSX.Element {
  return (
    <CatalystShell>
      <TeamView />
    </CatalystShell>
  )
}
