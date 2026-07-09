import type { Metadata } from "next";
import { JsonLd } from "@fe/components/seo/json-ld";
import { breadcrumbJsonLd, buildMetadata, faqJsonLd, SITE_URL } from "@fe/lib/seo";
import { INTEGRATIONS_FAQ } from "@fe/lib/landing-integrations-feature-content";

export const metadata: Metadata = buildMetadata({
  title: "GEO Recommendations: AI Fix Queue for Shopify & WordPress",
  description:
    "Prioritized GEO fix recommendations ranked by citation impact. Signalor connects to Shopify and WordPress so you can apply schema, meta, and content fixes to your live site in one click, no engineering required.",
  path: "/recommendations",
  keywords: [
    "GEO recommendations",
    "AI optimization fixes",
    "Shopify AI SEO",
    "WordPress GEO plugin",
    "citation improvement",
    "schema optimization",
    "AI citation fixes",
    "content GEO fixes",
    "Generative Engine Optimization fixes",
    "GEO fix queue",
    "one-click schema fix",
    "AI search optimization",
    "SEO recommendations AI",
    "structured data fixes",
    "GEO integrations",
  ],
});

const recommendationsWebPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${SITE_URL}/recommendations`,
  name: "GEO Recommendations: AI Fix Queue for Shopify & WordPress",
  description:
    "Prioritized fixes ranked by impact on GEO score and AI citations. Apply schema, content, and trust improvements directly to Shopify and WordPress.",
  url: `${SITE_URL}/recommendations`,
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Recommendations",
        item: `${SITE_URL}/recommendations`,
      },
    ],
  },
  mainEntity: {
    "@type": "SoftwareApplication",
    name: "Signalor GEO Recommendations",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description: "Free GEO audit available",
    },
    featureList: [
      "Prioritized fix queue ranked by GEO score impact",
      "One-click Shopify schema and content publishing",
      "WordPress GEO plugin for direct site edits",
      "Preview, approve, and verify fixes on the live page",
      "Google Analytics 4 integration and score-traffic correlation",
      "API keys and analysis.completed webhooks for custom workflows",
    ],
  },
};

export default function RecommendationsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        id="ld-recommendations-breadcrumb"
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Recommendations", path: "/recommendations" },
        ])}
      />
      <JsonLd id="ld-recommendations-webpage" data={recommendationsWebPageJsonLd} />
      <JsonLd id="ld-recommendations-faq" data={faqJsonLd([...INTEGRATIONS_FAQ])} />
      {children}
    </>
  );
}
