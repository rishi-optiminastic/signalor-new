import type { ReactNode } from 'react'

import { CatalystThemeProvider } from '@/features/catalyst/components/CatalystThemeProvider'

export default function CatalystLayout({ children }: { children: ReactNode }): JSX.Element {
  return <CatalystThemeProvider>{children}</CatalystThemeProvider>
}
