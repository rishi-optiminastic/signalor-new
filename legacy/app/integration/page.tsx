import type { Metadata } from "next";

import { IntegrationHero } from "@legacy/components/landing/integration-hero";
import { IntegrationMidSection } from "@legacy/components/landing/integration-mid-section";
import { LandingFaq } from "@legacy/components/landing/landing-faq";
import { LandingFooter } from "@legacy/components/landing/landing-footer";
import { RelatedLinks } from "@legacy/components/seo/related-links";
import { LandingMarketingShell } from "@legacy/components/landing/landing-marketing-shell";
import { INTEGRATION_HUB_FAQ } from "@legacy/lib/landing-integration-content";
import { JsonLd } from "@legacy/components/seo/json-ld";
import { breadcrumbJsonLd, buildMetadata, faqJsonLd } from "@legacy/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Integrations, Shopify & WordPress",
  description:
    "Connect Shopify and WordPress to Signalor so GEO audits and AI visibility scores reflect your live catalog and CMS. One-click schema fixes from inside the admin.",
  path: "/integration",
});

export default function IntegrationPage() {
  return (
    <LandingMarketingShell>
      <p className="sr-only">
        Signalor connects to Shopify and WordPress so your GEO audits and AI visibility scores
        reflect live catalog and CMS data. The Shopify integration pulls product titles,
        descriptions, and schema into Signalor so AI engines can correctly cite your inventory. The
        WordPress plugin surfaces GEO recommendations and applies one-click JSON-LD schema fixes
        directly from your WordPress admin dashboard. Both connectors use read-oriented syncs and
        can be disconnected at any time from your workspace settings.
      </p>
      <JsonLd
        id="ld-integration-breadcrumb"
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Integrations", path: "/integration" },
        ])}
      />
      <JsonLd id="ld-integration-faq" data={faqJsonLd([...INTEGRATION_HUB_FAQ])} />
      <IntegrationHero />
      <IntegrationMidSection />
      <LandingFaq
        sectionId="integration-faq"
        headingId="integration-faq-heading"
        heading="Integration FAQs"
        description="How connectors work with Signalor workspaces, data scope, and billing-friendly defaults."
        items={[...INTEGRATION_HUB_FAQ]}
      />
      <RelatedLinks page="/integration" />
      <LandingFooter />
    </LandingMarketingShell>
  );
}
