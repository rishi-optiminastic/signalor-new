import type { ReactNode } from 'react'

import { AnnouncementBar } from '@/features/landing/components/AnnouncementBar'
import { Footer } from '@/features/landing/components/Footer'
import { LandingNav } from '@/features/landing/components/LandingNav'

interface MarketingShellProps {
  children: ReactNode
}

/**
 * New-signalor marketing chrome — announcement bar + top nav + footer — shared by
 * every non-home marketing/tool/blog page. Mirrors the home page's chrome so the
 * ported pages stop rendering the old signalor shell (LandingMarketingShell +
 * fe LandingFooter). Page bodies are passed through untouched.
 */
export function MarketingShell({ children }: MarketingShellProps): JSX.Element {
  return (
    <div className="min-h-screen bg-[#fbfbfa] font-sans">
      <AnnouncementBar />
      <LandingNav />
      {children}
      <Footer />
    </div>
  )
}
