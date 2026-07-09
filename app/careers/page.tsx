import type { Metadata } from 'next'

import { MarketingContent } from '@/features/landing/components/MarketingContent'

export const metadata: Metadata = {
  title: 'Careers',
  description: 'Help build the platform brands use to win visibility in AI search.',
}

export default function CareersPage(): JSX.Element {
  return (
    <MarketingContent
      eyebrow="Careers"
      title="Build the future of AI search visibility"
      subtitle="We're a small, senior team shipping the tools brands use to understand and improve how AI engines see, trust, and cite them. If that sounds like your kind of problem, we'd love to talk."
      cta={{ label: 'Get in touch', href: '/contact-sales' }}
      sections={[
        {
          heading: 'How we work',
          body: 'Remote-first, low-meeting, high-ownership. Everyone ships. We keep teams small so decisions stay fast and the path from idea to production is short.',
        },
        {
          heading: 'What we value',
          body: 'Depth over breadth, clear writing, and a bias for measurable outcomes. We care more about how you think than which framework you last used.',
        },
        {
          heading: 'Benefits',
          body: 'Competitive pay and equity, flexible hours across time zones, a real hardware and learning budget, and generous time off you are expected to use.',
        },
        {
          heading: 'Open roles',
          body: "We hire across engineering, data, and go-to-market. Don't see your exact role? Reach out anyway — strong generalists always get a reply.",
        },
      ]}
    />
  )
}
