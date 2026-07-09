import type { Metadata } from 'next'

import { MarketingContent } from '@/features/landing/components/MarketingContent'

export const metadata: Metadata = {
  title: 'Docs',
  description: 'How the Signalor platform works — scoring, integrations, and the API.',
}

export default function DocsPage(): JSX.Element {
  return (
    <MarketingContent
      eyebrow="Docs"
      title="How the platform works"
      subtitle="Everything you need to get from your first analysis to an ongoing GEO workflow — the scoring model, integrations, and the API."
      cta={{ label: 'Start an analysis', href: '/explorer' }}
      sections={[
        {
          heading: 'Quickstart',
          body: 'Create an account, add your brand and URL, connect an integration, and launch your first analysis in under two minutes.',
        },
        {
          heading: 'The scoring model',
          body: 'How the six pillars are weighted, what each sub-check measures, and how the weighted average becomes your 0–100 GEO score.',
        },
        {
          heading: 'Integrations',
          body: 'Reference for the Shopify, WordPress, GitHub, and Google Analytics connectors, including what each one reads and writes.',
        },
        {
          heading: 'API & MCP',
          body: 'Pull scores, runs, and recommendations programmatically, or wire Signalor into an assistant with the MCP server.',
        },
      ]}
    />
  )
}
