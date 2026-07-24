import { GREEN, NEG, YELLOW } from '@/features/catalyst/constants'
import { Globe, MessageSquare, Search } from '@/lib/icons'
import type { LucideIcon } from '@/lib/icons'

/** Score → semantic hue: ≥70 green, ≥40 amber, else red. */
export function scoreColor(value: number): string {
  if (value >= 70) return GREEN
  if (value >= 40) return YELLOW
  return NEG
}

/** Score → short qualitative status. */
export function scoreStatus(value: number): string {
  if (value >= 70) return 'Strong'
  if (value >= 40) return 'Moderate'
  if (value > 0) return 'Low'
  return 'None'
}

export interface SubStat {
  value: string
  label: string
}

/* ------------------------------------------------------------- hero metrics */
export const OVERALL = {
  score: 55,
  delta: '2.4%',
  positive: false,
  detected: 0,
  total: 6,
}

export interface SovBar {
  name: string
  value: number
}

export const SOV: SovBar[] = [
  { name: 'ChatGPT', value: 3 },
  { name: 'Gemini', value: 0 },
  { name: 'Perplexity', value: 0 },
  { name: 'Claude', value: 2 },
  { name: 'Google', value: 0 },
  { name: 'Bing', value: 0 },
]

export const SOV_META = { avg: '2%', prompts: '2 / 80 prompts', delta: '0.5%', positive: true }

export const MENTIONS = {
  count: 2,
  delta: '1',
  positive: true,
  platforms: 3,
  trend: [1, 0, 1, 1, 2, 1, 2, 2, 3],
}

/* ------------------------------------------------------- platform score cards */
export interface PlatformScore {
  key: string
  icon: LucideIcon
  name: string
  score: number
  delta: string
  positive: boolean
  badge: boolean
  substats: [SubStat, SubStat, SubStat]
}

export const PLATFORM_SCORES: PlatformScore[] = [
  {
    key: 'google',
    icon: Search,
    name: 'Google',
    score: 75,
    delta: '2.1%',
    positive: true,
    badge: true,
    substats: [
      { value: '#1', label: 'Brand Rank' },
      { value: '10', label: 'Indexed' },
      { value: '8/10', label: 'In SERP' },
    ],
  },
  {
    key: 'web',
    icon: Globe,
    name: 'Web',
    score: 65,
    delta: '0.8%',
    positive: false,
    badge: true,
    substats: [
      { value: '15', label: 'Mentions' },
      { value: '3', label: 'Types' },
      { value: '15', label: 'Domains' },
    ],
  },
  {
    key: 'reddit',
    icon: MessageSquare,
    name: 'Reddit',
    score: 0,
    delta: '0%',
    positive: false,
    badge: false,
    substats: [
      { value: '0', label: 'Threads' },
      { value: '0', label: 'Upvotes' },
      { value: '—', label: 'Sentiment' },
    ],
  },
]
