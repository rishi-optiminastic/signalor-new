import { AgentView } from '@/features/catalyst/components/agent/AgentView'
import { CatalystShell } from '@/features/catalyst/components/CatalystShell'

export default function AgentPage(): JSX.Element {
  return (
    <CatalystShell>
      <AgentView />
    </CatalystShell>
  )
}
