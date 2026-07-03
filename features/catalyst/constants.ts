import {
  AppWindow,
  BarChart3,
  Boxes,
  Clock,
  Facebook,
  Instagram,
  LayoutGrid,
  ListChecks,
  Search,
  Store,
  Tag,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

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
  icon: LucideIcon
  label: string
  href: string
  badge?: number
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
  { icon: LayoutGrid, label: 'Overview', href: '/catalyst' },
  { icon: ListChecks, label: 'Tasks', href: '/catalyst/tasks', badge: 7 },
  { icon: BarChart3, label: 'Analytics', href: '#' },
  { icon: Boxes, label: 'Products', href: '#' },
  { icon: Clock, label: 'Orders', href: '#' },
  { icon: Tag, label: 'Discounts', href: '#' },
  { icon: AppWindow, label: 'Apps', href: '#' },
]

export const CHANNEL_NAV: NavEntry[] = [
  { icon: Facebook, label: 'Facebook', href: '#' },
  { icon: Store, label: 'Online Store', href: '#' },
  { icon: Instagram, label: 'Instagram', href: '#' },
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

export const RADAR_AXES: string[] = [
  'Happiness',
  'Sadness',
  'Anger',
  'Fear',
  'Surprise',
  'Disgust',
  'Love',
  'Excitement',
]
export const RADAR_NEW: number[] = [0.85, 0.55, 0.7, 0.5, 0.75, 0.45, 0.65, 0.6]
export const RADAR_RETURNING: number[] = [0.6, 0.7, 0.5, 0.65, 0.5, 0.6, 0.8, 0.45]
