import type { Metadata } from "next";
import { ListChecks } from "@fe/components/icons";

import { FeatureDetailHero } from "@fe/components/landing/feature-detail-hero";
import { IntegrationDetailCta } from "@fe/components/landing/integration-detail-cta";
import { LandingFaq } from "@fe/components/landing/landing-faq";
import { LandingFooter } from "@fe/components/landing/landing-footer";
import { LandingMarketingShell } from "@fe/components/landing/landing-marketing-shell";
import {
  PROMPT_LIBRARY_PAGE,
  PROMPT_TRACKING_LIBRARY_FAQ,
} from "@fe/lib/landing-prompt-tracking-content";
import { JsonLd } from "@fe/components/seo/json-ld";
import { breadcrumbJsonLd, buildMetadata, faqJsonLd } from "@fe/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Prompt library, prompt tracking",
  description: PROMPT_LIBRARY_PAGE.subhead,
  path: "/prompt-tracking/prompt-library",
});

export default function PromptLibraryPage() {
  return (
    <LandingMarketingShell>
      <JsonLd
        id="ld-prompt-library-breadcrumb"
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Prompt tracking", path: "/prompt-tracking" },
          { name: "Prompt library", path: "/prompt-tracking/prompt-library" },
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
        description="Libraries, exports, and collaboration in Signalor."
        items={[...PROMPT_TRACKING_LIBRARY_FAQ]}
      />
      <LandingFooter />
    </LandingMarketingShell>
  );
}
