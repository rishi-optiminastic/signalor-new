import type { Metadata } from 'next'

import { MarketingShell } from '@/features/landing/components/MarketingShell'

import { IntegrationDetailCta } from '@/features/site/components/landing/integration-detail-cta'
import { IntegrationPlatformDetails } from '@/features/site/components/landing/integration-platform-details'
import { IntegrationPlatformHero } from '@/features/site/components/landing/integration-platform-hero'
import { LandingFaq } from '@/features/site/components/landing/landing-faq'
import { JsonLd } from '@/features/site/components/seo/json-ld'
import { RelatedLinks } from '@/features/site/components/seo/related-links'
import {
  FRAMER_INTEGRATION_PAGE,
  INTEGRATION_DETAIL_FAQ,
} from '@/features/site/lib/landing-integration-content'
import { breadcrumbJsonLd, buildMetadata, faqJsonLd } from '@/features/site/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Framer integration, GEO scoring for Framer sites',
  description: FRAMER_INTEGRATION_PAGE.subhead,
  path: '/integration/framer',
})

export default function FramerIntegrationPage() {
  return (
    <MarketingShell>
      <p className="sr-only">
        The Signalor Framer integration reads the pages, CMS entries, and metadata you publish so
        GEO audits reflect your live site. Signalor scores page titles, descriptions, and structured
        data as engines fetch them, then surfaces prioritized recommendations for how ChatGPT,
        Claude, Gemini, and Perplexity describe and cite your pages. The sync is read-oriented and
        re-scores on your publish cadence. You can disconnect at any time from your Signalor
        workspace settings.
      </p>
      <JsonLd
        id="ld-framer-breadcrumb"
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Integrations', path: '/integration' },
          { name: 'Framer', path: '/integration/framer' },
        ])}
      />
      <JsonLd id="ld-framer-faq" data={faqJsonLd([...INTEGRATION_DETAIL_FAQ])} />
      <IntegrationPlatformHero copy={FRAMER_INTEGRATION_PAGE} logoSrc="/logos/framer.svg" />
      <IntegrationPlatformDetails platform="framer" title="Framer" />
      <IntegrationDetailCta />
      <LandingFaq
        sectionId="framer-integration-faq"
        headingId="framer-integration-faq-heading"
        heading="FAQs"
        description="Publishing, CMS entries, and how Framer data flows into GEO scoring."
        items={[...INTEGRATION_DETAIL_FAQ]}
      />
      <RelatedLinks page="/integration/framer" />
    </MarketingShell>
  )
}
