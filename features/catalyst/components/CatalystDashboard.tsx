import { CatalystShell } from '@/features/catalyst/components/CatalystShell'
import { DashboardContent } from '@/features/catalyst/components/DashboardContent'

export function CatalystDashboard(): JSX.Element {
  return (
    <CatalystShell>
      <DashboardContent />
    </CatalystShell>
  )
}
