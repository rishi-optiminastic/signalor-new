import type { Metadata } from 'next'

import { MarketingContent } from '@/features/landing/components/MarketingContent'

export const metadata: Metadata = {
  title: 'Community',
  description: 'Join the Signalor community of teams optimizing for AI search.',
}

export default function CommunityPage(): JSX.Element {
  return (
    <MarketingContent
      eyebrow="Community"
      title="Join the people building for AI search"
      subtitle="Trade tactics with SEO leads, content teams, and founders who are figuring out generative engine optimization in real time."
      cta={{ label: 'Request an invite', href: '/contact-sales' }}
      sections={[
        {
          heading: 'The Slack',
          body: 'A working channel for GEO practitioners — share audits, compare notes on engine behavior, and get feedback on your fixes.',
        },
        {
          heading: 'Events & office hours',
          body: 'Live sessions where we review real sites, break down score changes, and answer questions from members.',
        },
        {
          heading: 'Share your wins',
          body: 'Post before-and-after scores and the changes that moved them. The best case studies get featured on the blog.',
        },
        {
          heading: 'Code of conduct',
          body: 'Be generous, keep it practical, and no spam. We keep the space high-signal so everyone gets value from being here.',
        },
      ]}
    />
  )
}
