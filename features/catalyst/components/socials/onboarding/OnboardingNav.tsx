import type { LucideIcon } from 'lucide-react'

import { PrimaryButton } from '@/features/catalyst/components/PrimaryButton'

interface OnboardingNavProps {
  onBack: () => void
  onNext: () => void
  nextLabel: string
  nextIcon?: LucideIcon
  nextDisabled?: boolean
}

export function OnboardingNav({
  onBack,
  onNext,
  nextLabel,
  nextIcon,
  nextDisabled = false,
}: OnboardingNavProps): JSX.Element {
  return (
    <div className="mt-5 flex items-center justify-between gap-2">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex h-[34px] items-center rounded-md px-3 text-[13px] font-medium text-[var(--cat-ink-2)] transition-colors hover:bg-[var(--cat-hover)]"
      >
        Back
      </button>
      <PrimaryButton icon={nextIcon} onClick={onNext} disabled={nextDisabled}>
        {nextLabel}
      </PrimaryButton>
    </div>
  )
}
