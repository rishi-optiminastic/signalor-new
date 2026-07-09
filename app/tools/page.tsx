import Link from 'next/link'
import type { ComponentType } from 'react'

import { MarketingShell } from '@/features/landing/components/MarketingShell'

import {
  ArrowRight,
  Globe,
  MessageSquare,
  BarChart3,
  ListChecks,
  Radar,
} from '@fe/components/icons'
import { ScreenHR } from '@fe/components/ui/intersection-diamonds'
import { buildMetadata } from '@fe/lib/seo'

export const metadata = buildMetadata({
  title: 'Free GEO & AI Visibility Tools',
  description:
    'Free, no-signup tools to check your AI search visibility: GEO score, llms.txt readiness, schema validation, competitor citation share, and domain rating. Built on the Signalor engine.',
  path: '/tools',
  keywords: [
    'free GEO tools',
    'AI visibility tools',
    'free SEO AI tools',
    'GEO score checker',
    'llms.txt checker',
    'schema validator',
    'competitor analysis tool',
    'domain rating checker',
    'AI citation tools',
    'generative engine optimization tools',
  ],
})

type Tool = {
  href: string
  title: string
  desc: string
  icon: ComponentType<{ className?: string }>
}

const TOOLS: Tool[] = [
  {
    href: '/tools/url-analyzer',
    title: 'URL analyzer',
    desc: 'Paste any URL for an instant GEO & AI visibility score, schema audit, and top fixes.',
    icon: Globe,
  },
  {
    href: '/tools/llms-check',
    title: 'llms.txt checker',
    desc: 'Check your llms.txt and LLM readiness — AI-bot access, schema, and metadata — in seconds.',
    icon: MessageSquare,
  },
  {
    href: '/tools/competitors-analysis',
    title: 'Competitor analysis',
    desc: 'Compare your AI citation share against rivals across ChatGPT, Gemini, and Perplexity.',
    icon: BarChart3,
  },
  {
    href: '/tools/schema-validator',
    title: 'Schema validator',
    desc: 'Validate your JSON-LD and schema.org coverage for AI engines and rich results.',
    icon: ListChecks,
  },
  {
    href: '/tools/domain-rating',
    title: 'Domain rating',
    desc: "Check any domain's authority score (DR) on a 0–100 scale, sourced from Ahrefs.",
    icon: Radar,
  },
]

export default function ToolsIndexPage() {
  return (
    <MarketingShell>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="from-primary/[0.05] via-background to-background relative bg-gradient-to-b px-6 pt-14 pb-14 lg:px-12 lg:pt-16 lg:pb-16">
        <div className="mx-auto max-w-7xl">
          <p className="text-muted-foreground text-[11px] font-medium tracking-[0.22em] uppercase">
            [ free tools ]
          </p>
          <h1 className="text-foreground mt-4 max-w-4xl text-3xl leading-[1.12] font-bold tracking-tight sm:text-4xl lg:text-[2.65rem] xl:text-5xl">
            Free GEO &amp; AI-visibility{' '}
            <span className="text-primary relative whitespace-nowrap">
              tools
              <span
                className="border-primary/20 absolute right-0 -bottom-1 left-0 border-b-2 border-dashed"
                aria-hidden
              />
            </span>
          </h1>
          <p className="text-accent-foreground mt-5 max-w-2xl text-base leading-relaxed font-light lg:text-lg">
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
            {TOOLS.map(tool => (
              <Link
                key={tool.href}
                href={tool.href}
                className="group hover:bg-primary/[0.03] flex h-full flex-col gap-4 bg-white px-6 py-12 transition-colors md:px-8 md:py-14 lg:px-6"
              >
                <span className="bg-primary/10 text-primary inline-flex h-10 w-10 items-center justify-center">
                  <tool.icon className="h-5 w-5" />
                </span>
                <h3 className="text-foreground text-lg font-semibold tracking-tight">
                  {tool.title}
                </h3>
                <p className="text-accent-foreground text-sm leading-relaxed font-light">
                  {tool.desc}
                </p>
                <span className="text-primary mt-auto inline-flex items-center gap-1.5 pt-2 text-[13px] font-semibold">
                  Open tool
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ScreenHR />
    </MarketingShell>
  )
}
