'use client'

import { AuthMarketingPanel } from '@/components/auth/auth-shell'
import { useOnboardingWizardStore, type WizardStep } from '@/stores/useOnboardingWizardStore'

/** One GEO fact per wizard step, shown bottom-right while the user fills the form. */
const GEO_FACTS: Record<WizardStep, string> = {
  company:
    "AI assistants answer ~60% of queries with zero clicks — your brand's mention in the answer is the new front page.",
  platform:
    'Adding schema.org markup makes a page up to 30% more likely to be cited by AI answer engines.',
  url: 'Crawlers like GPTBot and PerplexityBot read your site directly — one blocked URL can erase you from the answer.',
  install:
    'Clean, fast-loading HTML gets pulled into AI answers far more often than heavy client-rendered pages.',
  prompts:
    '70%+ of buying research now starts inside an AI chat — tracking the exact prompts is your real share of voice.',
  analytics:
    'Visitors from AI answers convert 4–6× higher than classic organic search — they arrive pre-qualified.',
  launch:
    'GEO scores shift weekly — brands that monitor and fix continuously outrank those that audit once.',
}

/**
 * Onboarding right panel: the shared marketing panel over the blue/orange
 * gradient, with a per-step GEO fact that rotates as the wizard advances.
 */
export function OnboardingMarketingPanel(): JSX.Element {
  const step = useOnboardingWizardStore(s => s.step)

  return (
    <AuthMarketingPanel
      imageSrc="/onboarding-visual.jpg"
      eyebrow="GEO fact"
      headline={GEO_FACTS[step]}
    />
  )
}
