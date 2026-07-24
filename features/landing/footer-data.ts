import { Github, Linkedin, Twitter } from '@/lib/icons'
import type { LucideIcon } from '@/lib/icons'

export interface FooterLink {
  href: string
  label: string
  external?: boolean
}

export interface FooterColumn {
  title: string
  links: FooterLink[]
}

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: 'Platform',
    links: [
      { href: '/sign-up', label: 'Get started' },
      { href: '/pricing', label: 'Pricing' },
      { href: '/dashboard/integrations', label: 'Integrations' },
      { href: '/dashboard/prompt-tracker', label: 'Prompt tracking' },
      { href: '/dashboard/visibility', label: 'AI visibility' },
      { href: '/dashboard/recommendations', label: 'Recommendations' },
    ],
  },
  {
    title: 'Solutions',
    links: [
      { href: '/solutions/agencies', label: 'Agencies' },
      { href: '/solutions/brands', label: 'Brands' },
      { href: '/solutions/growth', label: 'SEO & growth teams' },
      { href: 'mailto:hello@signalor.ai', label: 'Contact sales', external: true },
    ],
  },
  {
    title: 'Free tools',
    links: [
      { href: '/tools', label: 'All free tools' },
      { href: '/tools/url-analyzer', label: 'URL analyzer' },
      { href: '/tools/llms-check', label: 'LLM checker' },
      { href: '/tools/competitors-analysis', label: 'Competitors analysis' },
      { href: '/tools/schema-validator', label: 'Schema validator' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { href: '/blog', label: 'Blog' },
      { href: '/docs', label: 'Documentation' },
      { href: '/changelog', label: 'Changelog' },
      { href: '/about-us', label: 'About us' },
    ],
  },
]

export const SOCIAL: Array<{ href: string; label: string; icon: LucideIcon }> = [
  { href: 'https://x.com/SignalorAI', label: 'X (Twitter)', icon: Twitter },
  { href: 'https://www.linkedin.com/in/signalorai/', label: 'LinkedIn', icon: Linkedin },
  { href: 'https://github.com/signalorai', label: 'Github', icon: Github },
]
