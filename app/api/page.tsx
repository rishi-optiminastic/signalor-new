import type { Metadata } from 'next'

import { MarketingContent } from '@/features/landing/components/MarketingContent'

export const metadata: Metadata = {
  title: 'API & MCP',
  description: 'Build on top of Signalor data with the API and MCP server.',
}

export default function ApiPage(): JSX.Element {
  return (
    <MarketingContent
      eyebrow="API & MCP"
      title="Build on top of Signalor data"
      subtitle="Pull GEO scores, runs, and recommendations into your own tools — or wire Signalor into an assistant with the MCP server."
      cta={{ label: 'Talk to us', href: '/contact-sales' }}
      sections={[
        {
          heading: 'REST API',
          body: 'Programmatic access to analyses, scores, pillar breakdowns, and recommendations so you can embed GEO data anywhere.',
        },
        {
          heading: 'MCP server',
          body: 'Expose Signalor to any MCP-compatible assistant so it can run audits and read results as part of a workflow.',
        },
        {
          heading: 'Webhooks',
          body: 'Get notified when a run completes or a score changes, and trigger your own automations off the back of it.',
        },
        {
          heading: 'Built for teams',
          body: 'Scoped keys, predictable rate limits, and clear docs so you can ship an integration with confidence.',
        },
      ]}
    />
  )
}
