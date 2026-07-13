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
  WORDPRESS_INTEGRATION_PAGE,
} from '@/features/site/lib/landing-integration-content'
import {
  AGGREGATE_RATING,
  breadcrumbJsonLd,
  buildMetadata,
  faqJsonLd,
  SITE_URL,
} from '@/features/site/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'WordPress plugin, GEO scoring & schema fixes',
  description: WORDPRESS_INTEGRATION_PAGE.subhead,
  path: '/integration/wordpress',
})

const wordpressPluginJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Signalor GEO for WordPress',
  applicationCategory: 'BrowserApplication',
  operatingSystem: 'WordPress',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  aggregateRating: AGGREGATE_RATING,
  url: `${SITE_URL}/integration/wordpress`,
  downloadUrl: `${SITE_URL}/downloads/signalor-geo.zip`,
  description:
    'Self-hosted WordPress plugin that surfaces Signalor GEO recommendations and applies one-click schema fixes inside the WordPress admin.',
}

export default function WordPressIntegrationPage() {
  return (
    <MarketingShell>
      <p className="sr-only">
        The Signalor WordPress plugin brings GEO recommendations and one-click schema fixes directly
        into your WordPress admin panel. After installing the self-hosted plugin, Signalor audits
        your posts and pages for missing or malformed JSON-LD, incomplete Organization markup, and
        weak AI citability signals, then lets you apply fixes without touching code. The plugin
        works with any WordPress theme and requires no API keys to install. Download is free;
        advanced monitoring and bulk fixes require a Signalor plan.
      </p>
      <JsonLd
        id="ld-wordpress-breadcrumb"
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Integrations', path: '/integration' },
          { name: 'WordPress', path: '/integration/wordpress' },
        ])}
      />
      <JsonLd id="ld-wordpress-plugin" data={wordpressPluginJsonLd} />
      <JsonLd id="ld-wordpress-faq" data={faqJsonLd([...INTEGRATION_DETAIL_FAQ])} />
      <IntegrationPlatformHero copy={WORDPRESS_INTEGRATION_PAGE} logoSrc="/logos/wordpress.svg" />
      <IntegrationPlatformDetails platform="wordpress" title="WordPress" />
      <IntegrationDetailCta />
      <LandingFaq
        sectionId="wordpress-integration-faq"
        headingId="wordpress-integration-faq-heading"
        heading="FAQs"
        description="Security, tokens, and how WordPress content feeds GEO scoring."
        items={[...INTEGRATION_DETAIL_FAQ]}
      />
      <RelatedLinks page="/integration/wordpress" />
    </MarketingShell>
  )
}
