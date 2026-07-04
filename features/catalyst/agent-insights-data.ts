import { BLUE, BRAND, GREEN, NEG, PURPLE, YELLOW } from '@/features/catalyst/constants'

const TEAL = '#1FA8A0'
const GRAY = '#94A3B8'

export interface RankRow {
  name: string
  value: string
  color: string
  owned?: boolean
}

export interface AllocItem {
  name: string
  pct: number
  color: string
}

/** Visibility score line — how often the brand appears in AI answers over ~2 weeks. */
export const VISIBILITY_SCORE = {
  value: '68.4%',
  series: [42, 45, 43, 48, 46, 51, 49, 54, 52, 58, 56, 61, 60, 64, 63, 68],
  axis: ['Feb 12', 'Feb 13', 'Feb 14', 'Feb 15', 'Feb 16', 'Feb 17', 'Feb 18'],
}

export const VISIBILITY_RANK: RankRow[] = [
  { name: 'Signalor', value: '72.1%', color: BRAND, owned: true },
  { name: 'Peec AI', value: '68.4%', color: PURPLE },
  { name: 'Otterly', value: '63.2%', color: TEAL },
  { name: 'Profound', value: '59.8%', color: BLUE },
  { name: 'Semrush', value: '55.5%', color: YELLOW },
  { name: 'Ahrefs', value: '52.9%', color: NEG },
  { name: 'Writesonic', value: '48.3%', color: GRAY },
]

export const SHARE_OF_VOICE = {
  headline: '34%',
  delta: '+1.2%',
  positive: true,
  items: [
    { name: 'Signalor', pct: 34, color: BRAND },
    { name: 'Peec AI', pct: 22, color: PURPLE },
    { name: 'Otterly', pct: 16, color: TEAL },
    { name: 'Profound', pct: 12, color: BLUE },
    { name: 'Semrush', pct: 9, color: YELLOW },
    { name: 'Others', pct: 7, color: GRAY },
  ] as AllocItem[],
}

export const SHARE_OF_VOICE_RANK: RankRow[] = [
  { name: 'Signalor', value: '34%', color: BRAND, owned: true },
  { name: 'Peec AI', value: '22%', color: PURPLE },
  { name: 'Otterly', value: '16%', color: TEAL },
  { name: 'Profound', value: '12%', color: BLUE },
  { name: 'Semrush', value: '9%', color: YELLOW },
  { name: 'Others', value: '7%', color: GRAY },
]

export const PLATFORMS: AllocItem[] = [
  { name: 'ChatGPT', pct: 62, color: BRAND },
  { name: 'Perplexity', pct: 18, color: TEAL },
  { name: 'Gemini', pct: 12, color: PURPLE },
  { name: 'Copilot', pct: 6, color: BLUE },
  { name: 'Others', pct: 2, color: GRAY },
]

export const PLATFORMS_RANK: RankRow[] = [
  { name: 'ChatGPT', value: '62.1%', color: BRAND },
  { name: 'Perplexity', value: '18.4%', color: TEAL },
  { name: 'Gemini', value: '12.2%', color: PURPLE },
  { name: 'Copilot', value: '6.1%', color: BLUE },
  { name: 'Others', value: '1.2%', color: GRAY },
]

export const SENTIMENT: AllocItem[] = [
  { name: 'Positive', pct: 68, color: GREEN },
  { name: 'Neutral', pct: 24, color: GRAY },
  { name: 'Negative', pct: 8, color: NEG },
]

export const PROMPTS_RANK: RankRow[] = [
  { name: '“best AI visibility tools”', value: '74%', color: BRAND },
  { name: '“how to rank in ChatGPT”', value: '66%', color: PURPLE },
  { name: '“GEO vs SEO”', value: '61%', color: TEAL },
  { name: '“track brand in Perplexity”', value: '58%', color: BLUE },
  { name: '“AI search optimization”', value: '52%', color: YELLOW },
  { name: '“LLM citation tracking”', value: '47%', color: GRAY },
]

export const REGIONS_RANK: RankRow[] = [
  { name: 'United States', value: '71%', color: BRAND },
  { name: 'United Kingdom', value: '64%', color: BLUE },
  { name: 'Germany', value: '58%', color: PURPLE },
  { name: 'India', value: '55%', color: TEAL },
  { name: 'Canada', value: '52%', color: YELLOW },
  { name: 'Australia', value: '49%', color: GRAY },
]

export const PERSONAS_RANK: RankRow[] = [
  { name: 'SEO managers', value: '69%', color: BRAND },
  { name: 'Growth marketers', value: '63%', color: PURPLE },
  { name: 'Founders', value: '58%', color: TEAL },
  { name: 'Content leads', value: '54%', color: BLUE },
  { name: 'Agencies', value: '51%', color: YELLOW },
  { name: 'PR teams', value: '46%', color: GRAY },
]

export const CITATIONS_RANK: RankRow[] = [
  { name: 'reddit.com/r/SEO', value: '128', color: BRAND },
  { name: 'g2.com', value: '96', color: PURPLE },
  { name: 'producthunt.com', value: '74', color: TEAL },
  { name: 'medium.com', value: '61', color: BLUE },
  { name: 'news.ycombinator.com', value: '52', color: YELLOW },
  { name: 'indiehackers.com', value: '41', color: GRAY },
]

export const INSIGHT_TABS = [
  'Visibility',
  'Prompts',
  'Platforms',
  'Regions',
  'Personas',
  'Sentiment',
  'Citations',
] as const

export type InsightTab = (typeof INSIGHT_TABS)[number]
