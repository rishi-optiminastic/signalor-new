export type IntegrationGroup = 'Platforms' | 'Analytics' | 'Automation & alerts'

export interface Integration {
  slug: string
  name: string
  group: IntegrationGroup
  logo: string
  description: string
  /** Brand accent used for the logo tint + hover accent line. */
  accent: string
}

/**
 * A catalog entry plus live connection state from the backend.
 *
 * `connected` deliberately lives here and not on `Integration`: the catalog is a
 * static list, and a hardcoded flag on it can only ever be a guess that drifts
 * from reality (Google Analytics shipped as `connected: true` for everyone).
 */
export type IntegrationWithStatus = Integration & { connected: boolean }

export const INTEGRATION_GROUPS: IntegrationGroup[] = [
  'Platforms',
  'Analytics',
  'Automation & alerts',
]

export const INTEGRATIONS: Integration[] = [
  // ── Platforms ──────────────────────────────────────────────
  {
    slug: 'shopify',
    name: 'Shopify',
    group: 'Platforms',
    logo: '/logos/shopify.svg',
    description: 'Connect your store to auto-fix SEO/GEO issues and inject schema.',
    accent: '#95BF47',
  },
  {
    slug: 'wordpress',
    name: 'WordPress',
    group: 'Platforms',
    logo: '/logos/wordpress.svg',
    description: 'Install the SignalorAI plugin to apply fixes and serve llms.txt.',
    accent: '#21759B',
  },
  {
    slug: 'webflow',
    name: 'Webflow',
    group: 'Platforms',
    logo: '/logos/webflow.svg',
    description: 'Run GEO analysis on your Webflow site — no plugin required.',
    accent: '#146EF5',
  },
  {
    slug: 'framer',
    name: 'Framer',
    group: 'Platforms',
    logo: '/logos/framer.svg',
    description: 'Connect your Framer site via the SignalorAI plugin.',
    accent: '#0055FF',
  },
  {
    slug: 'nextjs',
    name: 'Next.js',
    group: 'Platforms',
    logo: '/logos/nextjs.svg',
    description: 'Drop in the SignalorAI SDK to instrument your app.',
    accent: '#111827',
  },
  // ── Analytics ──────────────────────────────────────────────
  {
    slug: 'google-analytics',
    name: 'Google Analytics',
    group: 'Analytics',
    logo: '/logos/google-analytics.svg',
    description: 'Track AI-referral traffic from ChatGPT, Perplexity and more.',
    accent: '#E8710A',
  },
  {
    slug: 'search-console',
    name: 'Search Console',
    group: 'Analytics',
    logo: '/logos/search-console.svg',
    description: 'Monitor indexing, impressions and search performance.',
    accent: '#458CF5',
  },
  // ── Automation & alerts ────────────────────────────────────
  {
    slug: 'slack',
    name: 'Slack',
    group: 'Automation & alerts',
    logo: '/logos/slack.svg',
    description: 'Get visibility drops and task updates in your channels.',
    accent: '#4A154B',
  },
  {
    slug: 'zapier',
    name: 'Zapier',
    group: 'Automation & alerts',
    logo: '/logos/zapier.svg',
    description: 'Pipe SignalorAI events into 6,000+ apps and workflows.',
    accent: '#FF4A00',
  },
]
