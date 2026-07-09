import type { Metadata } from 'next'

import { MarketingContent } from '@/features/landing/components/MarketingContent'

export const metadata: Metadata = {
  title: 'For Agencies',
  description: 'Track and improve AI search visibility across all of your clients.',
}

export default function ForAgenciesPage(): JSX.Element {
  return (
    <MarketingContent
      eyebrow="For Agencies"
      title="Track AI search visibility for every client"
      subtitle="Run GEO audits, monitor share of voice, and ship prioritized fixes across your whole client roster from one workspace."
      cta={{ label: 'See pricing', href: '/pricing' }}
      sections={[
        {
          heading: 'One workspace, every brand',
          body: 'Manage each client as its own project with separate scores, prompts, and runs — no juggling logins or spreadsheets.',
        },
        {
          heading: 'Reporting that sells',
          body: 'Clear 0–100 GEO scores and pillar breakdowns your clients understand, with exportable reports for every review.',
        },
        {
          heading: 'Prioritized fix lists',
          body: 'Turn every audit into ranked, actionable recommendations your team can execute or hand to the client’s developers.',
        },
        {
          heading: 'Scale with your book',
          body: 'Add brands as you grow. Agency plans are built for high project counts and repeatable delivery.',
        },
      ]}
    />
  )
}
