'use client'

import { ArrowRight } from 'lucide-react'
import { useState } from 'react'

import { OnboardingField } from '@/features/catalyst/components/socials/onboarding/OnboardingField'
import { OnboardingNav } from '@/features/catalyst/components/socials/onboarding/OnboardingNav'
import { RedditOnboardingShell } from '@/features/catalyst/components/socials/onboarding/RedditOnboardingShell'

// Reddit usernames: 3–20 chars, letters/numbers/underscore/hyphen.
const USERNAME_RE = /^[A-Za-z0-9_-]{3,20}$/

/** Strip a leading `u/` or `/u/` so users can paste either form. */
function normalize(raw: string): string {
  return raw.trim().replace(/^\/?u\//i, '')
}

interface RedditStepUsernameProps {
  value: string
  onChange: (value: string) => void
  onBack: () => void
  onNext: () => void
}

export function RedditStepUsername({
  value,
  onChange,
  onBack,
  onNext,
}: RedditStepUsernameProps): JSX.Element {
  const [touched, setTouched] = useState(false)
  const name = normalize(value)
  const valid = USERNAME_RE.test(name)
  const error = touched && !valid ? 'Enter a valid username (3–20 letters, numbers, _ or -).' : ''

  function handleNext(): void {
    setTouched(true)
    if (valid) onNext()
  }

  return (
    <RedditOnboardingShell
      step={2}
      title="What's your Reddit username?"
      subtitle="We'll use this to label your roadmap. Enter it without the u/ prefix."
    >
      <OnboardingField
        label="Username"
        prefix="u/"
        value={value}
        onChange={onChange}
        placeholder="your_username"
        error={error}
        hint="Example: seo_growth_guy"
      />
      <OnboardingNav
        onBack={onBack}
        onNext={handleNext}
        nextLabel="Continue"
        nextIcon={ArrowRight}
        nextDisabled={touched && !valid}
      />
    </RedditOnboardingShell>
  )
}
