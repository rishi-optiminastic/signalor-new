import { Suspense } from 'react'

import { CatalystShell } from '@/features/catalyst/components/CatalystShell'
import { MonitoringTabs } from '@/features/catalyst/components/monitoring/MonitoringTabs'

export default function CatalystVisibilityPage(): JSX.Element {
  return (
    <CatalystShell>
      <Suspense>
        <MonitoringTabs />
      </Suspense>
    </CatalystShell>
  )
}
