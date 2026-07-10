import type { Metadata } from 'next'

import { MarketingShell } from '@/features/landing/components/MarketingShell'

import { LayoutGrid } from '@legacy/components/icons'
import { FeatureDetailHero } from '@legacy/components/landing/feature-detail-hero'
import { IntegrationDetailCta } from '@legacy/components/landing/integration-detail-cta'
import { LandingFaq } from '@legacy/components/landing/landing-faq'
import { JsonLd } from '@legacy/components/seo/json-ld'
import {
  AI_SURFACES_PAGE,
  PROMPT_TRACKING_SURFACES_FAQ,
} from '@legacy/lib/landing-prompt-tracking-content'
import { breadcrumbJsonLd, buildMetadata, faqJsonLd } from '@legacy/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'AI surfaces, prompt tracking',
  description: AI_SURFACES_PAGE.subhead,
  path: '/prompt-tracking/ai-surfaces',
})

export default function AiSurfacesPromptTrackingPage() {
  return (
    <MarketingShell>
      <JsonLd
        id="ld-ai-surfaces-breadcrumb"
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Prompt tracking', path: '/prompt-tracking' },
          { name: 'AI surfaces', path: '/prompt-tracking/ai-surfaces' },
        ])}
      />
      <JsonLd id="ld-ai-surfaces-faq" data={faqJsonLd([...PROMPT_TRACKING_SURFACES_FAQ])} />
      <FeatureDetailHero
        backHref="/prompt-tracking"
        backLabel="Prompt tracking"
        eyebrow="Feature"
        copy={AI_SURFACES_PAGE}
        Icon={LayoutGrid}
      />
      <IntegrationDetailCta />
      <LandingFaq
        sectionId="prompt-tracking-surfaces-faq"
        headingId="prompt-tracking-surfaces-faq-heading"
        heading="FAQs"
        description="How surface-level tracking works inside your workspace."
        items={[...PROMPT_TRACKING_SURFACES_FAQ]}
      />
    </MarketingShell>
  )
}
