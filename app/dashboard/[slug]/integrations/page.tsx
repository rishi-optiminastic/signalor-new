import { CatalystShell } from '@/features/catalyst/components/CatalystShell'
import { IntegrationsView } from '@/features/catalyst/components/integrations/IntegrationsView'

export default function IntegrationsPage(): JSX.Element {
  return (
    <CatalystShell>
      <IntegrationsView />
    </CatalystShell>
  )
}
