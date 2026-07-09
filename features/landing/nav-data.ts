export interface MenuLink {
  label: string
  desc: string
  href: string
  badge?: string
}

export interface MenuColumn {
  title: string
  links: MenuLink[]
}

export const PRODUCT_COLS: MenuColumn[] = [
  {
    title: 'Product',
    links: [
      {
        label: 'AI Visibility',
        desc: 'Track how you show up in AI',
        href: '/ai-visibility',
      },
      {
        label: 'Prompt Tracker',
        desc: 'Watch how engines answer',
        href: '/prompt-tracking',
        badge: 'New',
      },
      {
        label: 'Competitors',
        desc: 'Benchmark your share of voice',
        href: '/solutions/competitive-lens',
      },
      { label: 'Sitemap Audit', desc: 'Score every page for AI', href: '/site-map' },
    ],
  },
]

export const RESOURCE_COLS: MenuColumn[] = [
  {
    title: 'Resources',
    links: [
      { label: 'Blog', desc: 'The latest GEO research', href: '/blog' },
      { label: 'Guides', desc: 'Playbooks & strategy', href: '/guides' },
      { label: 'Videos', desc: 'Product walkthroughs', href: '/videos' },
    ],
  },
  {
    title: 'Product',
    links: [
      { label: 'Docs', desc: 'How the platform works', href: '/docs' },
      { label: 'Integrations', desc: 'Connect your stack', href: '/integration' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Community', desc: 'Join the Slack', href: '/community' },
      { label: 'Help Center', desc: 'Find answers fast', href: '/help' },
    ],
  },
  {
    title: 'Free tools',
    links: [{ label: 'GEO Report', desc: 'Instant brand audit', href: '/explorer', badge: 'Free' }],
  },
]

export const PRICING_LINKS: MenuLink[] = [
  { label: 'For Agencies', desc: 'Track AI search for clients', href: '/for-agencies' },
  { label: 'For Brands', desc: 'Learn how AI talks about you', href: '/for-brands' },
]
