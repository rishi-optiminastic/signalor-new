import type { Metadata } from "next";
import { JsonLd } from "@fe/components/seo/json-ld";
import { breadcrumbJsonLd, buildMetadata, faqJsonLd, SITE_BRAND, SITE_URL } from "@fe/lib/seo";
import { PRICING_FAQ_ITEMS } from "@fe/lib/pricing-marketing-content";

export const metadata: Metadata = buildMetadata({
  title: "Pricing, GEO + AEO platform plans",
  description:
    "Signalor pricing for AI visibility and GEO. GBP plans: Self-Serve Brand (£69.99), Managed Growth Brand (£99.69), and Enterprise (contact sales). Agency plans available. Cancel anytime.",
  path: "/pricing",
});

const pricingProductJsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: SITE_BRAND,
  description: "Generative Engine Optimization and AI visibility platform for brands and agencies.",
  brand: { "@type": "Brand", name: "Signalor" },
  url: `${SITE_URL}/pricing`,
  offers: [
    {
      "@type": "Offer",
      name: "Self-Serve Brand",
      price: "69.99",
      priceCurrency: "GBP",
      url: `${SITE_URL}/pricing`,
      availability: "https://schema.org/InStock",
      category: "subscription",
    },
    {
      "@type": "Offer",
      name: "Managed Growth Brand",
      price: "99.69",
      priceCurrency: "GBP",
      url: `${SITE_URL}/pricing`,
      availability: "https://schema.org/InStock",
      category: "subscription",
    },
    {
      "@type": "Offer",
      name: "Enterprise",
      priceCurrency: "GBP",
      url: `${SITE_URL}/pricing`,
      availability: "https://schema.org/InStock",
      category: "subscription",
    },
  ],
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        id="ld-pricing-breadcrumb"
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Pricing", path: "/pricing" },
        ])}
      />
      <JsonLd id="ld-pricing-product" data={pricingProductJsonLd} />
      <JsonLd id="ld-pricing-faq" data={faqJsonLd([...PRICING_FAQ_ITEMS])} />
      {children}
    </>
  );
}
