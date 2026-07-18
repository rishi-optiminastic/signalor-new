import type { Metadata } from 'next'

import { MarketingShell } from '@/features/landing/components/MarketingShell'

import { IntegrationHero } from '@/features/site/components/landing/integration-hero'
import { IntegrationMidSection } from '@/features/site/components/landing/integration-mid-section'
import { LandingFaq } from '@/features/site/components/landing/landing-faq'
import { JsonLd } from '@/features/site/components/seo/json-ld'
import { RelatedLinks } from '@/features/site/components/seo/related-links'
import { INTEGRATION_HUB_FAQ } from '@/features/site/lib/landing-integration-content'
import { breadcrumbJsonLd, buildMetadata, faqJsonLd } from '@/features/site/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Integrations, Shopify & WordPress',
  description:
    'Connect Shopify and WordPress to SignalorAI so GEO audits and AI visibility scores reflect your live catalog and CMS. One-click schema fixes from inside the admin.',
  path: '/integration',
})

export default function IntegrationPage() {
  return (
    <MarketingShell>
      <p className="sr-only">
        SignalorAI connects to Shopify and WordPress so your GEO audits and AI visibility scores
        reflect live catalog and CMS data. The Shopify integration pulls product titles,
        descriptions, and schema into SignalorAI so AI engines can correctly cite your inventory.
        The WordPress plugin surfaces GEO recommendations and applies one-click JSON-LD schema fixes
        directly from your WordPress admin dashboard. Both connectors use read-oriented syncs and
        can be disconnected at any time from your workspace settings.
      </p>
      <JsonLd
        id="ld-integration-breadcrumb"
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Integrations', path: '/integration' },
        ])}
      />
      <JsonLd id="ld-integration-faq" data={faqJsonLd([...INTEGRATION_HUB_FAQ])} />
      <IntegrationHero />
      <IntegrationMidSection />
      <LandingFaq
        sectionId="integration-faq"
        headingId="integration-faq-heading"
        heading="Integration FAQs"
        description="How connectors work with SignalorAI workspaces, data scope, and billing-friendly defaults."
        items={[...INTEGRATION_HUB_FAQ]}
      />
      <RelatedLinks page="/integration" />
    </MarketingShell>
  )
}
