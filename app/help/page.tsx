import type { Metadata } from 'next'

import { MarketingContent } from '@/features/landing/components/MarketingContent'

export const metadata: Metadata = {
  title: 'Help Center',
  description: 'Find answers fast — getting started, billing, integrations, and support.',
}

export default function HelpPage(): JSX.Element {
  return (
    <MarketingContent
      eyebrow="Help Center"
      title="Find answers fast"
      subtitle="Guides for the questions that come up most — and a direct line to us when you need a human."
      cta={{ label: 'Contact support', href: '/contact-sales' }}
      sections={[
        {
          heading: 'Getting started',
          body: 'Set up your brand, run your first analysis, and understand what each part of the dashboard is telling you.',
        },
        {
          heading: 'Billing & plans',
          body: 'How plans, project limits, and engine coverage work, plus how to upgrade, downgrade, or manage your subscription.',
        },
        {
          heading: 'Integrations',
          body: 'Fixes for common connection issues with Shopify, WordPress, GitHub, and Google Analytics.',
        },
        {
          heading: 'Still stuck?',
          body: 'Reach out and a real person on the team will help — we usually reply the same working day.',
        },
      ]}
    />
  )
}
