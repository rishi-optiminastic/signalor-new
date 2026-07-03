import {
  CheckCircle2,
  Chrome,
  Globe,
  Hash,
  HelpCircle,
  Layers,
  Link2,
  Linkedin,
  MessageSquare,
  Search,
  TrendingUp,
  Twitter,
  Youtube,
  Zap,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { GREEN, NEG, YELLOW } from '@/features/catalyst/constants'

/** Score → semantic hue: ≥70 green, ≥40 amber, else red. */
export function scoreColor(value: number): string {
  if (value >= 70) return GREEN
  if (value >= 40) return YELLOW
  return NEG
}

/** Score → short qualitative status shown under each gauge. */
export function scoreStatus(value: number): string {
  if (value >= 70) return 'Strong'
  if (value >= 40) return 'Moderate'
  if (value > 0) return 'Low'
  return 'None'
}

/* -------------------------------------------------------------- top scores */
export const OVERALL = {
  brand: 'Signalor',
  score: 55,
  platformsDetected: 0,
  platformsTotal: 6,
}

export interface ScoreCardData {
  label: string
  icon: LucideIcon
  value: number
  unit: string
}

export const SCORE_CARDS: ScoreCardData[] = [
  { label: 'Google Score', icon: Search, value: 75, unit: '/100' },
  { label: 'Reddit Score', icon: MessageSquare, value: 0, unit: '/100' },
  { label: 'Web Score', icon: Globe, value: 65, unit: '/100' },
  { label: 'Coverage', icon: Zap, value: 0, unit: '%' },
]

/* ------------------------------------------------------- AI engine signals */
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

export const SIGNALS_META = { prompts: '2/80 prompts', avgSov: '2% avg SOV', mentions: 2 }

export interface ReachItem {
  name: string
  icon: LucideIcon
}

export const PLATFORM_REACH: ReachItem[] = [
  { name: 'Google', icon: Chrome },
  { name: 'Reddit', icon: MessageSquare },
  { name: 'Quora', icon: HelpCircle },
  { name: 'LinkedIn', icon: Linkedin },
  { name: 'YouTube', icon: Youtube },
  { name: 'X', icon: Twitter },
]

/* ----------------------------------------------------------- platform deep */
export interface Tile {
  icon: LucideIcon
  value: string
  label: string
}
export interface Bar {
  label: string
  value: number
}
export interface Flag {
  label: string
  on: boolean
}
export interface ByType {
  label: string
  count: number
}
export interface TopLink {
  title: string
  domain: string
}

export const GOOGLE = {
  score: 75,
  tiles: [
    { icon: TrendingUp, value: '#1', label: 'Brand Rank' },
    { icon: Search, value: '10', label: 'Indexed' },
    { icon: CheckCircle2, value: '8/10', label: 'In SERP' },
  ] as Tile[],
  flags: [
    { label: 'Knowledge', on: false },
    { label: 'AI Overview', on: true },
  ] as Flag[],
  breakdown: [
    { label: 'Site Index', value: 20 },
    { label: 'Brand Dominance', value: 80 },
    { label: 'Brand Search Rank', value: 100 },
  ] as Bar[],
}

export const WEB = {
  score: 65,
  tiles: [
    { icon: Hash, value: '15', label: 'Mentions' },
    { icon: Layers, value: '3', label: 'Types' },
    { icon: Link2, value: '15', label: 'Domains' },
  ] as Tile[],
  breakdown: [
    { label: 'Mention Volume', value: 75 },
    { label: 'Source Authority', value: 57 },
    { label: 'Platform Diversity', value: 60 },
  ] as Bar[],
  byType: [
    { label: 'Other', count: 7 },
    { label: 'Review Sites', count: 5 },
    { label: 'Social Media', count: 3 },
  ] as ByType[],
  topLinks: [
    { title: 'Signalor AI | LinkedIn', domain: 'linkedin.com' },
    { title: 'Signalor AI - Crunchbase Company Profile & Funding', domain: 'crunchbase.com' },
    {
      title: 'Signalor AI - AI-powered insights for your business | Product Hunt',
      domain: 'producthunt.com',
    },
    { title: 'Signalor AI - StartupBase', domain: 'startupbase.io' },
  ] as TopLink[],
}

export const REDDIT = { score: 0 }
