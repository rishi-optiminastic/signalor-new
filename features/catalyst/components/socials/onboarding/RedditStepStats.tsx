'use client'

import { Check } from 'lucide-react'
import { useState } from 'react'

import { OnboardingField } from '@/features/catalyst/components/socials/onboarding/OnboardingField'
import { OnboardingNav } from '@/features/catalyst/components/socials/onboarding/OnboardingNav'
import { RedditOnboardingShell } from '@/features/catalyst/components/socials/onboarding/RedditOnboardingShell'
import type { RedditProfile } from '@/features/catalyst/hooks/useRedditOnboarding'

/** A non-negative whole number (as a trimmed, non-empty string). */
function isCount(value: string): boolean {
  return /^\d+$/.test(value.trim())
}

interface StatFieldsProps {
  profile: RedditProfile
  setField: (key: keyof RedditProfile, value: string) => void
  karmaError: string
  ageError: string
}

function StatFields({ profile, setField, karmaError, ageError }: StatFieldsProps): JSX.Element {
  return (
    <div className="flex flex-col gap-3.5">
      <OnboardingField
        label="Total karma"
        type="number"
        inputMode="numeric"
        value={profile.karma}
        onChange={v => setField('karma', v)}
        placeholder="e.g. 120"
        error={karmaError}
      />
      <OnboardingField
        label="Account age (in days)"
        type="number"
        inputMode="numeric"
        value={profile.ageDays}
        onChange={v => setField('ageDays', v)}
        placeholder="e.g. 45"
        error={ageError}
      />
    </div>
  )
}

interface RedditStepStatsProps {
  profile: RedditProfile
  setField: (key: keyof RedditProfile, value: string) => void
  onBack: () => void
  onNext: () => void
}

export function RedditStepStats({
  profile,
  setField,
  onBack,
  onNext,
}: RedditStepStatsProps): JSX.Element {
  const [touched, setTouched] = useState(false)
  const karmaOk = isCount(profile.karma)
  const ageOk = isCount(profile.ageDays)

  function handleComplete(): void {
    setTouched(true)
    if (karmaOk && ageOk) onNext()
  }

  return (
    <RedditOnboardingShell
      step={3}
      title="Tell us about your account"
      subtitle="This helps us tailor the warm-up pace to where you're starting from."
    >
      <StatFields
        profile={profile}
        setField={setField}
        karmaError={touched && !karmaOk ? 'Enter your karma as a number.' : ''}
        ageError={touched && !ageOk ? 'Enter your account age in days.' : ''}
      />
      <OnboardingNav
        onBack={onBack}
        onNext={handleComplete}
        nextLabel="Complete"
        nextIcon={Check}
        nextDisabled={touched && !(karmaOk && ageOk)}
      />
    </RedditOnboardingShell>
  )
}
