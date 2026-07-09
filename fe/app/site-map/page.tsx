import type { Metadata } from "next";
import Link from "next/link";
import { LandingFooter } from "@fe/components/landing/landing-footer";
import { LandingMarketingShell } from "@fe/components/landing/landing-marketing-shell";
import { JsonLd } from "@fe/components/seo/json-ld";
import { breadcrumbJsonLd, buildMetadata } from "@fe/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Sitemap: All Signalor pages",
  description:
    "Browse every Signalor page: AI visibility and GEO features, free tools, solutions, integrations, and resources.",
  path: "/site-map",
});

type SitemapGroup = { title: string; links: { href: string; label: string }[] };

const SITEMAP: SitemapGroup[] = [
  {
    title: "Platform",
    links: [
      { href: "/ai-visibility", label: "AI visibility scoring" },
      { href: "/recommendations", label: "GEO fix recommendations" },
      { href: "/prompt-tracking", label: "Prompt tracking" },
      { href: "/integration", label: "Integrations" },
      { href: "/pricing", label: "Pricing" },
    ],
  },
  {
    title: "Free tools",
    links: [
      { href: "/tools", label: "All free tools" },
      { href: "/tools/url-analyzer", label: "URL analyzer" },
      { href: "/tools/llms-check", label: "llms.txt checker" },
      { href: "/tools/competitors-analysis", label: "Competitor analysis" },
      { href: "/tools/schema-validator", label: "Schema validator" },
      { href: "/tools/domain-rating", label: "Domain rating" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { href: "/solutions/visibility", label: "Visibility for brands" },
      { href: "/solutions/fix-playbook", label: "GEO fix playbook" },
      { href: "/solutions/competitive-lens", label: "Competitive lens for agencies" },
    ],
  },
  {
    title: "Integrations",
    links: [
      { href: "/integration/shopify", label: "Shopify integration" },
      { href: "/integration/wordpress", label: "WordPress plugin" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about-us", label: "About Signalor" },
      { href: "/creators-program", label: "Creators program" },
      { href: "/blog", label: "Blog & resources" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/policy", label: "Privacy policy" },
      { href: "/terms", label: "Terms of service" },
    ],
  },
];

export default function SitemapPage() {
  return (
    <LandingMarketingShell>
      <JsonLd
        id="ld-sitemap-breadcrumb"
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Sitemap", path: "/site-map" },
        ])}
      />
      <section className="px-6 py-16 sm:py-20 lg:px-12">
        <div className="mx-auto max-w-5xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-500">
            [ sitemap ]
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            All Signalor pages
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-neutral-600">
            Every public page on Signalor, grouped by area. Looking for the machine-readable
            version? It&apos;s at{" "}
            <a href="/sitemap.xml" className="font-medium text-primary hover:underline">
              /sitemap.xml
            </a>
            .
          </p>

          <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {SITEMAP.map((group) => (
              <div key={group.title}>
                <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-900">
                  {group.title}
                </h2>
                <ul className="mt-4 space-y-2.5">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm font-normal text-neutral-600 transition-colors hover:text-neutral-900"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <LandingFooter />
    </LandingMarketingShell>
  );
}
