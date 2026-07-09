import type { Metadata } from 'next'

import { MarketingContent } from '@/features/landing/components/MarketingContent'

export const metadata: Metadata = {
  title: 'Guides',
  description: 'Playbooks and strategy for winning visibility in AI search.',
}

export default function GuidesPage(): JSX.Element {
  return (
    <MarketingContent
      eyebrow="Guides"
      title="Playbooks for generative engine optimization"
      subtitle="Step-by-step guides that turn a GEO score into a prioritized plan — from schema coverage to E-E-A-T signals and prompt tracking."
      cta={{ label: 'Read the blog', href: '/blog' }}
      sections={[
        {
          heading: 'GEO fundamentals',
          body: 'What generative engine optimization is, how it differs from SEO, and the six pillars Signalor scores: content, schema, E-E-A-T, technical, entity, and AI visibility.',
        },
        {
          heading: 'Schema & structured data',
          body: 'Which Schema.org types AI engines actually use, how to add JSON-LD without breaking your site, and how to verify coverage across key page templates.',
        },
        {
          heading: 'Building trust signals',
          body: 'Authorship, citations, and credibility markers that make an LLM willing to cite your page instead of a competitor.',
        },
        {
          heading: 'Prompt tracking',
          body: 'How to choose the prompts that matter for your brand and read share-of-voice movement across ChatGPT, Gemini, and Perplexity.',
        },
      ]}
    />
  )
}
