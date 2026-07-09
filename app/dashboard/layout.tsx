import type { ReactNode } from 'react'

import { CatalystThemeProvider } from '@/features/catalyst/components/CatalystThemeProvider'
import { DashboardProjectGuard } from '@/features/catalyst/components/DashboardProjectGuard'

export default function CatalystLayout({ children }: { children: ReactNode }): JSX.Element {
  return (
    <CatalystThemeProvider>
      <DashboardProjectGuard>{children}</DashboardProjectGuard>
    </CatalystThemeProvider>
  )
}
