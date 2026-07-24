import {
  IconAppsFilled,
  IconBugFilled,
  IconChartPieFilled,
  IconEyeFilled,
  IconLayoutGridFilled,
  IconLinkFilled,
  IconMessageCircleFilled,
  IconPencilFilled,
  IconRosetteDiscountCheckFilled,
  IconShoppingCartFilled,
  IconSquareRoundedCheckFilled,
  IconUsersGroup,
} from '@tabler/icons-react'
import type { TablerIcon } from '@tabler/icons-react'

import { Facebook, Instagram, Search, Store } from '@/lib/icons'
import type { LucideIcon } from '@/lib/icons'

/* ------------------------------------------------------------------ tokens */
/* Brand pulled from the auth (sign-in / sign-up) theme: --primary #e04a3d,
   .auth-cta-btn hover #c53f34 / active #b9382d, tint = bg-primary/10. */
export const BRAND = '#e04a3d'
export const BRAND_STRONG = '#c53f34'
export const BRAND_SOFT = 'rgba(224, 74, 61, 0.10)'
export const GREEN = '#2FBE7E'
export const YELLOW = '#F6B93B'
export const BLUE = '#3B9EF6'
export const PURPLE = '#8B5CF6'
export const POS = '#2FBE7E'
export const POS_BG = '#E7F7EF'
export const NEG = '#E5484D'
export const NEG_BG = '#FDECEC'

/* -------------------------------------------------------------------- types */
export interface NavEntry {
  icon: TablerIcon
  label: string
  href: string
  badge?: number
  /** Extra brand-relative paths that also count as "on this page" (drill-downs). */
  alsoMatch?: string[]
}

export interface ChannelRow {
  icon: LucideIcon
  name: string
  amount: string
  change: string
  positive: boolean
}

export interface SplitRow {
  label: string
  pct: string
  change: string
  positive: boolean
  color: string
}

export interface FunnelRow {
  name: string
  num: string
  change: string
  positive: boolean
}

export interface TableRow {
  name: string
  icon: LucideIcon
  color: string
  percent: string
  total: string
}

/* --------------------------------------------------------------------- data */
export const MAIN_NAV: NavEntry[] = [
  // Pillars + GEO detail pages are Overview drill-downs, so Overview stays lit.
  { icon: IconLayoutGridFilled, label: 'Overview', href: '', alsoMatch: ['pillars', 'geo'] },
]

// Visibility now hosts Prompt Tracking, Sitemap and Analytics as in-page tabs
// (see MonitoringTabs), so they are no longer separate sidebar entries.
export const MONITORING_NAV: NavEntry[] = [
  { icon: IconEyeFilled, label: 'Visibility', href: 'visibility' },
  { icon: IconChartPieFilled, label: '360 Insights', href: 'insights' },
  { icon: IconBugFilled, label: 'Crawler Logs', href: 'crawlers' },
  { icon: IconUsersGroup, label: 'Competitors', href: 'competitors' },
  { icon: IconRosetteDiscountCheckFilled, label: 'Brand Profile', href: 'brand-profile' },
]

// Actions (the plan + tasks board) stays a top-level entry so its open-task
// badge is always visible — it's the core "do the work" surface.
export const ACTIONS_NAV: NavEntry = {
  icon: IconSquareRoundedCheckFilled,
  label: 'Actions',
  href: 'actions',
  alsoMatch: ['tasks', 'agent'],
}

export const OPTIMIZATION_NAV: NavEntry[] = [
  { icon: IconPencilFilled, label: 'Content', href: 'optimisation' },
  { icon: IconShoppingCartFilled, label: 'Shopping', href: 'shopping' },
  { icon: IconLinkFilled, label: 'Backlinks', href: 'backlinks' },
]

// Integrations stands alone at the top level (it's the connect-your-stack hub,
// not an optimisation surface).
export const INTEGRATIONS_NAV: NavEntry = {
  icon: IconAppsFilled,
  label: 'Integrations',
  href: 'integrations',
}

export const SOCIALS_NAV: NavEntry[] = [
  { icon: IconMessageCircleFilled, label: 'Reddit', href: 'socials/reddit' },
]

export const SALES_LINE: number[] = [
  60, 40, 66, 30, 58, 20, 52, 44, 70, 34, 62, 26, 54, 42, 64, 28, 50, 36, 58, 44,
]

export const SALES_CHANNELS: ChannelRow[] = [
  { icon: Store, name: 'Online Store', amount: '$52.12', change: '+4.5%', positive: true },
  { icon: Facebook, name: 'Facebook', amount: '$38.45', change: '-2.8%', positive: false },
  { icon: Instagram, name: 'Instagram', amount: '$37.75', change: '+3.2%', positive: true },
]

export const VISITOR_SPLIT: SplitRow[] = [
  { label: 'Desktop', pct: '27%', change: '-3.2%', positive: false, color: YELLOW },
  { label: 'Tablet', pct: '12%', change: '-6.4%', positive: false, color: BLUE },
  { label: 'Mobile', pct: '61%', change: '+0.8%', positive: true, color: PURPLE },
]

export const FUNNEL: FunnelRow[] = [
  { name: 'Added to Cart', num: '3,842', change: '+1.8%', positive: true },
  { name: 'Reached Checkout', num: '1,256', change: '-1.2%', positive: false },
  { name: 'Purchased', num: '649', change: '+2.4%', positive: true },
]

export const CHANNEL_TABLE: TableRow[] = [
  { name: 'Facebook', icon: Facebook, color: BLUE, percent: '28%', total: '6,958' },
  { name: 'Instagram', icon: Instagram, color: PURPLE, percent: '23%', total: '5,716' },
  { name: 'Google', icon: Search, color: BRAND, percent: '32%', total: '7,952' },
]

// Weekly Visitors radar: New vs Returning visitors across the days of the week.
export const RADAR_AXES: string[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
export const RADAR_NEW: number[] = [0.7, 0.85, 0.6, 0.78, 0.92, 0.5, 0.45]
export const RADAR_RETURNING: number[] = [0.5, 0.6, 0.72, 0.55, 0.68, 0.82, 0.6]

// Conversion Rate area chart — one value per month tick (FEB…JUL).
export const CONV_SERIES: number[] = [26, 34, 30, 40, 72, 52]

export const CURRENT_USER = {
  name: 'James Brown',
  email: 'james@signalor.com',
  avatar: 'https://i.pravatar.cc/80?img=12',
}
