import type { Metadata } from 'next'

import { MarketingContent } from '@/features/landing/components/MarketingContent'

export const metadata: Metadata = {
  title: 'For Brands',
  description: 'Learn how AI engines talk about your brand — and improve it.',
}

export default function ForBrandsPage(): JSX.Element {
  return (
    <MarketingContent
      eyebrow="For Brands"
      title="Learn how AI talks about your brand"
      subtitle="See how ChatGPT, Gemini, and Perplexity describe and cite you today — then close the gaps with a clear, prioritized plan."
      cta={{ label: 'Run a free audit', href: '/explorer' }}
      sections={[
        {
          heading: 'Know your AI reputation',
          body: 'Track brand mentions, sentiment, and citations across the major AI engines so you know exactly where you stand.',
        },
        {
          heading: 'One score, six pillars',
          body: 'A single GEO score backed by content, schema, E-E-A-T, technical, entity, and AI-visibility checks you can act on.',
        },
        {
          heading: 'Fixes, not just findings',
          body: 'Every audit ends in a ranked list of changes — and connectors that can apply many of them for you.',
        },
        {
          heading: 'Measure the impact',
          body: 'Connect analytics to watch AI referral traffic move as your visibility improves over time.',
        },
      ]}
    />
  )
}
