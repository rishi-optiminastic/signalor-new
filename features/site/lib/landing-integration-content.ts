export const INTEGRATION_HUB_CARDS = [
  {
    slug: 'shopify' as const,
    href: '/integration/shopify',
    title: 'Shopify',
    description:
      'Sync products, collections, and storefront content so GEO scoring reflects what shoppers actually see.',
    logoSrc: '/logos/shopify.svg',
  },
  {
    slug: 'wordpress' as const,
    href: '/integration/wordpress',
    title: 'WordPress',
    description:
      'Pull posts, pages, and schema from your CMS to track how AI-ready your editorial footprint is.',
    logoSrc: '/logos/wordpress.svg',
  },
  {
    slug: 'nextjs' as const,
    href: '/integration/nextjs',
    title: 'Next.js',
    description:
      'Instrument your app with the SDK so audits read the same rendered routes and metadata your users get.',
    logoSrc: '/logos/nextjs.svg',
  },
  {
    slug: 'webflow' as const,
    href: '/integration/webflow',
    title: 'Webflow',
    description:
      'Read published pages, CMS collections, and SEO settings so scoring matches your live site.',
    logoSrc: '/logos/webflow.svg',
  },
  {
    slug: 'framer' as const,
    href: '/integration/framer',
    title: 'Framer',
    description:
      'Pull published pages and CMS entries so GEO signals track what you actually ship.',
    logoSrc: '/logos/framer.svg',
  },
]

export const INTEGRATION_HUB_STATS = [
  { label: 'Connectors', value: '5', detail: 'Shopify, WordPress, Next.js, Webflow, Framer' },
  { label: 'Sync model', value: 'Scheduled', detail: 'Re-score after content changes' },
  {
    label: 'Data scope',
    value: 'Read-only',
    detail: 'No storefront or DB writes from marketing pages',
  },
] as const

export const INTEGRATION_HUB_FAQ = [
  {
    question: 'Do I need a paid Signalor plan to connect Shopify or WordPress?',
    answer:
      'You can explore integration docs and marketing pages on any plan. Connecting a live store or site to your workspace follows the same rules as the rest of the product,start free, then upgrade when you need saved runs and team features.',
  },
  {
    question: 'What data is pulled from Shopify?',
    answer:
      'Typical syncs include catalog structure, key product fields, and theme-visible content that affects how models describe your brand. Exact fields can evolve; the dashboard always shows what was used in the latest scoring pass.',
  },
  {
    question: 'How does WordPress integration handle plugins?',
    answer:
      'We focus on public HTML and structured data your site outputs,SEO plugins that inject JSON-LD, sitemaps, and canonical URLs help. Admin-only or gated content is not fetched unless it is reachable the same way a crawler would see it.',
  },
  {
    question: 'Can I disconnect an integration?',
    answer:
      'Yes. From workspace settings you can disconnect Shopify or WordPress at any time. Historical audit runs stay in your history; new syncs stop immediately after disconnect.',
  },
] as const

export const SHOPIFY_INTEGRATION_PAGE = {
  title: 'Shopify',
  headline: 'GEO signals from your real storefront',
  subhead:
    'Connect Shopify so Signalor can align audits with products, collections, and the story your theme tells,without replacing your stack.',
  bullets: [
    'Product and collection metadata feed citation and entity signals.',
    'Theme-visible copy helps models ground answers in what shoppers see.',
    'Scheduled syncs keep scores honest after launches and promos.',
  ],
} as const

export const WORDPRESS_INTEGRATION_PAGE = {
  title: 'WordPress',
  headline: 'Editorial and schema, wired into GEO',
  subhead:
    'Connect WordPress to roll posts, pages, and plugin-generated schema into the same visibility model you use for the rest of your site.',
  bullets: [
    'Classic and block content both contribute to on-page signals.',
    'Popular SEO plugins’ JSON-LD is reflected in structured-data checks.',
    'Sitemaps and canonical patterns inform crawlability insights.',
  ],
} as const

export const NEXTJS_INTEGRATION_PAGE = {
  title: 'Next.js',
  headline: 'Drop the SDK in, ship GEO-ready pages',
  subhead:
    'Instrument your Next.js app with the Signalor SDK so audits read the same rendered output your users and AI crawlers get,routes, metadata, and structured data included.',
  bullets: [
    'Server-rendered and static routes are scored the way engines fetch them.',
    'Route metadata and JSON-LD flow straight into structured-data checks.',
    'Re-score on deploy so scores track your release cadence, not a stale crawl.',
  ],
} as const

export const WEBFLOW_INTEGRATION_PAGE = {
  title: 'Webflow',
  headline: 'Score the site your Designer actually ships',
  subhead:
    'Connect Webflow so GEO audits read your published pages, CMS collections, and SEO settings,no plugin, no code export.',
  bullets: [
    'CMS collection fields feed entity and citation signals.',
    'Published SEO titles, descriptions, and Open Graph inform on-page checks.',
    'Re-score after publish so redesigns and content edits stay in sync.',
  ],
} as const

export const FRAMER_INTEGRATION_PAGE = {
  title: 'Framer',
  headline: 'GEO signals from your Framer publish',
  subhead:
    'Connect your Framer site so audits reflect the pages, CMS entries, and metadata you publish,kept honest against how models describe your brand.',
  bullets: [
    'Published pages and CMS items contribute to on-page and entity signals.',
    'Page metadata and structured data are checked as engines see them.',
    'Scheduled re-scores follow your publish cadence.',
  ],
} as const

export type PlatformSlug = 'shopify' | 'wordpress' | 'nextjs' | 'webflow' | 'framer'

export type IntegrationPlatformDetail = {
  /** SEO intro paragraph rendered under the hero. */
  overview: string
  /** Three ordered steps: connect → sync → score. */
  howItWorks: readonly { step: string; title: string; body: string }[]
  /** "What Signalor reads" feature grid. */
  reads: readonly { title: string; body: string }[]
  /** "Why it matters for GEO" benefit rows. */
  benefits: readonly { title: string; body: string }[]
  /** Short who-it's-for line for the closing band. */
  bestFor: string
}

export const INTEGRATION_PLATFORM_DETAILS: Record<PlatformSlug, IntegrationPlatformDetail> = {
  shopify: {
    overview:
      'The Signalor Shopify integration connects your storefront to GEO scoring so AI search engines like ChatGPT, Claude, Gemini, and Perplexity describe your products the way you would want them cited. Instead of guessing from a stale crawl, audits read your live catalog, collections, and theme content, then hand you a prioritized fix list that maps to real revenue pages.',
    howItWorks: [
      {
        step: '01',
        title: 'Connect your store',
        body: 'Authorize Signalor from your workspace with a read-oriented Shopify token, scoped only to the catalog and content fields scoring needs. No theme edits, no checkout access.',
      },
      {
        step: '02',
        title: 'Sync catalog and content',
        body: 'Signalor pulls product titles, descriptions, collections, and theme-visible copy on a schedule that matches your launch and promo cadence.',
      },
      {
        step: '03',
        title: 'Score and act',
        body: 'Every sync re-runs GEO scoring across the six pillars and refreshes prioritized recommendations, so you fix what actually moves AI visibility.',
      },
    ],
    reads: [
      {
        title: 'Product catalog',
        body: 'Titles, descriptions, prices, and variants become citation and entity signals AI answers can ground on.',
      },
      {
        title: 'Collections and taxonomy',
        body: 'Category structure helps engines understand how your inventory is organized and related.',
      },
      {
        title: 'Theme-visible content',
        body: 'The copy shoppers actually see anchors model answers in your real storefront, not a cached snapshot.',
      },
      {
        title: 'Existing schema',
        body: 'Product and Organization JSON-LD already on your theme is validated against structured-data checks.',
      },
    ],
    benefits: [
      {
        title: 'Cited accurately',
        body: 'Engines reference real product names, prices, and availability instead of hallucinating details.',
      },
      {
        title: 'Always current',
        body: 'Scheduled syncs keep scores honest after drops, price changes, and seasonal promos.',
      },
      {
        title: 'Read-only and reversible',
        body: 'No storefront writes. Disconnect anytime from workspace settings; audit history stays intact.',
      },
    ],
    bestFor: 'Shopify merchants who want AI engines to cite live catalog data, not a stale crawl.',
  },
  wordpress: {
    overview:
      'The Signalor WordPress integration rolls your posts, pages, and plugin-generated schema into the same GEO model you use for the rest of your site. It reads the public HTML and structured data your CMS outputs, so you can see how AI-ready your editorial footprint is and fix the gaps that keep ChatGPT, Claude, Gemini, and Perplexity from citing you.',
    howItWorks: [
      {
        step: '01',
        title: 'Connect your site',
        body: 'Link WordPress from your workspace. Signalor reads what a crawler would see, public posts, pages, sitemaps, and the JSON-LD your SEO plugins emit.',
      },
      {
        step: '02',
        title: 'Sync editorial and schema',
        body: 'Classic and block content, canonical patterns, and plugin structured data are pulled on your configured schedule.',
      },
      {
        step: '03',
        title: 'Score and act',
        body: 'GEO scoring re-runs after each sync and surfaces the posts and templates most worth improving for AI visibility.',
      },
    ],
    reads: [
      {
        title: 'Posts and pages',
        body: 'Editorial content from classic and block editors contributes to on-page and entity signals.',
      },
      {
        title: 'Plugin schema',
        body: 'JSON-LD from popular SEO plugins is reflected in structured-data checks and validation.',
      },
      {
        title: 'Sitemaps and canonicals',
        body: 'Sitemap coverage and canonical URLs inform crawlability and duplicate-content insights.',
      },
      {
        title: 'Templates and taxonomy',
        body: 'Category and tag structure show how models understand the shape of your content.',
      },
    ],
    benefits: [
      {
        title: 'Editorial that ranks in answers',
        body: 'See which posts models can cite and which need answer-shaped structure to compete.',
      },
      {
        title: 'Schema you can trust',
        body: 'Validate the JSON-LD your plugins emit instead of assuming it is complete and correct.',
      },
      {
        title: 'No admin lock-in',
        body: 'Read-oriented syncs; disconnect anytime. Historical runs stay in your workspace.',
      },
    ],
    bestFor:
      'Content teams and publishers who want their WordPress editorial to show up in AI answers.',
  },
  nextjs: {
    overview:
      'The Signalor Next.js integration instruments your app with a lightweight SDK so GEO audits read the exact server-rendered and static output your users and AI crawlers receive. Route metadata, JSON-LD, and rendered content flow into scoring, and re-scoring runs on deploy, so your AI visibility tracks your release cadence instead of a stale crawl snapshot.',
    howItWorks: [
      {
        step: '01',
        title: 'Install the SDK',
        body: 'Add the Signalor package to your Next.js app and drop in the config. It works with the App Router and Pages Router, SSR, SSG, and ISR.',
      },
      {
        step: '02',
        title: 'Report on deploy',
        body: 'On each build or deploy the SDK reports your routes, generated metadata, and structured data to your workspace.',
      },
      {
        step: '03',
        title: 'Score and act',
        body: 'GEO scoring runs against the rendered output and hands your team a prioritized, developer-ready fix list per route.',
      },
    ],
    reads: [
      {
        title: 'Rendered routes',
        body: 'Server-rendered and static pages are scored the way engines actually fetch them.',
      },
      {
        title: 'Route metadata',
        body: 'Titles, descriptions, and Open Graph from your metadata API feed on-page checks.',
      },
      {
        title: 'Structured data',
        body: 'JSON-LD you emit per route is validated so answer engines can parse your entities.',
      },
      {
        title: 'Sitemap and robots',
        body: 'Generated sitemap and robots output inform crawlability and indexation insights.',
      },
    ],
    benefits: [
      {
        title: 'Scored as shipped',
        body: 'No crawl guesswork, audits use the same HTML your framework renders in production.',
      },
      {
        title: 'CI-friendly',
        body: 'Re-score on deploy so a regression in metadata or schema is caught before it costs visibility.',
      },
      {
        title: 'Developer-ready fixes',
        body: 'Recommendations map to routes and components your team can action or hand to the code agent.',
      },
    ],
    bestFor:
      'Engineering teams shipping React/Next.js apps who want GEO wired into their deploy pipeline.',
  },
  webflow: {
    overview:
      'The Signalor Webflow integration reads your published pages, CMS collections, and SEO settings so GEO audits reflect what your live site actually serves, no plugin, no code export. Titles, descriptions, Open Graph, and structured data are scored the way AI engines fetch them, and re-scoring runs after you publish so redesigns and content edits never drift from your visibility.',
    howItWorks: [
      {
        step: '01',
        title: 'Connect your site',
        body: 'Link your published Webflow site from your workspace. Signalor reads the pages and CMS data as they appear on the live domain.',
      },
      {
        step: '02',
        title: 'Sync pages and CMS',
        body: 'Published pages, CMS collection items, and the SEO fields you set in Webflow are pulled on your configured schedule.',
      },
      {
        step: '03',
        title: 'Score and act',
        body: 'GEO scoring re-runs after each publish and surfaces the templates and collections most worth improving.',
      },
    ],
    reads: [
      {
        title: 'Published pages',
        body: 'Static pages are scored exactly as visitors and crawlers see them on your live domain.',
      },
      {
        title: 'CMS collections',
        body: 'Collection fields feed entity and citation signals across every templated item.',
      },
      {
        title: 'SEO settings',
        body: 'Titles, meta descriptions, and Open Graph configured in Webflow inform on-page checks.',
      },
      {
        title: 'Structured data',
        body: 'JSON-LD embedded in your pages is validated against structured-data requirements.',
      },
    ],
    benefits: [
      {
        title: 'Design-team friendly',
        body: 'Score the site your Designer ships without exporting code or installing anything.',
      },
      {
        title: 'CMS at scale',
        body: 'Every templated collection item is checked, not just a handful of hand-picked pages.',
      },
      {
        title: 'Publish-synced',
        body: 'Re-scoring after publish keeps visibility aligned with your latest content and redesigns.',
      },
    ],
    bestFor: 'Webflow teams who want GEO scoring on their published site and CMS without a plugin.',
  },
  framer: {
    overview:
      'The Signalor Framer integration reads the pages, CMS entries, and metadata you publish so GEO audits reflect your live site and stay honest against how AI engines describe your brand. Page titles, descriptions, and structured data are checked as engines fetch them, with scheduled re-scores that follow your publish cadence.',
    howItWorks: [
      {
        step: '01',
        title: 'Connect your site',
        body: 'Link your published Framer site from your workspace. Signalor reads pages and CMS items as they appear on the live domain.',
      },
      {
        step: '02',
        title: 'Sync pages and CMS',
        body: 'Published pages, CMS collection entries, and the page metadata you set in Framer are pulled on your schedule.',
      },
      {
        step: '03',
        title: 'Score and act',
        body: 'GEO scoring re-runs after each publish and hands you a prioritized list of pages to improve.',
      },
    ],
    reads: [
      {
        title: 'Published pages',
        body: 'Pages are scored as visitors and AI crawlers fetch them from your live domain.',
      },
      {
        title: 'CMS entries',
        body: 'Collection items contribute to on-page and entity signals across your templated content.',
      },
      {
        title: 'Page metadata',
        body: 'Titles, descriptions, and social metadata set in Framer inform on-page checks.',
      },
      {
        title: 'Structured data',
        body: 'Any JSON-LD your pages output is validated against structured-data requirements.',
      },
    ],
    benefits: [
      {
        title: 'No-code friendly',
        body: 'Get GEO scoring on your Framer site without exporting or maintaining code.',
      },
      {
        title: 'Content-synced',
        body: 'Re-scores follow your publish cadence so visibility tracks what you actually ship.',
      },
      {
        title: 'Read-only and reversible',
        body: 'Marketing-page syncs stay read-oriented; disconnect anytime from workspace settings.',
      },
    ],
    bestFor: 'Framer creators and studios who want GEO scoring on their published pages and CMS.',
  },
}

export const INTEGRATION_DETAIL_FAQ = [
  {
    question: 'Is my admin password shared with Signalor?',
    answer:
      'No. OAuth or app-style tokens are used where the platform supports them; you grant only the scopes required for read-oriented syncs described in settings.',
  },
  {
    question: 'How fast does data update after I publish?',
    answer:
      'Updates follow the sync schedule configured for your workspace. For large catalogs or busy blogs, the first sync after connect can take longer than incremental updates.',
  },
  {
    question: 'Where do I manage the live connection?',
    answer:
      'Use Integrations inside your Signalor workspace (same surface as analytics connectors). Marketing pages on this site are overview only.',
  },
] as const
