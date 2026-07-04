import type { DashStatData } from '@/features/catalyst/components/dash/DashStat'

/* ------------------------------------------------------------- communities */
export interface Community {
  id: string
  name: string
  platform: string
  members: string
  relevance: number
  activity: 'High' | 'Medium' | 'Low'
  hook: string
}

export const COMMUNITIES: Community[] = [
  {
    id: 'c1',
    name: 'r/SEO',
    platform: 'Reddit',
    members: '340k',
    relevance: 94,
    activity: 'High',
    hook: 'Live thread: “best AI visibility tools?” — 40 comments',
  },
  {
    id: 'c2',
    name: 'r/bigseo',
    platform: 'Reddit',
    members: '82k',
    relevance: 90,
    activity: 'Medium',
    hook: 'Weekly “what’s working in GEO” discussion',
  },
  {
    id: 'c3',
    name: 'Indie Hackers',
    platform: 'Forum',
    members: '120k',
    relevance: 86,
    activity: 'High',
    hook: '3 founders asking how to rank in ChatGPT',
  },
  {
    id: 'c4',
    name: 'r/marketing',
    platform: 'Reddit',
    members: '1.1m',
    relevance: 78,
    activity: 'High',
    hook: 'Thread on AI answers stealing organic clicks',
  },
  {
    id: 'c5',
    name: 'Hacker News',
    platform: 'HN',
    members: '—',
    relevance: 74,
    activity: 'High',
    hook: 'Front-page post: “LLMs are the new SERP”',
  },
  {
    id: 'c6',
    name: 'r/ChatGPT',
    platform: 'Reddit',
    members: '9.2m',
    relevance: 71,
    activity: 'High',
    hook: 'Users comparing how brands get cited',
  },
  {
    id: 'c7',
    name: 'Demand Curve',
    platform: 'Slack',
    members: '30k',
    relevance: 83,
    activity: 'Medium',
    hook: '#seo channel debating GEO measurement',
  },
  {
    id: 'c8',
    name: 'r/artificial',
    platform: 'Reddit',
    members: '900k',
    relevance: 68,
    activity: 'Medium',
    hook: 'Discussion on citation transparency in LLMs',
  },
  {
    id: 'c9',
    name: 'MarketingProfs',
    platform: 'Slack',
    members: '15k',
    relevance: 72,
    activity: 'Low',
    hook: 'Members asking for AI-search case studies',
  },
  {
    id: 'c10',
    name: 'GrowthHackers',
    platform: 'Forum',
    members: '55k',
    relevance: 66,
    activity: 'Low',
    hook: 'Old GEO thread ripe for a fresh answer',
  },
]

/* ------------------------------------------------------------- partnerships */
export interface Partner {
  id: string
  name: string
  type: 'Co-marketing' | 'Integration' | 'Backlink swap' | 'Newsletter'
  overlap: number
  audience: string
  note: string
}

export const PARTNERSHIPS: Partner[] = [
  {
    id: 'p1',
    name: 'Peec AI',
    type: 'Co-marketing',
    overlap: 68,
    audience: '18k GEO marketers',
    note: 'Adjacent tool, no direct overlap — joint “state of GEO” webinar',
  },
  {
    id: 'p2',
    name: 'Demand Curve',
    type: 'Newsletter',
    overlap: 54,
    audience: '90k growth readers',
    note: 'Sponsor their AI-search issue; they cover tooling monthly',
  },
  {
    id: 'p3',
    name: 'SEOFOMO',
    type: 'Newsletter',
    overlap: 61,
    audience: '230k SEOs',
    note: 'Aleyda features new AI-search tools — pitch a tip, not an ad',
  },
  {
    id: 'p4',
    name: 'Shopify App Store',
    type: 'Integration',
    overlap: 44,
    audience: '2M merchants',
    note: 'Ship a GEO app; merchants ask about ChatGPT visibility',
  },
  {
    id: 'p5',
    name: 'Content Machine',
    type: 'Backlink swap',
    overlap: 39,
    audience: 'DA 61 agency blog',
    note: 'Guest-swap a GEO explainer for a tools roundup slot',
  },
]

/* --------------------------------------------------------------- directories */
export type SubmitStatus = 'not-submitted' | 'submitted' | 'live'

export interface Directory {
  id: string
  name: string
  da: number
  traffic: string
  category: string
  status: SubmitStatus
}

export const DIRECTORIES: Directory[] = [
  {
    id: 'd1',
    name: 'Futurepedia',
    da: 72,
    traffic: '1.1M/mo',
    category: 'AI tools',
    status: 'not-submitted',
  },
  {
    id: 'd2',
    name: "There's An AI For That",
    da: 76,
    traffic: '3.4M/mo',
    category: 'AI tools',
    status: 'not-submitted',
  },
  {
    id: 'd3',
    name: 'G2 — SEO Software',
    da: 91,
    traffic: '12M/mo',
    category: 'Software',
    status: 'not-submitted',
  },
  {
    id: 'd4',
    name: 'Product Hunt',
    da: 91,
    traffic: '9M/mo',
    category: 'Launch',
    status: 'submitted',
  },
  {
    id: 'd5',
    name: 'AlternativeTo',
    da: 84,
    traffic: '6M/mo',
    category: 'Alternatives',
    status: 'live',
  },
  { id: 'd6', name: 'SaaSHub', da: 62, traffic: '600k/mo', category: 'SaaS', status: 'live' },
]

/* ---------------------------------------------------------------- digital PR */
export interface PrOpp {
  id: string
  outlet: string
  angle: string
  deadline: string
  relevance: number
  type: 'Reporter' | 'Podcast' | 'Report' | 'Award'
}

export const PR_OPPORTUNITIES: PrOpp[] = [
  {
    id: 'pr1',
    outlet: 'TechCrunch',
    angle: 'Reporter wants a source on how AI search reshapes SEO budgets',
    deadline: 'Fri',
    relevance: 92,
    type: 'Reporter',
  },
  {
    id: 'pr2',
    outlet: 'The GEO Podcast',
    angle: 'Guest slot open — walk through measuring AI citations',
    deadline: 'Next week',
    relevance: 84,
    type: 'Podcast',
  },
  {
    id: 'pr3',
    outlet: 'Search Engine Land',
    angle: 'Contribute data from your “State of AI Search” report',
    deadline: '2 weeks',
    relevance: 79,
    type: 'Report',
  },
  {
    id: 'pr4',
    outlet: 'Product Hunt Golden Kitty',
    angle: 'Nominations open in AI category — rally your users',
    deadline: 'Dec 20',
    relevance: 70,
    type: 'Award',
  },
]

export const COMMUNITIES_STATS: DashStatData[] = [
  { label: 'Relevant communities', value: '10' },
  { label: 'Live threads to join', value: '4', delta: 'today', positive: true },
  { label: 'Est. reach', value: '2.1M' },
  { label: 'You’re mentioned in', value: '1 / 10' },
]

export const PARTNERSHIPS_STATS: DashStatData[] = [
  { label: 'Warm opportunities', value: '5' },
  { label: 'Best audience fit', value: '68%', delta: 'Peec AI', positive: true },
  { label: 'Combined reach', value: '2.5M' },
  { label: 'Outreach drafted', value: '0 / 5' },
]

export const DIRECTORIES_STATS: DashStatData[] = [
  { label: 'To submit', value: '3' },
  { label: 'Submitted', value: '1' },
  { label: 'Live listings', value: '2', delta: 'indexed', positive: true },
  { label: 'Avg. domain rating', value: '79' },
]

export const PR_STATS: DashStatData[] = [
  { label: 'Open opportunities', value: '4' },
  { label: 'Closing this week', value: '1', delta: 'TechCrunch', positive: true },
  { label: 'Top relevance', value: '92%' },
  { label: 'Pitches drafted', value: '0 / 4' },
]
