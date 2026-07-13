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
  NEXTJS_INTEGRATION_PAGE,
} from '@/features/site/lib/landing-integration-content'
import { breadcrumbJsonLd, buildMetadata, faqJsonLd } from '@/features/site/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Next.js integration, GEO scoring for Next.js apps',
  description: NEXTJS_INTEGRATION_PAGE.subhead,
  path: '/integration/nextjs',
})

export default function NextjsIntegrationPage() {
  return (
    <MarketingShell>
      <p className="sr-only">
        The Signalor Next.js integration instruments your app with an SDK so GEO audits read the
        same server-rendered and static output your users and AI crawlers receive. Signalor scores
        route metadata, JSON-LD, and rendered content, then surfaces prioritized recommendations for
        how ChatGPT, Claude, Gemini, and Perplexity describe and cite your pages. Re-scoring runs on
        deploy so results track your release cadence. You can disconnect at any time from your
        Signalor workspace settings.
      </p>
      <JsonLd
        id="ld-nextjs-breadcrumb"
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Integrations', path: '/integration' },
          { name: 'Next.js', path: '/integration/nextjs' },
        ])}
      />
      <JsonLd id="ld-nextjs-faq" data={faqJsonLd([...INTEGRATION_DETAIL_FAQ])} />
      <IntegrationPlatformHero copy={NEXTJS_INTEGRATION_PAGE} logoSrc="/logos/nextjs.svg" />
      <IntegrationPlatformDetails platform="nextjs" title="Next.js" />
      <IntegrationDetailCta />
      <LandingFaq
        sectionId="nextjs-integration-faq"
        headingId="nextjs-integration-faq-heading"
        heading="FAQs"
        description="Setup, the SDK, and how Next.js data flows into GEO scoring."
        items={[...INTEGRATION_DETAIL_FAQ]}
      />
      <RelatedLinks page="/integration/nextjs" />
    </MarketingShell>
  )
}
