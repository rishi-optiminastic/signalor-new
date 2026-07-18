import {
  BarChart3,
  Briefcase,
  Building2,
  FileCheck2,
  FileText,
  LinkIcon,
} from '@/features/site/components/icons'
import type { LucideIcon } from '@/features/site/components/icons'

export const FOR_AGENCIES_SITE = {
  title: 'For agencies',
  description:
    'Run GEO audits, track AI share of voice, and ship prioritized fixes across your whole client roster from one workspace.',
} as const

export const FOR_AGENCIES_HERO = {
  titleLine1: 'Run',
  titleIcon: Briefcase,
  titleLine2: 'AI search visibility for',
  titleAccent: 'every client you manage',
  subhead:
    'Manage each brand as its own project with separate scores, prompts, and runs. SignalorAI rolls up GEO audits, share of voice, and prioritized fixes across your whole roster, so one strategist can deliver AI search for twenty clients.',
  footnote: 'Multi-brand workspace · white-label reports · one login',
  primaryCta: 'Start an agency workspace',
  secondaryCta: 'See agency pricing',
} as const

export const FOR_AGENCIES_HUB_CARDS: {
  slug: string
  href: string
  title: string
  description: string
  Icon: LucideIcon
  cta: string
}[] = [
  {
    slug: 'multi-brand-workspace',
    href: '/sign-up',
    title: 'Multi-brand workspace',
    description:
      'Every client is its own project with separate scores, prompts, and runs. No juggling logins or spreadsheets.',
    Icon: Building2,
    cta: 'Learn more',
  },
  {
    slug: 'white-label-reporting',
    href: '/sign-up',
    title: 'White-label reporting',
    description:
      'Clear 0-100 GEO scores and pillar breakdowns clients understand, exportable for every monthly review.',
    Icon: FileText,
    cta: 'Learn more',
  },
]

export const FOR_AGENCIES_PROOF_METRICS = [
  { value: '1', label: 'Workspace, every client' },
  { value: '0-100', label: 'GEO score per brand' },
  { value: '6', label: 'AI engines tracked' },
  { value: '20+', label: 'Brands per workspace' },
] as const

export const FOR_AGENCIES_PILLAR_ROWS = [
  { label: 'Acme Retail', value: 78, tone: 'bg-success/90' },
  { label: 'Northwind Labs', value: 64, tone: 'bg-warning/90' },
  { label: 'Vertex Cloud', value: 52, tone: 'bg-info/80' },
] as const

export const FOR_AGENCIES_CAPABILITY_ROWS = [
  {
    icon: Building2,
    title: 'Client workspaces',
    description:
      'Spin up a project per brand with its own prompts, competitors, and run schedule, isolated but reportable side by side.',
  },
  {
    icon: BarChart3,
    title: 'Board-ready reports',
    description:
      'Export GEO scores, share of voice, and pillar breakdowns as clean reports your account managers present in every review.',
  },
  {
    icon: FileCheck2,
    title: 'Prioritized fix lists',
    description:
      'Turn each audit into a ranked queue your team executes or hands to the client dev team, scoped by expected score lift.',
  },
  {
    icon: LinkIcon,
    title: 'Tied to GEO score',
    description:
      'Every fix maps to the GEO score change it should unlock, so retainer work ladders up to a number clients can see move.',
  },
] as const

export const FOR_AGENCIES_FEATURES_INTRO = {
  eyebrow: '[ for agencies ]',
  titleBefore: 'Everything you need to',
  titleAccent: 'deliver AI search at scale',
  description:
    'Answer engines decide what to cite from structure, schema, and trust signals, not blue-link rankings. SignalorAI keeps those markers healthy across every client, and rolls the work up so one team can run AI search for a full book of business.',
} as const

export const FOR_AGENCIES_FEATURE_CELLS = [
  {
    title: 'One roster, every brand',
    description:
      'See each client as its own tracked project, GEO score, page count, and last run, without switching workspaces.',
    mock: {
      kind: 'library' as const,
      rows: [
        {
          q: 'Acme Retail',
          tag: 'A',
          tagLetter: 'A',
          tone: 'bg-success',
          meta: 'GEO 78 · 214 pages · run 2h ago',
        },
        {
          q: 'Northwind Labs',
          tag: 'N',
          tagLetter: 'N',
          tone: 'bg-warning',
          meta: 'GEO 64 · 88 pages · run 1d ago',
        },
        {
          q: 'Vertex Cloud',
          tag: 'V',
          tagLetter: 'V',
          tone: 'bg-info',
          meta: 'GEO 52 · 132 pages · run 3d ago',
        },
      ],
    },
  },
  {
    title: 'Per-client GEO score',
    description:
      'One 0-100 read across four pillars, schema, content, E-E-A-T, and technical, so each client review opens on a number.',
    mock: {
      kind: 'scoreCard' as const,
      label: 'Acme Retail · GEO',
      score: '78',
      suffix: '/100',
      delta: '+12',
      bars: [
        { widthClass: 'w-10', tone: 'bg-info/80', label: 'Schema · 71' },
        { widthClass: 'w-7', tone: 'bg-success/90', label: 'Content · 74' },
        { widthClass: 'w-6', tone: 'bg-warning/90', label: 'E-E-A-T · 61' },
      ],
    },
  },
  {
    title: 'Share of voice per brand',
    description:
      'Benchmark each client against its real competitors across the prompts buyers ask, not legacy keyword rankings.',
    mock: {
      kind: 'competitorBars' as const,
      title: 'Acme · share of AI mentions',
      window: '30d',
      rows: [
        { name: 'Acme', pct: '42%', pctNum: 42, barClass: 'bg-success' },
        { name: 'Rival A', pct: '34%', pctNum: 34, barClass: 'bg-muted' },
        { name: 'Rival B', pct: '24%', pctNum: 24, barClass: 'bg-muted' },
      ],
    },
  },
  {
    title: 'White-label fix queue',
    description:
      'Each audit becomes a ranked, client-scoped task list, execute it in-house or hand it to their developers with context.',
    mock: {
      kind: 'alertList' as const,
      items: [
        {
          title: 'Add Organization JSON-LD · Acme',
          meta: 'Site-wide · est +4 GEO',
          dot: 'red' as const,
          badge: 'Critical',
          badgeTone: 'red' as const,
        },
        {
          title: 'Tighten FAQ schema · Northwind',
          meta: 'Template · est +2 GEO',
          dot: 'amber' as const,
          badge: 'Next',
          badgeTone: 'neutral' as const,
        },
        {
          title: 'Publish author bios · Vertex',
          meta: 'Shipped · cite lift',
          dot: 'emerald' as const,
          badge: 'Done',
          badgeTone: 'emerald' as const,
        },
      ],
    },
  },
  {
    title: 'Engine coverage per brand',
    description:
      "Track each client's visibility across every answer engine, ChatGPT, Claude, Gemini, Perplexity, Copilot, and Google AI.",
    mock: {
      kind: 'engineGrid' as const,
      engines: [
        { name: 'ChatGPT', initial: 'C', tone: 'bg-success', coverage: 74, trend: 'up' as const },
        { name: 'Claude', initial: 'A', tone: 'bg-warning', coverage: 62, trend: 'up' as const },
        { name: 'Gemini', initial: 'G', tone: 'bg-info', coverage: 58, trend: 'flat' as const },
        {
          name: 'Perplexity',
          initial: 'P',
          tone: 'bg-[var(--feature-violet)]',
          coverage: 45,
          trend: 'down' as const,
        },
        { name: 'Copilot', initial: 'B', tone: 'bg-info', coverage: 51, trend: 'up' as const },
        {
          name: 'Google AI',
          initial: 'G',
          tone: 'bg-destructive',
          coverage: 67,
          trend: 'up' as const,
        },
      ],
    },
  },
  {
    title: 'Roster-wide impact planning',
    description:
      'Sort the highest-lift work across the whole book by impact and effort, so retainer hours land where scores move most.',
    mock: {
      kind: 'impactList' as const,
      items: [
        {
          title: 'Ship Org schema · Acme',
          impact: 8,
          effort: 'S' as const,
          impactTone: 'emerald' as const,
        },
        {
          title: 'Fix FAQ markup · Northwind',
          impact: 5,
          effort: 'M' as const,
          impactTone: 'blue' as const,
        },
        {
          title: 'Author bios · Vertex',
          impact: 3,
          effort: 'S' as const,
          impactTone: 'amber' as const,
        },
      ],
    },
  },
]

export const FOR_AGENCIES_FEATURES_FOOTER_CTAS = {
  primary: 'Start an agency workspace',
  secondary: 'See agency pricing',
  secondaryHref: '/pricing',
} as const

export const FOR_AGENCIES_WHY = {
  eyebrow: '[ why agencies pick signalor ]',
  titleBefore: 'Manage the whole',
  titleAccent: 'roster',
  titleAfter: 'from one workspace',
  intro:
    'Delivering AI search for a book of clients breaks the moment it lives in spreadsheets. SignalorAI keeps every brand, score, and fix in one workspace, so account managers report a number and strategists spend hours on work that moves it.',
  proofTitle: 'Proof in numbers',
  proofBody:
    'What agency teams point to once they move from per-client spreadsheets to one signals-driven AI search program in SignalorAI.',
  liveTitle: 'Live preview',
  liveBody:
    'How a managed client shows up in AI answers, and the exact schema and trust gaps SignalorAI flags to keep them cited.',
  livePrompt: 'What is the best project management tool for remote teams?',
  liveAnswerParts: [
    { t: 'Strong options include ' },
    { t: 'Northwind Labs', variant: 'brand' as const },
    { t: ' and ' },
    { t: 'Acme', variant: 'link' as const },
    {
      t: ', both cited for clear pricing schema and consistent review coverage across sources.',
    },
  ],
  coverageTitle: 'Roster coverage',
  coverageBody:
    'Roll up how every client scores on structure, schema, and trust, so the next sprint targets the weakest brand, not the loudest account.',
  coverageScoreLabel: 'Roster avg',
  coverageScore: '64',
  coverageSuffix: '/100',
  coverageDelta: '+9',
  citedLabel: 'On track',
  missedLabel: 'At risk',
  citedPct: '61%',
  missedPct: '39%',
  coverageCitedBarPct: 61,
  shipTitle: 'What you ship',
  shipBody:
    'The retainer work your team owns each month, from client audits to prioritized fixes clients can watch improve their score.',
} as const

export const FOR_AGENCIES_FAQ = [
  {
    question: 'How does SignalorAI handle multiple clients in one account?',
    answer:
      'Each client is a separate project with its own GEO score, prompt set, competitors, and run schedule. You switch between brands without new logins, and reporting keeps every client cleanly isolated.',
  },
  {
    question: 'Can I white-label reports for client reviews?',
    answer:
      'Yes. Export each brand’s GEO score, pillar breakdown, and share of voice as clean reports your account managers present in monthly reviews, with the metrics clients actually understand.',
  },
  {
    question: 'Do agency plans scale with the number of brands?',
    answer:
      'Agency plans are built for high project counts and repeatable delivery. Add brands as your book grows, and manage them all from one workspace with roster-wide fix planning.',
  },
  {
    question: 'Can my team hand fixes to a client’s developers?',
    answer:
      'Every audit becomes a prioritized, client-scoped task list with the context and expected GEO score lift attached, so you can execute in-house or hand it to the client dev team without rewriting the brief.',
  },
] as const
