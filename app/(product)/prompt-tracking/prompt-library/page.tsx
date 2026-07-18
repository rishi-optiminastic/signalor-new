import type { Metadata } from 'next'

import { MarketingShell } from '@/features/landing/components/MarketingShell'

import { ListChecks } from '@/features/site/components/icons'
import { FeatureDetailHero } from '@/features/site/components/landing/feature-detail-hero'
import { IntegrationDetailCta } from '@/features/site/components/landing/integration-detail-cta'
import { LandingFaq } from '@/features/site/components/landing/landing-faq'
import { JsonLd } from '@/features/site/components/seo/json-ld'
import {
  PROMPT_LIBRARY_PAGE,
  PROMPT_TRACKING_LIBRARY_FAQ,
} from '@/features/site/lib/landing-prompt-tracking-content'
import { breadcrumbJsonLd, buildMetadata, faqJsonLd } from '@/features/site/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Prompt library, prompt tracking',
  description: PROMPT_LIBRARY_PAGE.subhead,
  path: '/prompt-tracking/prompt-library',
})

export default function PromptLibraryPage() {
  return (
    <MarketingShell>
      <JsonLd
        id="ld-prompt-library-breadcrumb"
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Prompt tracking', path: '/prompt-tracking' },
          { name: 'Prompt library', path: '/prompt-tracking/prompt-library' },
        ])}
      />
      <JsonLd id="ld-prompt-library-faq" data={faqJsonLd([...PROMPT_TRACKING_LIBRARY_FAQ])} />
      <FeatureDetailHero
        backHref="/prompt-tracking"
        backLabel="Prompt tracking"
        eyebrow="Feature"
        copy={PROMPT_LIBRARY_PAGE}
        Icon={ListChecks}
      />
      <IntegrationDetailCta />
      <LandingFaq
        sectionId="prompt-tracking-library-faq"
        headingId="prompt-tracking-library-faq-heading"
        heading="FAQs"
        description="Libraries, exports, and collaboration in SignalorAI."
        items={[...PROMPT_TRACKING_LIBRARY_FAQ]}
      />
    </MarketingShell>
  )
}
