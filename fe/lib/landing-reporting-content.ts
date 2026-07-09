import { BarChart3, FileDown, Presentation, Users, Compass } from '@fe/components/icons'
import type { LucideIcon } from '@fe/components/icons'

export const REPORTING_SITE = {
  title: 'Explorer',
  description:
    'Explore AI citation trends, share of voice, and competitor gaps across the prompts you track, then export a board-ready GEO PDF report.',
} as const

export const REPORTING_HERO = {
  titleLine1: 'Explore your',
  titleBadge: 'AI',
  titleIcon: Compass,
  titleLine2: 'AI citation',
  titleAccent: 'trends and gaps',
  subhead:
    "Track how often ChatGPT, Gemini, and Perplexity cite you over time, see your share of voice against competitors, and surface the tracked prompts where rivals appear and you don't, then export a board-ready PDF.",
  footnote: 'Citation trends · share of voice · PDF exports',
  primaryCta: 'Build a report',
  secondaryCta: 'Run free GEO audit',
} as const

export const REPORTING_HUB_CARDS: {
  slug: string
  href: string
  title: string
  description: string
  Icon: LucideIcon
  cta: string
}[] = [
  {
    slug: 'citation-trends',
    href: '/sign-up',
    title: 'Citation trends',
    description:
      'See your weekly AI citation rate per engine, so you know whether visibility work is moving in the right direction.',
    Icon: Presentation,
    cta: 'Learn more',
  },
  {
    slug: 'pdf-reports',
    href: '/sign-up',
    title: 'PDF reports',
    description:
      'Export a board-ready GEO report, score, citation share, and shipped fixes, as a PDF in one click.',
    Icon: FileDown,
    cta: 'Learn more',
  },
]

export const REPORTING_PROOF_METRICS = [
  { value: 'Weekly', label: 'Citation trend data' },
  { value: '6', label: 'AI engines tracked' },
  { value: 'PDF', label: 'Board-ready exports' },
  { value: '1:1', label: 'Linked to GEO score' },
] as const

export const REPORTING_PILLAR_ROWS = [
  { label: 'ChatGPT', value: 74, tone: 'bg-info/80' },
  { label: 'Gemini', value: 66, tone: 'bg-success/90' },
  { label: 'Perplexity', value: 54, tone: 'bg-warning/90' },
] as const

export const REPORTING_CAPABILITY_ROWS = [
  {
    icon: BarChart3,
    title: 'Citation trends',
    description:
      'Weekly AI citation rate per engine, so you can see whether ChatGPT, Gemini, and Perplexity are citing you more or less over time.',
  },
  {
    icon: Users,
    title: 'Share of voice',
    description:
      'Your share of AI mentions versus competitors across the prompts you track, the benchmark that tells you where you stand.',
  },
  {
    icon: Presentation,
    title: 'Score history',
    description:
      'Watch your GEO score move run over run, with each change tied to the recommendations you shipped in between.',
  },
  {
    icon: FileDown,
    title: 'PDF reports',
    description:
      'Export a board-ready GEO report, score, citation share, and shipped fixes, as a PDF whenever you need it.',
  },
] as const

export const REPORTING_FEATURES_INTRO = {
  eyebrow: '[ reporting ]',
  titleBefore: 'Everything you need to',
  titleAccent: 'show the impact',
  description:
    'GEO investment only lands when stakeholders see the wins. Explorer turns citation trends, share of voice, and shipped fixes into a board-ready PDF report, no slide rebuilding.',
} as const

export const REPORTING_FEATURE_CELLS = [
  {
    title: 'Citation trends',
    description:
      'Track your weekly AI citation rate per engine, so you can see whether tracked prompts are citing you more or less over time.',
    mock: {
      kind: 'trendingList' as const,
      items: [
        {
          prompt: 'Citation rate · ChatGPT',
          velocity: '+8 pts · 30d',
          direction: 'up' as const,
          surface: 'ChatGPT',
        },
        {
          prompt: 'Citation rate · Gemini',
          velocity: '+5 pts · 30d',
          direction: 'up' as const,
          surface: 'Gemini',
        },
        {
          prompt: 'Citation rate · Perplexity',
          velocity: '+2 pts · 30d',
          direction: 'up' as const,
          surface: 'Perplexity',
        },
      ],
    },
  },
  {
    title: 'Citation sources',
    description:
      'See which of your pages and which rival pages AI engines actually cite, broken down by domain and engine.',
    mock: {
      kind: 'trendingList' as const,
      items: [
        {
          prompt: '/pricing · cited',
          velocity: '12 cites · 4 engines',
          direction: 'up' as const,
          surface: 'ChatGPT',
        },
        {
          prompt: '/docs/api · cited',
          velocity: '6 cites · 2 engines',
          direction: 'up' as const,
          surface: 'Gemini',
        },
        {
          prompt: 'Rival · acme.com/crm',
          velocity: '9 cites · competitor',
          direction: 'new' as const,
          surface: 'Perplexity',
        },
      ],
    },
  },
  {
    title: 'Competitor gaps',
    description:
      'Prompts where rivals are mentioned and you are not, so marketing knows exactly where to invest in content next.',
    mock: {
      kind: 'trendingList' as const,
      items: [
        {
          prompt: 'Top ecommerce SEO platforms',
          velocity: 'Acme cited · you missing',
          direction: 'new' as const,
          surface: 'Perplexity',
        },
        {
          prompt: 'AI audit tools for agencies',
          velocity: 'Northwind cited · 4x',
          direction: 'up' as const,
          surface: 'ChatGPT',
        },
        {
          prompt: 'Enterprise GEO vendors',
          velocity: '3 rivals cited',
          direction: 'new' as const,
          surface: 'Gemini',
        },
      ],
    },
  },
  {
    title: 'Fix showcase',
    description:
      'Tell the story of shipped GEO work, fix queue deltas, schema wins, and which launches actually moved citations.',
    mock: {
      kind: 'alertList' as const,
      items: [
        {
          title: 'Added Organization JSON-LD',
          meta: '+4 GEO · 12 AI cites',
          dot: 'emerald' as const,
          badge: 'Win',
          badgeTone: 'emerald' as const,
        },
        {
          title: 'Rewrote /pricing copy',
          meta: '+3 citability',
          dot: 'amber' as const,
          badge: 'Partial',
          badgeTone: 'neutral' as const,
        },
        {
          title: 'Schema regression · /docs',
          meta: 'Rolled back',
          dot: 'red' as const,
          badge: 'Alert',
          badgeTone: 'red' as const,
        },
      ],
    },
  },
  {
    title: 'Competitor benchmark',
    description:
      'Side-by-side share of AI citations across the prompt baskets that matter, ready for board decks and investor updates.',
    mock: {
      kind: 'competitorBars' as const,
      title: 'Share of AI mentions',
      window: '30d',
      rows: [
        { name: 'You', pct: '41%', pctNum: 41, barClass: 'bg-info' },
        { name: 'Acme', pct: '34%', pctNum: 34, barClass: 'bg-muted' },
        { name: 'Northwind', pct: '25%', pctNum: 25, barClass: 'bg-muted' },
      ],
    },
  },
  {
    title: 'Score history',
    description:
      'Watch your GEO score move run over run, with each change tied to the recommendations you shipped in between.',
    mock: {
      kind: 'scoreCard' as const,
      label: 'GEO score',
      score: '78',
      suffix: '/100',
      delta: '+12',
      bars: [
        { widthClass: 'w-6', tone: 'bg-info/80', label: 'Run 1 · 66' },
        { widthClass: 'w-8', tone: 'bg-success/90', label: 'Run 2 · 72' },
        { widthClass: 'w-10', tone: 'bg-warning/90', label: 'Run 3 · 78' },
      ],
    },
  },
]

export const REPORTING_FEATURES_FOOTER_CTAS = {
  primary: 'Build a report',
  secondary: 'Run free GEO audit',
  secondaryHref: '/sign-up',
} as const

export const REPORTING_WHY = {
  eyebrow: '[ why reporting ]',
  titleBefore: 'GEO wins only land',
  titleAccent: 'when leadership sees them',
  titleAfter: '',
  intro:
    'The score moved. The citations grew. But none of that matters if it never makes it into an exec review. Explorer turns Signalor runs into stakeholder-ready stories, no slide rebuilding, no copy-paste.',
  proofTitle: 'Proof in numbers',
  proofBody:
    'What reporting looks like for teams that ship GEO wins into boardrooms and client reviews on a weekly cadence.',
  liveTitle: 'Live preview',
  liveBody:
    "An executive summary your CFO actually reads, three lines on what moved, one on what's next, and a link to the deeper dashboard for analysts.",
  livePrompt: "Summarize this month's AI visibility for the leadership review",
  liveAnswerParts: [
    { t: 'GEO score moved from 66 → 78 (+12). ' },
    { t: 'Signalor', variant: 'brand' as const },
    { t: ' now earns 41% share of AI citations on priority prompts, up 14% after the ' },
    { t: 'Organization schema', variant: 'link' as const },
    { t: ' launch. Next sprint: tighten /docs FAQ schema to close the last content gap.' },
  ],
  coverageTitle: 'Citation coverage',
  coverageBody:
    'Roll up how often your tracked prompts cite you versus miss you, so you know which themes need content, schema, or technical work next.',
  coverageScoreLabel: 'Coverage',
  coverageScore: '74',
  coverageSuffix: '/100',
  coverageDelta: '+11',
  citedLabel: 'Cited',
  missedLabel: 'Missed',
  citedPct: '68%',
  missedPct: '32%',
  coverageCitedBarPct: 68,
  shipTitle: 'What you ship',
  shipBody:
    'The analytics your team reviews each run, citation trends, share of voice, score history, and a board-ready PDF export.',
} as const

export const REPORTING_FAQ = [
  {
    question: 'What can I export?',
    answer:
      'Each analysis run can be exported as a board-ready PDF covering your GEO score, citation share, and shipped fixes. You can also share results from inside the product.',
  },
  {
    question: 'How do I track citation trends over time?',
    answer:
      'Explorer charts your weekly AI citation rate per engine and your GEO score run over run, so you can see whether visibility is improving across ChatGPT, Gemini, Perplexity, and the other engines on your plan.',
  },
  {
    question: "Can I see where competitors are cited and I'm not?",
    answer:
      'Yes. Across the prompts you track, Explorer surfaces share of voice versus competitors and the specific prompts where rivals are mentioned and your brand is missing, so you know where to invest in content next.',
  },
  {
    question: 'Can analysts get the underlying data?',
    answer:
      'Generate live or test API keys to pull scores and recommendations into your own dashboards, and subscribe to the analysis.completed webhook to receive each finished run programmatically.',
  },
] as const
