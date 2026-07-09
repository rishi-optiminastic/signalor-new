import Link from "next/link";
import type { ComponentType } from "react";
import { ArrowRight, Globe, MessageSquare, BarChart3, ListChecks, Radar } from "@fe/components/icons";
import { LandingMarketingShell } from "@fe/components/landing/landing-marketing-shell";
import { LandingFooter } from "@fe/components/landing/landing-footer";
import { ScreenHR } from "@fe/components/ui/intersection-diamonds";
import { buildMetadata } from "@fe/lib/seo";

export const metadata = buildMetadata({
  title: "Free GEO & AI Visibility Tools",
  description:
    "Free, no-signup tools to check your AI search visibility: GEO score, llms.txt readiness, schema validation, competitor citation share, and domain rating. Built on the Signalor engine.",
  path: "/tools",
  keywords: [
    "free GEO tools",
    "AI visibility tools",
    "free SEO AI tools",
    "GEO score checker",
    "llms.txt checker",
    "schema validator",
    "competitor analysis tool",
    "domain rating checker",
    "AI citation tools",
    "generative engine optimization tools",
  ],
});

type Tool = {
  href: string;
  title: string;
  desc: string;
  icon: ComponentType<{ className?: string }>;
};

const TOOLS: Tool[] = [
  {
    href: "/tools/url-analyzer",
    title: "URL analyzer",
    desc: "Paste any URL for an instant GEO & AI visibility score, schema audit, and top fixes.",
    icon: Globe,
  },
  {
    href: "/tools/llms-check",
    title: "llms.txt checker",
    desc: "Check your llms.txt and LLM readiness — AI-bot access, schema, and metadata — in seconds.",
    icon: MessageSquare,
  },
  {
    href: "/tools/competitors-analysis",
    title: "Competitor analysis",
    desc: "Compare your AI citation share against rivals across ChatGPT, Gemini, and Perplexity.",
    icon: BarChart3,
  },
  {
    href: "/tools/schema-validator",
    title: "Schema validator",
    desc: "Validate your JSON-LD and schema.org coverage for AI engines and rich results.",
    icon: ListChecks,
  },
  {
    href: "/tools/domain-rating",
    title: "Domain rating",
    desc: "Check any domain's authority score (DR) on a 0–100 scale, sourced from Ahrefs.",
    icon: Radar,
  },
];

export default function ToolsIndexPage() {
  return (
    <LandingMarketingShell>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-b from-primary/[0.05] via-background to-background px-6 pb-14 pt-14 lg:px-12 lg:pb-16 lg:pt-16">
        <div className="mx-auto max-w-7xl">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
            [ free tools ]
          </p>
          <h1 className="mt-4 max-w-4xl text-3xl font-bold leading-[1.12] tracking-tight text-foreground sm:text-4xl lg:text-[2.65rem] xl:text-5xl">
            Free GEO &amp; AI-visibility{" "}
            <span className="relative whitespace-nowrap text-primary">
              tools
              <span
                className="absolute -bottom-1 left-0 right-0 border-b-2 border-dashed border-primary/20"
                aria-hidden
              />
            </span>
          </h1>
          <p className="mt-5 max-w-2xl text-base font-light leading-relaxed text-accent-foreground lg:text-lg">
            Run instant, no-signup checks on any domain — GEO score, llms.txt readiness, schema
            coverage, competitor citation share, and domain authority. Each one runs on the same
            engine that powers Signalor.
          </p>
        </div>
      </section>

      {/* ── Tools grid: full-width divided cells (matches landing how-it-works) ── */}
      <ScreenHR />
      <section aria-labelledby="tools-heading">
        <h2 id="tools-heading" className="sr-only">
          All free tools
        </h2>
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 divide-y divide-black/6 md:grid-cols-2 md:divide-x md:divide-y-0 lg:grid-cols-5">
            {TOOLS.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="group flex h-full flex-col gap-4 bg-white px-6 py-12 transition-colors hover:bg-primary/[0.03] md:px-8 md:py-14 lg:px-6"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center bg-primary/10 text-primary">
                  <tool.icon className="h-5 w-5" />
                </span>
                <h3 className="text-lg font-semibold tracking-tight text-foreground">
                  {tool.title}
                </h3>
                <p className="text-sm font-light leading-relaxed text-accent-foreground">
                  {tool.desc}
                </p>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-[13px] font-semibold text-primary">
                  Open tool
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ScreenHR />
      <LandingFooter />
    </LandingMarketingShell>
  );
}
