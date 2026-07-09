"use client";

import { LandingFaq } from "@fe/components/landing/landing-faq";
import { LandingFooter } from "@fe/components/landing/landing-footer";
import { RelatedLinks } from "@fe/components/seo/related-links";
import { LandingMarketingShell } from "@fe/components/landing/landing-marketing-shell";
import { PromptTrackingFeaturesGrid } from "@fe/components/landing/prompt-tracking-features-grid";
import { PromptTrackingHero } from "@fe/components/landing/prompt-tracking-hero";
import { PromptTrackingWhySection } from "@fe/components/landing/prompt-tracking-why-section";
import {
  INTEGRATIONS_CAPABILITY_ROWS,
  INTEGRATIONS_FAQ,
  INTEGRATIONS_FEATURES_FOOTER_CTAS,
  INTEGRATIONS_FEATURES_INTRO,
  INTEGRATIONS_FEATURE_CELLS,
  INTEGRATIONS_HERO,
  INTEGRATIONS_HUB_CARDS,
  INTEGRATIONS_PILLAR_ROWS,
  INTEGRATIONS_PROOF_METRICS,
  INTEGRATIONS_WHY,
} from "@fe/lib/landing-integrations-feature-content";

export default function IntegrationsFeaturePage() {
  return (
    <LandingMarketingShell>
      <p className="sr-only">
        Signalor Recommendations delivers a prioritized GEO fix queue that maps every schema,
        content, technical, and E-E-A-T issue to an expected GEO score impact. Each recommendation
        is ranked by priority, critical, high, medium, or low, so engineering, SEO, and content
        teams work the highest-impact items first, with step-by-step guidance and an estimated score
        delta. For Shopify stores and WordPress sites, approved fixes publish directly to the live
        CMS: you preview the change, approve it, and Signalor re-crawls the page to verify the fix
        took effect. The Signalor Shopify app and the WordPress GEO plugin apply structured data,
        meta, and content updates without a developer handoff. Connect Google Analytics 4 to
        correlate GEO score movement with sessions and traffic. Generate live and test API keys to
        read scores and recommendations, and subscribe to the analysis.completed webhook to push
        finished runs into your own tools.
      </p>
      <PromptTrackingHero hero={INTEGRATIONS_HERO} cards={INTEGRATIONS_HUB_CARDS} />
      <PromptTrackingFeaturesGrid
        intro={INTEGRATIONS_FEATURES_INTRO}
        cells={INTEGRATIONS_FEATURE_CELLS}
        footerCtas={INTEGRATIONS_FEATURES_FOOTER_CTAS}
        headingId="recommendations-features-heading"
        theme="emerald"
      />
      <PromptTrackingWhySection
        content={INTEGRATIONS_WHY}
        proofMetrics={INTEGRATIONS_PROOF_METRICS}
        pillarRows={INTEGRATIONS_PILLAR_ROWS}
        capabilityRows={INTEGRATIONS_CAPABILITY_ROWS}
        primaryCta={INTEGRATIONS_HERO.primaryCta}
        secondaryCtaLabel="Browse integrations"
        secondaryCtaHref="/integration"
        headingId="integrations-why-heading"
      />
      <LandingFaq
        sectionId="integrations-faq"
        headingId="integrations-faq-heading"
        heading="Integration FAQs"
        description="How Signalor connects to the tools your team already uses."
        items={[...INTEGRATIONS_FAQ]}
      />
      <RelatedLinks page="/recommendations" />
      <LandingFooter />
    </LandingMarketingShell>
  );
}
