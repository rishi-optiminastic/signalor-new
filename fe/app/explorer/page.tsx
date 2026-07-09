"use client";

import { LandingFaq } from "@fe/components/landing/landing-faq";
import { LandingFooter } from "@fe/components/landing/landing-footer";
import { LandingMarketingShell } from "@fe/components/landing/landing-marketing-shell";
import { PromptTrackingFeaturesGrid } from "@fe/components/landing/prompt-tracking-features-grid";
import { PromptTrackingHero } from "@fe/components/landing/prompt-tracking-hero";
import { PromptTrackingWhySection } from "@fe/components/landing/prompt-tracking-why-section";
import {
  REPORTING_CAPABILITY_ROWS,
  REPORTING_FAQ,
  REPORTING_FEATURES_FOOTER_CTAS,
  REPORTING_FEATURES_INTRO,
  REPORTING_FEATURE_CELLS,
  REPORTING_HERO,
  REPORTING_HUB_CARDS,
  REPORTING_PILLAR_ROWS,
  REPORTING_PROOF_METRICS,
  REPORTING_WHY,
} from "@fe/lib/landing-reporting-content";

export default function ExplorerPage() {
  return (
    <LandingMarketingShell>
      <p className="sr-only">
        Signalor Explorer is the AI citation analytics layer for the prompts you already track. It
        charts your weekly AI citation rate per engine across ChatGPT, Claude, Gemini, Perplexity,
        Google, and Bing, and tracks your GEO score run over run so you can see whether visibility
        work is moving the answers. Explorer benchmarks your share of AI mentions against
        competitors and surfaces the specific tracked prompts where rivals are cited and your brand
        is missing, so marketing knows where to invest in content next. Citation source reporting
        breaks down which of your pages and which rival pages each engine cites, by domain and by
        engine. Every analysis run can be exported as a board-ready PDF covering GEO score, citation
        share, and the fixes you shipped. Signalor Explorer is the AI search analytics and GEO
        reporting layer for marketing teams, SEO agencies, and in-house brand managers tracking
        generative engine visibility.
      </p>
      <PromptTrackingHero hero={REPORTING_HERO} cards={REPORTING_HUB_CARDS} />
      <PromptTrackingFeaturesGrid
        intro={REPORTING_FEATURES_INTRO}
        cells={REPORTING_FEATURE_CELLS}
        footerCtas={REPORTING_FEATURES_FOOTER_CTAS}
        headingId="explorer-features-heading"
        theme="violet"
      />
      <PromptTrackingWhySection
        content={REPORTING_WHY}
        proofMetrics={REPORTING_PROOF_METRICS}
        pillarRows={REPORTING_PILLAR_ROWS}
        capabilityRows={REPORTING_CAPABILITY_ROWS}
        primaryCta={REPORTING_HERO.primaryCta}
        secondaryCtaLabel="Run free GEO audit"
        secondaryCtaHref="/sign-up"
        headingId="reporting-why-heading"
      />
      <LandingFaq
        sectionId="reporting-faq"
        headingId="reporting-faq-heading"
        heading="Reporting FAQs"
        description="How Signalor turns GEO runs into stakeholder-ready stories."
        items={[...REPORTING_FAQ]}
      />
      <LandingFooter />
    </LandingMarketingShell>
  );
}
