import {
  Eye,
  FileBarChart,
  FileText,
  GitCompare,
  Handshake,
  Layout,
  Link2,
  List,
  Megaphone,
  TrendingUp,
  Users,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type ActionCategory =
  | 'blog'
  | 'landing'
  | 'internal-links'
  | 'comparison'
  | 'report'
  | 'trending'
  | 'partnerships'
  | 'communities'
  | 'directories'
  | 'digital-pr'
  | 'competitor'

export type ActionStatus = 'new' | 'in-progress' | 'done' | 'dismissed'
/** CTA style: draft content · auto-execute · just open/view. */
export type ActionKind = 'draft' | 'auto' | 'open'
export type Pillar = 'Content' | 'On-site' | 'Off-page' | 'Intel'

export interface AgentBrief {
  website: string
  product: string
  goals: string[]
}

export const DEFAULT_BRIEF: AgentBrief = {
  website: 'signalor.ai',
  product:
    'GEO platform that scores and grows how ChatGPT, Gemini & Perplexity cite your brand in AI search.',
  goals: [
    'Rank in AI answers for “GEO tools”',
    'Drive 2,000 signups / month',
    'Out-cite Semrush in AI search',
  ],
}

export interface CategoryMeta {
  label: string
  pillar: Pillar
  icon: LucideIcon
}

export const CATEGORY_META: Record<ActionCategory, CategoryMeta> = {
  blog: { label: 'Blog draft', pillar: 'Content', icon: FileText },
  comparison: { label: 'Comparison page', pillar: 'Content', icon: GitCompare },
  report: { label: 'Industry report', pillar: 'Content', icon: FileBarChart },
  trending: { label: 'Trending topic', pillar: 'Content', icon: TrendingUp },
  landing: { label: 'Landing page', pillar: 'On-site', icon: Layout },
  'internal-links': { label: 'Internal links', pillar: 'On-site', icon: Link2 },
  partnerships: { label: 'Partnerships', pillar: 'Off-page', icon: Handshake },
  communities: { label: 'Communities', pillar: 'Off-page', icon: Users },
  directories: { label: 'Directories', pillar: 'Off-page', icon: List },
  'digital-pr': { label: 'Digital PR', pillar: 'Off-page', icon: Megaphone },
  competitor: { label: 'Competitor change', pillar: 'Intel', icon: Eye },
}

export interface AgentAction {
  id: string
  category: ActionCategory
  title: string
  detail: string
  /** Semrush-style headline number (est. reach / CVR / change). */
  metric: string
  /** Impact score 1–10 → shown in the Badge, used to rank the feed. */
  points: number
  effort: string
  kind: ActionKind
}

/** On-page / content / intel actions shown in full on the daily brief. */
export const AGENT_ACTIONS: AgentAction[] = [
  {
    id: 'blog-1',
    category: 'blog',
    title: 'Draft “GEO vs SEO: what changes when AI answers the query”',
    detail: '1,400-word explainer aimed at the “what is GEO” prompt cluster you rank p.2 for.',
    metric: '1.2k/mo',
    points: 10,
    effort: 'Auto',
    kind: 'draft',
  },
  {
    id: 'trend-1',
    category: 'trending',
    title: 'Publish on “ChatGPT adds shopping” — spiking in the last 48h',
    detail: '+540% searches; you have an angle on product citations none of your rivals covered.',
    metric: 'Trending',
    points: 9,
    effort: 'Auto',
    kind: 'draft',
  },
  {
    id: 'cmp-1',
    category: 'comparison',
    title: 'Create /vs/semrush — you get cited for it but have no page',
    detail: '“Signalor vs Semrush” drives ~320 AI citations/mo that land on a competitor.',
    metric: '800/mo',
    points: 8,
    effort: 'Auto',
    kind: 'draft',
  },
  {
    id: 'cmp-2',
    category: 'comparison',
    title: 'Create /vs/ahrefs for the “Ahrefs alternative” prompt',
    detail: 'Perplexity cites 3 rivals here and never you — a page closes the gap.',
    metric: '500/mo',
    points: 6,
    effort: 'Auto',
    kind: 'draft',
  },
  {
    id: 'rep-1',
    category: 'report',
    title: 'Publish a “State of AI Search Visibility 2026” data report',
    detail: 'Original data earns citations; 3 rivals shipped reports last quarter, you haven’t.',
    metric: '2k/mo',
    points: 10,
    effort: '1 h',
    kind: 'draft',
  },
  {
    id: 'landing-1',
    category: 'landing',
    title: 'Rewrite the /pricing hero to lead with the AI-visibility score',
    detail: 'The H1 buries your one differentiator; pricing ranks p.2 for “AI search tracking”.',
    metric: '3.1% CVR',
    points: 7,
    effort: '10 min',
    kind: 'draft',
  },
  {
    id: 'il-1',
    category: 'internal-links',
    title: 'Link “prompt tracking” from 4 posts to /product/prompt-tracker',
    detail: '4 blog posts mention it with no link — recover the internal equity.',
    metric: '4 links',
    points: 6,
    effort: 'Auto',
    kind: 'auto',
  },
  {
    id: 'il-3',
    category: 'internal-links',
    title: 'Point the /blog/geo-guide CTA to /sign-up, not /demo',
    detail: 'Your best-read guide sends intent to a lower-converting page.',
    metric: '1.8% CVR',
    points: 5,
    effort: 'Auto',
    kind: 'auto',
  },
  {
    id: 'il-2',
    category: 'internal-links',
    title: 'Cross-link /vs/semrush and /vs/ahrefs to each other',
    detail: 'Your two comparison pages sit orphaned — one link each lifts both.',
    metric: '2 pages',
    points: 4,
    effort: 'Auto',
    kind: 'auto',
  },
  {
    id: 'cc-4',
    category: 'competitor',
    title: 'A rival earned 14 backlinks from a single r/SEO thread',
    detail: 'The thread asks “best AI visibility tools?” — you’re not mentioned.',
    metric: '+14 links',
    points: 6,
    effort: '—',
    kind: 'open',
  },
  {
    id: 'cc-1',
    category: 'competitor',
    title: 'Semrush shipped an “AI Visibility” beta page yesterday',
    detail: 'New /features/ai-visibility overlaps your core positioning.',
    metric: 'New page',
    points: 5,
    effort: '—',
    kind: 'open',
  },
  {
    id: 'cc-3',
    category: 'competitor',
    title: 'Peec AI published 2 pages targeting your tracked prompts',
    detail: 'Both rank in Perplexity for prompts you own in ChatGPT.',
    metric: '2 pages',
    points: 5,
    effort: '—',
    kind: 'open',
  },
  {
    id: 'cc-2',
    category: 'competitor',
    title: 'Ahrefs cut “Brand Radar” pricing by 30%',
    detail: 'Their entry tier now undercuts your Starter by $9.',
    metric: '−30% price',
    points: 4,
    effort: '—',
    kind: 'open',
  },
  {
    id: 'cc-5',
    category: 'competitor',
    title: 'Writesonic added Gemini tracking (you already have it)',
    detail: 'Update your /vs/writesonic page to reclaim the comparison.',
    metric: 'Gemini',
    points: 3,
    effort: '—',
    kind: 'open',
  },
]
