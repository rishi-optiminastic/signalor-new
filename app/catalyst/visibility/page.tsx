import { CatalystShell } from '@/features/catalyst/components/CatalystShell'
import { VisibilityView } from '@/features/catalyst/components/visibility/VisibilityView'

export default function CatalystVisibilityPage(): JSX.Element {
  return (
    <CatalystShell>
      <VisibilityView />
    </CatalystShell>
  )
}
