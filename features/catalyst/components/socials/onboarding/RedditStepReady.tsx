'use client'

import { ArrowRight, CalendarCheck, Check, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { PrimaryButton } from '@/features/catalyst/components/PrimaryButton'
import { RedditOnboardingShell } from '@/features/catalyst/components/socials/onboarding/RedditOnboardingShell'

interface ReadyTileProps {
  icon: LucideIcon
  value: string
  label: string
}

function ReadyTile({ icon: Icon, value, label }: ReadyTileProps): JSX.Element {
  return (
    <div className="flex flex-col items-center rounded-md border border-[var(--cat-border)] bg-[var(--cat-content)] px-2 py-3 text-center">
      <Icon size={16} strokeWidth={2.2} className="text-[#FF4500]" />
      <p className="mt-1.5 text-[20px] leading-none font-bold tracking-tight text-[var(--cat-ink)]">
        {value}
      </p>
      <p className="mt-1 text-[10px] font-semibold tracking-wider text-[var(--cat-ink-3)] uppercase">
        {label}
      </p>
    </div>
  )
}

interface RedditStepReadyProps {
  onLaunch: () => void
}

export function RedditStepReady({ onLaunch }: RedditStepReadyProps): JSX.Element {
  return (
    <RedditOnboardingShell
      step={4}
      title="You're ready to grow on Reddit."
      subtitle="Here's what we built for you."
    >
      <div className="grid grid-cols-3 gap-2.5">
        <ReadyTile icon={Users} value="6" label="Subreddits" />
        <ReadyTile icon={CalendarCheck} value="20" label="Days warmup" />
        <ReadyTile icon={Check} value="✓" label="Daily roadmap" />
      </div>
      <div className="mt-5">
        <PrimaryButton icon={ArrowRight} onClick={onLaunch} className="w-full justify-center">
          Launch dashboard
        </PrimaryButton>
        <p className="mt-2.5 text-center text-[12px] text-[var(--cat-ink-3)]">
          Your dashboard is ready. No setup needed.
        </p>
      </div>
    </RedditOnboardingShell>
  )
}
