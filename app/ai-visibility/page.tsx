'use client'

import { MarketingShell } from '@/features/landing/components/MarketingShell'

import { LandingFaq } from '@fe/components/landing/landing-faq'
import { PromptTrackingFeaturesGrid } from '@fe/components/landing/prompt-tracking-features-grid'
import { PromptTrackingHero } from '@fe/components/landing/prompt-tracking-hero'
import { PromptTrackingWhySection } from '@fe/components/landing/prompt-tracking-why-section'
import { RelatedLinks } from '@fe/components/seo/related-links'
import {
  CONTENT_SIGNALS_CAPABILITY_ROWS,
  CONTENT_SIGNALS_FAQ,
  CONTENT_SIGNALS_FEATURES_FOOTER_CTAS,
  CONTENT_SIGNALS_FEATURES_INTRO,
  CONTENT_SIGNALS_FEATURE_CELLS,
  CONTENT_SIGNALS_HERO,
  CONTENT_SIGNALS_HUB_CARDS,
  CONTENT_SIGNALS_PILLAR_ROWS,
  CONTENT_SIGNALS_PROOF_METRICS,
  CONTENT_SIGNALS_WHY,
} from '@fe/lib/landing-content-signals-content'

export default function ContentSignalsPage() {
  return (
    <MarketingShell>
      <p className="sr-only">
        Signalor AI Visibility scoring audits how ChatGPT, Claude, Gemini, Perplexity, and Google AI
        Overview see and cite your brand. The platform checks schema.org JSON-LD coverage across
        Organization, Product, Article, FAQ, HowTo, and BreadcrumbList types, detects missing or
        malformed structured data, and evaluates trust signals including authorship markers,
        citation authority, and credibility indicators that large language models weigh when
        deciding what to recommend. Every audit maps findings to a 0-100 GEO score pillar breakdown
        , Schema, E-E-A-T, Content, and Technical, so SEO teams, content managers, and developers
        know exactly which fixes deliver the highest citation lift. Signalor AI Visibility is built
        for brands optimizing for generative engine optimization (GEO) and answer engine
        optimization (AEO) across the AI search landscape.
      </p>
      <PromptTrackingHero hero={CONTENT_SIGNALS_HERO} cards={CONTENT_SIGNALS_HUB_CARDS} />
      <PromptTrackingFeaturesGrid
        intro={CONTENT_SIGNALS_FEATURES_INTRO}
        cells={CONTENT_SIGNALS_FEATURE_CELLS}
        footerCtas={CONTENT_SIGNALS_FEATURES_FOOTER_CTAS}
        headingId="content-signals-features-heading"
        theme="blue"
      />
      <PromptTrackingWhySection
        content={CONTENT_SIGNALS_WHY}
        proofMetrics={CONTENT_SIGNALS_PROOF_METRICS}
        pillarRows={CONTENT_SIGNALS_PILLAR_ROWS}
        capabilityRows={CONTENT_SIGNALS_CAPABILITY_ROWS}
        primaryCta={CONTENT_SIGNALS_HERO.primaryCta}
        secondaryCtaLabel="Run free GEO audit"
        secondaryCtaHref="/"
        headingId="content-signals-why-heading"
      />
      <LandingFaq
        sectionId="content-signals-faq"
        headingId="content-signals-faq-heading"
        heading="Content signal FAQs"
        description="How Signalor grades structure, schema, and trust on your site."
        items={[...CONTENT_SIGNALS_FAQ]}
      />
      <RelatedLinks page="/ai-visibility" />
    </MarketingShell>
  )
}
