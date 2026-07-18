// Content for the /for-brands page. Claims here mirror what the rest of the
// site already states (free analyzer, six pillars, engine coverage,
// Shopify/WordPress connectors) — do not invent new numbers.

export const FOR_BRANDS_PROOF_METRICS = [
  { value: '40%', label: 'Average lift in AI citations after shipping the fix queue' },
  { value: '40%', label: 'Higher buyer intent from AI-referred visitors' },
  { value: '24h', label: 'To see visibility growth after your first shipped fix' },
  { value: '6', label: 'AI engines tracked side by side' },
] as const

export const FOR_BRANDS_FAQ = [
  {
    question: 'How do I see how AI describes my brand today?',
    answer:
      'Paste your domain into the free analyzer. In about 60 seconds you get a GEO score, citation signals, and a prioritized fix list, no sign-up required for the summary. Create an account when you want to save runs and track changes over time.',
  },
  {
    question: 'Which AI engines does SignalorAI track for my brand?',
    answer:
      'SignalorAI tracks brand presence and citations across ChatGPT (OpenAI), Claude (Anthropic), Gemini (Google), Perplexity, Google AI Overviews, and Microsoft Copilot. Engine coverage varies by plan.',
  },
  {
    question: 'What goes into my GEO score?',
    answer:
      'Six weighted pillars: content (0.20), schema (0.15), E-E-A-T (0.20), technical (0.15), entity (0.15), and AI visibility (0.15). Each pillar rolls 5-15 sub-checks into a 0-100 score; the weighted average is your final GEO score.',
  },
  {
    question: 'Can SignalorAI apply fixes for me?',
    answer:
      'Every audit ends in a ranked fix queue. On Shopify, the integration scores product and content pages; on WordPress, the signalor-geo plugin surfaces recommendations and applies one-click schema fixes inside the admin. Everything else ships as a clear, scoped task.',
  },
  {
    question: 'How do I measure the impact on traffic?',
    answer:
      'Connect your analytics to watch AI referral traffic move as visibility improves. Prompts re-run weekly, so every new citation, drop, and win lands in your dashboard automatically.',
  },
] as const
