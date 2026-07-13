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
  SHOPIFY_INTEGRATION_PAGE,
} from '@/features/site/lib/landing-integration-content'
import { breadcrumbJsonLd, buildMetadata, faqJsonLd } from '@/features/site/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Shopify integration, GEO scoring for Shopify',
  description: SHOPIFY_INTEGRATION_PAGE.subhead,
  path: '/integration/shopify',
})

export default function ShopifyIntegrationPage() {
  return (
    <MarketingShell>
      <p className="sr-only">
        The Signalor Shopify integration pulls your live product catalog into GEO scoring so AI
        engines can accurately cite your inventory. Once connected, Signalor reads product titles,
        descriptions, prices, and existing schema markup, then surfaces prioritized recommendations
        for improving how ChatGPT, Claude, Gemini, and Perplexity describe and link to your store.
        The integration uses a read-only sync and does not modify your storefront. You can
        disconnect at any time from your Signalor workspace settings.
      </p>
      <JsonLd
        id="ld-shopify-breadcrumb"
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Integrations', path: '/integration' },
          { name: 'Shopify', path: '/integration/shopify' },
        ])}
      />
      <JsonLd id="ld-shopify-faq" data={faqJsonLd([...INTEGRATION_DETAIL_FAQ])} />
      <IntegrationPlatformHero copy={SHOPIFY_INTEGRATION_PAGE} logoSrc="/logos/shopify.svg" />
      <IntegrationPlatformDetails platform="shopify" title="Shopify" />
      <IntegrationDetailCta />
      <LandingFaq
        sectionId="shopify-integration-faq"
        headingId="shopify-integration-faq-heading"
        heading="FAQs"
        description="Security, tokens, and how Shopify data flows into GEO scoring."
        items={[...INTEGRATION_DETAIL_FAQ]}
      />
      <RelatedLinks page="/integration/shopify" />
    </MarketingShell>
  )
}
