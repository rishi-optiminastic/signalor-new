import type { Metadata } from 'next'

import { MarketingContent } from '@/features/landing/components/MarketingContent'

export const metadata: Metadata = {
  title: 'Changelog',
  description: "What's new in Signalor — recent releases and improvements.",
}

export default function ChangelogPage(): JSX.Element {
  return (
    <MarketingContent
      eyebrow="Changelog"
      title="What's new in Signalor"
      subtitle="A running log of what we've shipped — new features, engine coverage, and improvements to scoring and integrations."
      cta={{ label: 'Try the latest', href: '/explorer' }}
      sections={[
        {
          heading: 'Prompt tracking',
          body: 'Track how ChatGPT, Gemini, and Perplexity answer the prompts that matter to your brand, with share-of-voice trends over time.',
        },
        {
          heading: 'Auto-fix connectors',
          body: 'The GitHub app and WordPress plugin now open fix PRs and apply one-click schema fixes straight from your recommendations.',
        },
        {
          heading: 'Analytics correlation',
          body: 'Connect Google Analytics to see AI referral traffic alongside your GEO score movement on one chart.',
        },
        {
          heading: 'Faster analyses',
          body: 'The analyzer pipeline is quicker and more resilient, so first runs complete sooner and re-runs stay consistent.',
        },
      ]}
    />
  )
}
