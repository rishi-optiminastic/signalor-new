import { CatalystShell } from '@/features/catalyst/components/CatalystShell'
import { ContentOptimisationView } from '@/features/catalyst/components/optimisation/ContentOptimisationView'

export default function ContentOptimisationPage(): JSX.Element {
  return (
    <CatalystShell>
      <ContentOptimisationView />
    </CatalystShell>
  )
}
