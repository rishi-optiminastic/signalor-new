import type { Metadata } from "next";
import { JsonLd } from "@fe/components/seo/json-ld";
import { AGGREGATE_RATING, breadcrumbJsonLd, buildMetadata, faqJsonLd, SITE_URL } from "@fe/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Free Domain Rating (DR) Checker & Authority Score",
  description:
    "Check any domain's Domain Rating (DR) on a 0-100 scale plus its global rank in seconds. Free domain authority checker sourced from open backlink data, no sign-up.",
  path: "/tools/domain-rating",
  keywords: [
    "domain rating checker",
    "DR checker",
    "free domain rating tool",
    "domain authority checker",
    "website authority checker",
    "domain rank checker",
    "DR score",
    "free DA checker",
    "open pagerank",
    "domain authority score",
    "check domain rating",
    "authority score checker",
    "free SEO authority tool",
    "global domain rank",
    "domain trust score",
  ],
});

const FAQ = [
  {
    question: "What is Domain Rating (DR)?",
    answer:
      "Domain Rating is a 0-100 score that reflects the strength of a website's backlink profile, the quantity and quality of other sites linking to it. A higher DR generally means more authoritative inbound links, which search engines and AI engines weigh when deciding which sources to trust and cite.",
  },
  {
    question: "How is the Domain Rating calculated?",
    answer:
      "The checker sources open backlink data (built on Common Crawl, the same basis as popular DR-style metrics) and normalizes it to a familiar 0-100 Domain Rating. It reflects how many authoritative sites link to the domain.",
  },
  {
    question: "What is the global rank?",
    answer:
      "Global rank is the domain's worldwide position by authority, where #1 is the strongest. It's a quick way to gauge how a domain compares against the rest of the web, lower numbers mean more authority.",
  },
  {
    question: "Does a high Domain Rating guarantee AI citations?",
    answer:
      "No. Backlink authority is one off-page trust signal among many. Earning AI citations also requires strong content quality, clear entity definitions, schema, and topical authority, all areas Signalor's full GEO audit covers.",
  },
];

const domainRatingJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Signalor Domain Rating Checker",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  aggregateRating: AGGREGATE_RATING,
  url: `${SITE_URL}/tools/domain-rating`,
  description:
    "Free Domain Rating (DR) checker. Returns a 0-100 Domain Rating and global rank for any domain, sourced from open backlink data (Common Crawl).",
  featureList: [
    "0-100 Domain Rating (DR) score",
    "Worldwide global rank",
    "Sourced from open backlink data",
    "No account required",
    "Unlimited free checks",
  ],
};

export default function DomainRatingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        id="ld-domain-rating-breadcrumb"
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Free Tools", path: "/tools/domain-rating" },
          { name: "Domain Rating Checker", path: "/tools/domain-rating" },
        ])}
      />
      <JsonLd id="ld-domain-rating-tool" data={domainRatingJsonLd} />
      <JsonLd id="ld-domain-rating-faq" data={faqJsonLd(FAQ)} />
      {children}
    </>
  );
}
