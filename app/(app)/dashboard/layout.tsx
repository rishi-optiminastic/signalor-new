import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { ViewTransitionProvider } from '@/components/providers/view-transition-provider'
import { CatalystThemeProvider } from '@/features/catalyst/components/CatalystThemeProvider'
import { DashboardProjectGuard } from '@/features/catalyst/components/DashboardProjectGuard'
import { DashboardToaster } from '@/features/catalyst/components/DashboardToaster'
import { OnboardingFloater } from '@/features/catalyst/components/onboarding/OnboardingFloater'
import { buildMetadata } from '@/features/site/lib/seo'

// Private workspace - keep the whole dashboard tree out of search indexes.
export const metadata: Metadata = {
  ...buildMetadata({
    title: 'Dashboard',
    description: 'SignalorAI workspace dashboard.',
    noindex: true,
  }),
  title: 'Dashboard · SignalorAI',
}

export default function CatalystLayout({ children }: { children: ReactNode }): JSX.Element {
  return (
    <CatalystThemeProvider>
      <ViewTransitionProvider>
        <DashboardProjectGuard>{children}</DashboardProjectGuard>
      </ViewTransitionProvider>
      <OnboardingFloater />
      <DashboardToaster />
    </CatalystThemeProvider>
  )
}
