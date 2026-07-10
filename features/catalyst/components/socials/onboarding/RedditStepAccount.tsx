'use client'

import { ExternalLink, UserPlus } from 'lucide-react'

import { PrimaryButton } from '@/features/catalyst/components/PrimaryButton'
import { RedditOnboardingShell } from '@/features/catalyst/components/socials/onboarding/RedditOnboardingShell'

const REDDIT_SIGNUP_URL = 'https://www.reddit.com/register/'

const SECONDARY_BTN =
  'inline-flex h-[34px] w-full items-center justify-center rounded-md border border-[var(--cat-border)] bg-[var(--cat-card)] px-3.5 text-[13px] font-semibold text-[var(--cat-ink)] transition-colors hover:bg-[var(--cat-hover)]'

interface RedditStepAccountProps {
  onNext: () => void
}

export function RedditStepAccount({ onNext }: RedditStepAccountProps): JSX.Element {
  function handleCreate(): void {
    window.open(REDDIT_SIGNUP_URL, '_blank', 'noopener,noreferrer')
    onNext()
  }

  return (
    <RedditOnboardingShell
      step={1}
      title="Do you have a Reddit account?"
      subtitle="You'll need one to start growing on Reddit. Create a fresh account, or continue with the one you already have."
    >
      <div className="flex flex-col gap-2.5">
        <PrimaryButton icon={UserPlus} onClick={handleCreate} className="w-full justify-center">
          Create an account
        </PrimaryButton>
        <button type="button" onClick={onNext} className={SECONDARY_BTN}>
          I already have an account
        </button>
        <p className="mt-1 flex items-center justify-center gap-1 text-[11px] text-[var(--cat-ink-3)]">
          <ExternalLink size={11} strokeWidth={2.1} />
          Creating one opens reddit.com in a new tab
        </p>
      </div>
    </RedditOnboardingShell>
  )
}
