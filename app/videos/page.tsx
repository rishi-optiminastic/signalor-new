import type { Metadata } from 'next'

import { MarketingContent } from '@/features/landing/components/MarketingContent'

export const metadata: Metadata = {
  title: 'Videos',
  description: 'Product walkthroughs and short explainers for Signalor.',
}

export default function VideosPage(): JSX.Element {
  return (
    <MarketingContent
      eyebrow="Videos"
      title="Watch Signalor in action"
      subtitle="Short walkthroughs of the analyzer, the dashboard, and the workflows teams use to improve how AI engines cite their brand."
      cta={{ label: 'Run a free audit', href: '/explorer' }}
      sections={[
        {
          heading: 'Product tour',
          body: 'A five-minute overview of the analyzer: paste a URL, read the GEO score, and turn the pillar breakdown into a fix list.',
        },
        {
          heading: 'Dashboard deep dives',
          body: 'How to use Visibility, Prompt Tracking, Competitors, and the Sitemap audit to track movement over time.',
        },
        {
          heading: 'Integrations',
          body: 'Connecting Shopify, WordPress, GitHub, and Google Analytics so fixes and traffic data flow into one place.',
        },
        {
          heading: 'Office hours',
          body: 'Recorded sessions where we review real sites and answer GEO questions from the community.',
        },
      ]}
    />
  )
}
