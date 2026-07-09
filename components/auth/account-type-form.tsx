'use client'

import { ArrowRight, Building2, Check, Users } from 'lucide-react'
import { useState } from 'react'

import { cn } from '@/lib/utils'
import { useOnboardingStore, type AccountType } from '@/stores/useOnboardingStore'

interface Option {
  value: AccountType
  label: string
  blurb: string
  Icon: typeof Building2
}

const OPTIONS: Option[] = [
  {
    value: 'individual',
    label: 'Sign up as an Individual',
    blurb: 'Track one brand or domain with self-serve tools. Any email works.',
    Icon: Building2,
  },
  {
    value: 'agency',
    label: 'Sign up as an Agency',
    blurb: 'Manage multiple client brands with higher limits. Work email required.',
    Icon: Users,
  },
]

/** Step 1: choose Individual vs Agency. Drives the rest of the flow. */
export function AccountTypeForm(): JSX.Element {
  const accountType = useOnboardingStore(s => s.accountType)
  const authMode = useOnboardingStore(s => s.authMode)
  const setAccountType = useOnboardingStore(s => s.setAccountType)
  const setStep = useOnboardingStore(s => s.setStep)
  const [selected, setSelected] = useState<AccountType>(accountType)

  const handleContinue = (): void => {
    setAccountType(selected)
    // Agencies fill in their name / agency / role before choosing an auth method.
    setStep(authMode === 'sign-up' && selected === 'agency' ? 'org-details' : 'auth-method')
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        {OPTIONS.map(opt => {
          const active = selected === opt.value
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => setSelected(opt.value)}
              className={cn(
                'flex w-full items-start gap-3 rounded-md border bg-white px-3 py-3 text-left transition-colors',
                active
                  ? 'border-foreground ring-foreground ring-1'
                  : 'border-neutral-200 hover:border-neutral-300',
              )}
            >
              <span
                className={cn(
                  'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md',
                  active ? 'bg-foreground text-white' : 'bg-muted text-muted-foreground',
                )}
              >
                <opt.Icon className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-2">
                  <span className="text-foreground text-[15px] font-semibold">{opt.label}</span>
                  {active && <Check className="text-foreground h-4 w-4 shrink-0" />}
                </span>
                <span className="mt-0.5 block text-xs leading-relaxed font-light text-neutral-400">
                  {opt.blurb}
                </span>
              </span>
            </button>
          )
        })}
      </div>
      <button
        type="button"
        onClick={handleContinue}
        className="auth-cta-btn flex h-10 w-full items-center justify-center gap-1.5 rounded-md text-[15px] font-medium text-white"
      >
        Continue
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  )
}
