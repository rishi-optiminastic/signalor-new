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

export const INSIGHT_TABS = ['Platforms', 'Regions', 'Personas', 'Sentiment', 'Citations'] as const

export type InsightTab = (typeof INSIGHT_TABS)[number]
