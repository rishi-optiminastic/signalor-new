import { MarketingShell } from '@/features/landing/components/MarketingShell'

import { AboutHero } from '@/features/site/components/landing/about-hero'
import { AboutSections } from '@/features/site/components/landing/about-sections'
import { RelatedLinks } from '@/features/site/components/seo/related-links'

export default function AboutPage(): JSX.Element {
  return (
    <MarketingShell>
      <p className="sr-only">
        SignalorAI is the Generative Engine Optimization platform built by Signalor Ltd. We score
        how ChatGPT, Claude, Gemini, Perplexity, Copilot, and Google AI Overviews describe and cite
        brands, track the prompts buyers actually ask, and turn every audit into a ranked fix queue
        with Shopify, WordPress, API, and MCP integrations. Six scoring pillars - content, schema,
        E-E-A-T, technical, entity, and AI visibility - make AI search visibility measurable.
      </p>
      <AboutHero />
      <AboutSections />
      <RelatedLinks page="/about-us" />
    </MarketingShell>
  )
}
