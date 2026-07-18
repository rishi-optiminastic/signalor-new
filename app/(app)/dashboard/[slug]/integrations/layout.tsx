import type { Metadata } from 'next'
import type { ReactNode } from 'react'

// Private workspace page - title only; noindex is inherited from the dashboard layout.
export const metadata: Metadata = {
  title: 'Integrations · SignalorAI',
}

export default function IntegrationsLayout({ children }: { children: ReactNode }): JSX.Element {
  return <>{children}</>
}
