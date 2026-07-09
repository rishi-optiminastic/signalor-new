import { Plug, Workflow, Zap, LinkIcon, Target } from '@fe/components/icons'
import type { LucideIcon } from '@fe/components/icons'

export const INTEGRATIONS_SITE = {
  title: 'Recommendations',
  description:
    'Prioritized fixes ranked by impact on your GEO score and citations, schema, structure, content, and trust in one queue.',
} as const

export const INTEGRATIONS_HERO = {
  titleLine1: 'Ship the',
  titleBadge: 'AI',
  titleIcon: Target,
  titleLine2: 'fixes that actually',
  titleAccent: 'move citations',
  subhead:
    'Turn GEO recommendations into shipped fixes. Signalor ranks every schema, content, and technical task by impact, then publishes the fix to Shopify or WordPress and verifies it on the live page.',
  footnote: 'Shopify & WordPress publishing · GA4 analytics · webhooks',
  primaryCta: 'Browse integrations',
  secondaryCta: 'Run free GEO audit',
} as const

export const INTEGRATIONS_HUB_CARDS: {
  slug: string
  href: string
  title: string
  description: string
  Icon: LucideIcon
  /** Optional real brand logo (image path). When set, shown instead of `Icon`. */
  logo?: string
  cta: string
}[] = [
  {
    slug: 'shopify',
    href: '/integration/shopify',
    title: 'Shopify',
    description:
      'One-click GEO fixes for product pages, schema, and content, live on your storefront without extra engineering.',
    Icon: Plug,
    logo: '/logos/shopify.svg',
    cta: 'Open Shopify app',
  },
  {
    slug: 'wordpress',
    href: '/integration/wordpress',
    title: 'WordPress',
    description:
      'Apply schema, meta, and robots fixes directly to posts and pages via the Signalor GEO plugin.',
    Icon: Workflow,
    logo: '/logos/wordpress.svg',
    cta: 'Open WP plugin',
  },
]

export const INTEGRATIONS_PROOF_METRICS = [
  { value: '1-click', label: 'Apply & verify fixes' },
  { value: 'Shopify + WP', label: 'Auto-fix publishing' },
  { value: 'GA4', label: 'Analytics connected' },
  { value: '4', label: 'Priority levels' },
] as const

export const INTEGRATIONS_PILLAR_ROWS = [
  { label: 'Publishing', value: 78, tone: 'bg-info/80' },
  { label: 'Analytics', value: 66, tone: 'bg-success/90' },
  { label: 'Webhooks', value: 54, tone: 'bg-warning/90' },
] as const

export const INTEGRATIONS_CAPABILITY_ROWS = [
  {
    icon: Plug,
    title: 'CMS publishing',
    description:
      'Ship approved schema, meta, and content fixes directly to Shopify and WordPress, no copy-paste tickets.',
  },
  {
    icon: Zap,
    title: 'Auto-fix workflow',
    description:
      'Preview, approve, and verify each fix before it ships, Signalor re-crawls the live page to confirm the change took effect.',
  },
  {
    icon: Workflow,
    title: 'GA4 analytics',
    description:
      'Connect Google Analytics 4 so GEO score movement ties back to sessions and traffic, not vanity signals.',
  },
  {
    icon: LinkIcon,
    title: 'API keys & webhooks',
    description:
      'Generate live and test API keys for scores and recommendations, and receive analysis.completed webhooks in your own tools.',
  },
] as const

export const INTEGRATIONS_FEATURES_INTRO = {
  eyebrow: '[ integrations ]',
  titleBefore: 'Everything you need to',
  titleAccent: 'ship GEO recommendations',
  description:
    'Signalor plugs prioritized GEO recommendations into the systems your team already uses. Audit, approve, and ship schema, content, and technical fixes to production without switching tools or writing glue scripts.',
} as const

export const INTEGRATIONS_FEATURE_CELLS = [
  {
    title: 'Prioritized fix queue',
    description:
      'Every recommendation ranked by GEO impact and effort, ship what moves citations first, not what is easiest to click.',
    mock: {
      kind: 'impactList' as const,
      items: [
        {
          title: 'Add Organization JSON-LD',
          impact: 8,
          effort: 'M' as const,
          impactTone: 'red' as const,
        },
        {
          title: 'Tighten /pricing FAQ schema',
          impact: 5,
          effort: 'S' as const,
          impactTone: 'amber' as const,
        },
        {
          title: 'Rewrite /docs intros',
          impact: 6,
          effort: 'L' as const,
          impactTone: 'blue' as const,
        },
        {
          title: 'Publish author bios',
          impact: 3,
          effort: 'S' as const,
          impactTone: 'emerald' as const,
        },
      ],
    },
  },
  {
    title: 'Impact-ranked backlog',
    description:
      'See every open recommendation alongside estimated GEO lift, so PMs, engineers, and SEOs work the same priority list.',
    mock: {
      kind: 'impactList' as const,
      items: [
        {
          title: 'HowTo schema on /guides',
          impact: 7,
          effort: 'M' as const,
          impactTone: 'blue' as const,
        },
        {
          title: 'Fix broken canonicals',
          impact: 6,
          effort: 'S' as const,
          impactTone: 'red' as const,
        },
        {
          title: 'Add FAQ blocks /solutions',
          impact: 4,
          effort: 'M' as const,
          impactTone: 'amber' as const,
        },
      ],
    },
  },
  {
    title: 'Score lift projection',
    description:
      'Model the GEO score and citation lift you unlock if you ship the top 3 recommendations this sprint.',
    mock: {
      kind: 'scoreCard' as const,
      label: 'Projected GEO',
      score: '82',
      suffix: '/100',
      delta: '+10',
      bars: [
        { widthClass: 'w-10', tone: 'bg-info/80', label: 'From schema fixes · +6' },
        { widthClass: 'w-7', tone: 'bg-success/90', label: 'From content · +3' },
        { widthClass: 'w-6', tone: 'bg-warning/90', label: 'From trust · +1' },
      ],
    },
  },
  {
    title: 'Webhook delivery',
    description:
      'Subscribe to analysis.completed webhooks so each finished run pushes scores and recommendations straight into your own tools and dashboards.',
    mock: {
      kind: 'alertList' as const,
      items: [
        {
          title: 'analysis.completed',
          meta: 'POST · your endpoint',
          dot: 'emerald' as const,
          badge: 'Sent',
          badgeTone: 'emerald' as const,
        },
        {
          title: 'Signed payload',
          meta: 'HMAC-SHA256',
          dot: 'emerald' as const,
          badge: 'Verified',
          badgeTone: 'emerald' as const,
        },
        {
          title: 'API key · live & test',
          meta: 'Scores · recommendations',
          dot: 'amber' as const,
          badge: 'Active',
          badgeTone: 'neutral' as const,
        },
      ],
    },
  },
  {
    title: 'API & webhooks',
    description:
      'Pull scores and recommendations into internal dashboards or external BI with API keys, and subscribe to analysis.completed webhooks.',
    mock: {
      kind: 'citationBar' as const,
      leftLabel: 'Available now',
      rightLabel: 'More soon',
      leftPct: 72,
      list: [
        { dot: 'emerald' as const, text: 'API keys · live & test' },
        { dot: 'emerald' as const, text: 'analysis.completed webhook' },
        { dot: 'amber' as const, text: 'More webhook events · roadmap' },
      ],
    },
  },
  {
    title: 'Multi-project workspaces',
    description:
      'Run multiple brands or client sites under one account, up to six projects on Max, and export a PDF report per project.',
    mock: {
      kind: 'competitorBars' as const,
      title: 'Projects connected',
      window: 'This qtr',
      rows: [
        { name: 'Agency A', pct: '14', pctNum: 70, barClass: 'bg-info' },
        { name: 'Agency B', pct: '9', pctNum: 45, barClass: 'bg-muted' },
        { name: 'Agency C', pct: '5', pctNum: 25, barClass: 'bg-muted' },
      ],
    },
  },
]

export const INTEGRATIONS_FEATURES_FOOTER_CTAS = {
  primary: 'Browse integrations',
  secondary: 'Open Shopify app',
  secondaryHref: '/integration/shopify',
} as const

export const INTEGRATIONS_WHY = {
  eyebrow: '[ why integrations ]',
  titleBefore: 'GEO wins when it ships',
  titleAccent: 'inside your stack',
  titleAfter: 'not beside it',
  intro:
    'Audit tools collect dust if fixes never reach production. Signalor publishes approved schema, content, and technical fixes into Shopify and WordPress and ties the results back to GA4, so visibility gains compound.',
  proofTitle: 'Proof in numbers',
  proofBody:
    'What integrated GEO looks like versus teams still copy-pasting schema between tools and CMSes.',
  liveTitle: 'Live preview',
  liveBody:
    'The workflow review strategists run before shipping a schema change, anchored to the integration that actually applies the fix.',
  livePrompt: 'Which platform makes GEO fixes easiest to roll out across 20 stores?',
  liveAnswerParts: [
    { t: 'Teams often recommend ' },
    { t: 'Signalor', variant: 'brand' as const },
    { t: ' for fleet-level rollouts; the Shopify app pushes schema fixes cleanly and the ' },
    { t: 'WordPress plugin', variant: 'link' as const },
    { t: ' covers the long tail of marketing sites in one click.' },
  ],
  coverageTitle: 'Integration coverage',
  coverageBody:
    'Roll up how much of your stack is connected, Shopify, WordPress, and GA4, so the next fix ships where your team already works.',
  coverageScoreLabel: 'Stack',
  coverageScore: '66',
  coverageSuffix: '/100',
  coverageDelta: '+12',
  citedLabel: 'Connected',
  missedLabel: 'Missing',
  citedPct: '58%',
  missedPct: '42%',
  coverageCitedBarPct: 58,
  shipTitle: 'What you ship',
  shipBody:
    'The integration work your team turns on, from Shopify and WordPress publishing to GA4 analytics and webhook delivery.',
} as const

export const INTEGRATIONS_FAQ = [
  {
    question: 'Which CMS platforms can publish GEO fixes automatically?',
    answer:
      'Shopify (via the Signalor app) and WordPress (via the Signalor GEO plugin) publish approved schema, meta, and content fixes directly. Additional CMS support is actively on the roadmap.',
  },
  {
    question: 'Can I connect analytics tools like GA4?',
    answer:
      'Yes. Connect Google Analytics 4 to tie GEO score movement back to sessions and traffic. Signalor correlates score changes with your GA4 data so you can see how visibility work tracks against real site activity.',
  },
  {
    question: 'Do you support webhooks or a public API?',
    answer:
      'Yes. Generate live and test API keys to read scores and recommendations, and subscribe to the analysis.completed webhook to receive signed payloads when a run finishes. Additional webhook events are on the roadmap.',
  },
  {
    question: 'Can agencies manage multiple brands?',
    answer:
      'Yes. Plans include multiple projects, two on Starter, three on Pro, and six on Max, so agencies can run separate brands or clients under one account and export a PDF report for each.',
  },
] as const
