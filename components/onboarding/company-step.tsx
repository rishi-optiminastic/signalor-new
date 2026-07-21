'use client'

import { ArrowRight } from 'lucide-react'
import { useState, type FormEvent } from 'react'

import { ONBOARDING_INPUT_CLASS } from '@/components/onboarding/input-class'
import { useOnboardingWizardStore } from '@/stores/useOnboardingWizardStore'

/** Step 1: brand name. */
export function CompanyStep(): JSX.Element {
  const { companyName, setCompanyName, setStep } = useOnboardingWizardStore()
  const [name, setName] = useState(companyName)

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault()
    if (!name.trim()) return
    setCompanyName(name.trim())
    setStep('platform')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5">
      <div className="space-y-2">
        <label htmlFor="brand" className="text-foreground text-[15px] font-medium">
          Brand name
        </label>
        <input
          id="brand"
          autoFocus
          placeholder="Acme Inc."
          value={name}
          onChange={e => setName(e.target.value)}
          className={ONBOARDING_INPUT_CLASS}
        />
      </div>
      <button
        type="submit"
        disabled={!name.trim()}
        className="auth-cta-btn flex h-10 w-full items-center justify-center gap-1.5 rounded-md text-[15px] font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        Continue
        <ArrowRight className="h-4 w-4" />
      </button>
    </form>
  )
}
