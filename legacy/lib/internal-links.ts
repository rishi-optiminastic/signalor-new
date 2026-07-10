// Central catalog for contextual internal linking (topic clusters).
//
// The marketing site's primary nav is a JS-only mega-menu, so contextual
// cross-links between related pages are the main way crawlers (and humans)
// move between tools, features, and solutions. Curated descriptive anchors
// here flow internal PageRank to the pages we want ranking and strengthen
// topical relevance. Rendered by <RelatedLinks /> at the bottom of each page.

export type RelatedLink = { href: string; title: string; desc: string }

// Canonical anchor text + blurb for every linkable destination, keyed by path.
const CATALOG: Record<string, RelatedLink> = {
  '/ai-visibility': {
    href: '/ai-visibility',
    title: 'AI visibility scoring',
    desc: 'Score how ChatGPT, Claude, Gemini & Perplexity cite your brand.',
  },
  '/recommendations': {
    href: '/recommendations',
    title: 'GEO fix recommendations',
    desc: 'An impact-ranked queue of fixes that lift your AI citations.',
  },
  '/prompt-tracking': {
    href: '/prompt-tracking',
    title: 'Prompt tracking',
    desc: 'Track the prompts that surface your brand across AI engines.',
  },
  '/integration': {
    href: '/integration',
    title: 'Shopify & WordPress integrations',
    desc: 'Sync your catalog and apply one-click schema fixes in-platform.',
  },
  '/integration/shopify': {
    href: '/integration/shopify',
    title: 'Shopify integration',
    desc: 'GEO scoring and schema fixes wired into your Shopify storefront.',
  },
  '/integration/wordpress': {
    href: '/integration/wordpress',
    title: 'WordPress plugin',
    desc: 'GEO recommendations and one-click JSON-LD fixes inside WP admin.',
  },
  '/tools': {
    href: '/tools',
    title: 'Free GEO & AI-visibility tools',
    desc: 'All free, no-signup checks: GEO score, llms.txt, schema, competitors & DR.',
  },
  '/tools/url-analyzer': {
    href: '/tools/url-analyzer',
    title: 'Free URL analyzer',
    desc: 'Paste any URL for an instant GEO & AI visibility score.',
  },
  '/tools/llms-check': {
    href: '/tools/llms-check',
    title: 'Free llms.txt checker',
    desc: 'Check your llms.txt and LLM readiness in seconds.',
  },
  '/tools/competitors-analysis': {
    href: '/tools/competitors-analysis',
    title: 'Free competitor analysis',
    desc: 'Compare your AI citation share against rivals.',
  },
  '/tools/schema-validator': {
    href: '/tools/schema-validator',
    title: 'Free schema validator',
    desc: 'Validate your JSON-LD and schema.org coverage for AI.',
  },
  '/tools/domain-rating': {
    href: '/tools/domain-rating',
    title: 'Free domain rating checker',
    desc: "Check any domain's authority score (DR) & global rank.",
  },
  '/solutions/visibility': {
    href: '/solutions/visibility',
    title: 'Visibility for brands',
    desc: 'Monitor and grow how AI search represents your brand.',
  },
  '/solutions/fix-playbook': {
    href: '/solutions/fix-playbook',
    title: 'GEO fix playbook',
    desc: 'A prioritized playbook of GEO fixes your team can ship.',
  },
  '/solutions/competitive-lens': {
    href: '/solutions/competitive-lens',
    title: 'Competitive lens for agencies',
    desc: 'Benchmark citation share and find competitor gaps.',
  },
  '/pricing': {
    href: '/pricing',
    title: 'Pricing',
    desc: 'Plans for every team shipping a serious AI visibility program.',
  },
  '/blog': {
    href: '/blog',
    title: 'GEO blog & playbooks',
    desc: 'Research drops and playbooks for AI search visibility.',
  },
}

// Per-page related destinations (topic clusters). Keep to 3-4 relevant links.
const RELATED: Record<string, string[]> = {
  '/ai-visibility': [
    '/recommendations',
    '/prompt-tracking',
    '/tools/url-analyzer',
    '/solutions/visibility',
  ],
  '/recommendations': [
    '/ai-visibility',
    '/integration',
    '/tools/schema-validator',
    '/solutions/fix-playbook',
  ],
  '/prompt-tracking': [
    '/ai-visibility',
    '/tools/competitors-analysis',
    '/solutions/competitive-lens',
    '/blog',
  ],
  '/integration': [
    '/integration/shopify',
    '/integration/wordpress',
    '/recommendations',
    '/ai-visibility',
  ],
  '/integration/shopify': [
    '/integration/wordpress',
    '/recommendations',
    '/tools/schema-validator',
    '/ai-visibility',
  ],
  '/integration/wordpress': [
    '/integration/shopify',
    '/recommendations',
    '/tools/schema-validator',
    '/ai-visibility',
  ],
  '/tools/url-analyzer': [
    '/ai-visibility',
    '/recommendations',
    '/tools/schema-validator',
    '/tools/domain-rating',
  ],
  '/tools/llms-check': [
    '/ai-visibility',
    '/tools/schema-validator',
    '/tools/url-analyzer',
    '/blog',
  ],
  '/tools/competitors-analysis': [
    '/solutions/competitive-lens',
    '/ai-visibility',
    '/tools/url-analyzer',
    '/prompt-tracking',
  ],
  '/tools/schema-validator': [
    '/recommendations',
    '/tools/url-analyzer',
    '/integration',
    '/ai-visibility',
  ],
  '/tools/domain-rating': [
    '/tools/url-analyzer',
    '/tools/competitors-analysis',
    '/ai-visibility',
    '/pricing',
  ],
  '/solutions/visibility': [
    '/ai-visibility',
    '/prompt-tracking',
    '/tools/url-analyzer',
    '/pricing',
  ],
  '/solutions/fix-playbook': [
    '/recommendations',
    '/integration',
    '/tools/schema-validator',
    '/pricing',
  ],
  '/solutions/competitive-lens': [
    '/tools/competitors-analysis',
    '/prompt-tracking',
    '/ai-visibility',
    '/pricing',
  ],
}

/** Curated related links for a given page path (empty array if none configured). */
export function relatedLinks(path: string): RelatedLink[] {
  return (RELATED[path] ?? []).map(href => CATALOG[href]).filter(Boolean)
}
