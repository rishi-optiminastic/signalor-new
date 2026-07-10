import type { ReactNode } from 'react'

import { RedditIcon } from '@/features/catalyst/components/RedditIcon'

interface RedditOnboardingShellProps {
  /** 1-based current step, used to fill the progress bar (of 4). */
  step: number
  title: string
  subtitle?: string
  children: ReactNode
}

const TOTAL_STEPS = 4

function Stepper({ current }: { current: number }): JSX.Element {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: TOTAL_STEPS }, (_, i) => (
        <span
          key={i}
          className={`h-1.5 flex-1 rounded-full ${
            i < current ? 'bg-[#FF4500]' : 'bg-[var(--cat-hover)]'
          }`}
        />
      ))}
    </div>
  )
}

export function RedditOnboardingShell({
  step,
  title,
  subtitle,
  children,
}: RedditOnboardingShellProps): JSX.Element {
  return (
    <div className="flex min-h-0 flex-1 items-start justify-center pt-6 sm:items-center sm:pt-0">
      <div className="w-full max-w-md">
        <div className="mb-4 flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-[#FF4500] text-white">
            <RedditIcon size={18} className="text-white" />
          </span>
          <p className="text-[13px] font-semibold text-[var(--cat-ink-2)]">Set up Reddit</p>
          <span className="ml-auto text-[11px] font-medium text-[var(--cat-ink-3)]">
            Step {step} of {TOTAL_STEPS}
          </span>
        </div>
        <Stepper current={step} />
        <div className="cat-rise mt-4 rounded-md border border-[var(--cat-border)] bg-[var(--cat-card)] p-6 shadow-[0_1px_2px_rgba(16,24,40,.04)]">
          <h2 className="text-[17px] font-bold tracking-tight text-[var(--cat-ink)]">{title}</h2>
          {subtitle && (
            <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--cat-ink-2)]">{subtitle}</p>
          )}
          <div className="mt-5">{children}</div>
        </div>
      </div>
    </div>
  )
}
