import type { Metadata } from "next";
import { JsonLd } from "@fe/components/seo/json-ld";
import { breadcrumbJsonLd, buildMetadata, faqJsonLd, SITE_URL } from "@fe/lib/seo";
import { REPORTING_FAQ } from "@fe/lib/landing-reporting-content";

export const metadata: Metadata = buildMetadata({
  title: "GEO Explorer: AI Citation Analytics & Reporting",
  description:
    "Track your AI citation trends and share of voice across ChatGPT, Gemini, and Perplexity, find the tracked prompts where competitors are cited and you're not, and export a board-ready GEO PDF report.",
  path: "/explorer",
  keywords: [
    "GEO reporting",
    "AI visibility analytics",
    "AI citation analytics",
    "GEO analytics dashboard",
    "AI citation trends",
    "share of AI voice",
    "AI search analytics",
    "GEO score history",
    "citation trend tracking",
    "GEO PDF reports",
    "AI brand visibility reports",
    "competitor citation gaps",
    "Generative Engine Optimization reporting",
    "AI search monitoring",
    "competitor AI mentions",
  ],
});

const explorerWebPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${SITE_URL}/explorer`,
  name: "GEO Explorer: AI Citation Analytics & Reporting",
  description:
    "Track AI citation trends and share of voice, find tracked prompts where competitors are cited and you're not, and export a board-ready GEO PDF report.",
  url: `${SITE_URL}/explorer`,
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Explorer", item: `${SITE_URL}/explorer` },
    ],
  },
  mainEntity: {
    "@type": "SoftwareApplication",
    name: "Signalor Explorer",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description: "Free GEO audit available",
    },
    featureList: [
      "Weekly AI citation rate trends per engine",
      "Citation trend tracking across ChatGPT, Claude, Gemini, Perplexity, Google, and Bing",
      "Board-ready GEO PDF exports",
      "Share of voice benchmarking versus competitors",
      "Competitor gap analysis across tracked prompts",
      "GEO score history run over run",
    ],
  },
};

export default function ExplorerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        id="ld-explorer-breadcrumb"
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Explorer", path: "/explorer" },
        ])}
      />
      <JsonLd id="ld-explorer-webpage" data={explorerWebPageJsonLd} />
      <JsonLd id="ld-explorer-faq" data={faqJsonLd([...REPORTING_FAQ])} />
      {children}
    </>
  );
}
