import type { Metadata } from 'next'

import { MarketingShell } from '@/features/landing/components/MarketingShell'

import { IntegrationDetailCta } from '@/features/site/components/landing/integration-detail-cta'
import { IntegrationPlatformDetails } from '@/features/site/components/landing/integration-platform-details'
import { IntegrationPlatformHero } from '@/features/site/components/landing/integration-platform-hero'
import { LandingFaq } from '@/features/site/components/landing/landing-faq'
import { JsonLd } from '@/features/site/components/seo/json-ld'
import { RelatedLinks } from '@/features/site/components/seo/related-links'
import {
  INTEGRATION_DETAIL_FAQ,
  WEBFLOW_INTEGRATION_PAGE,
} from '@/features/site/lib/landing-integration-content'
import { breadcrumbJsonLd, buildMetadata, faqJsonLd } from '@/features/site/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Webflow integration, GEO scoring for Webflow sites',
  description: WEBFLOW_INTEGRATION_PAGE.subhead,
  path: '/integration/webflow',
})

export default function WebflowIntegrationPage() {
  return (
    <MarketingShell>
      <p className="sr-only">
        The Signalor Webflow integration reads your published pages, CMS collections, and SEO
        settings so GEO audits reflect what your live site actually serves. Signalor scores titles,
        descriptions, Open Graph, and structured data, then surfaces prioritized recommendations for
        how ChatGPT, Claude, Gemini, and Perplexity describe and cite your pages. The sync is
        read-oriented and re-scores after you publish. You can disconnect at any time from your
        Signalor workspace settings.
      </p>
      <JsonLd
        id="ld-webflow-breadcrumb"
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Integrations', path: '/integration' },
          { name: 'Webflow', path: '/integration/webflow' },
        ])}
      />
      <JsonLd id="ld-webflow-faq" data={faqJsonLd([...INTEGRATION_DETAIL_FAQ])} />
      <IntegrationPlatformHero copy={WEBFLOW_INTEGRATION_PAGE} logoSrc="/logos/webflow.svg" />
      <IntegrationPlatformDetails platform="webflow" title="Webflow" />
      <IntegrationDetailCta />
      <LandingFaq
        sectionId="webflow-integration-faq"
        headingId="webflow-integration-faq-heading"
        heading="FAQs"
        description="Publishing, CMS collections, and how Webflow data flows into GEO scoring."
        items={[...INTEGRATION_DETAIL_FAQ]}
      />
      <RelatedLinks page="/integration/webflow" />
    </MarketingShell>
  )
}
