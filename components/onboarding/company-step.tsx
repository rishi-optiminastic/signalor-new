'use client'

import { ArrowRight } from 'lucide-react'
import { useState, type FormEvent } from 'react'

import { useOnboardingWizardStore } from '@/stores/useOnboardingWizardStore'

const INPUT_CLASS =
  'shadow-input h-[38px] w-full rounded-md border border-neutral-200 bg-white px-3 text-[13px] text-foreground outline-none transition placeholder:text-muted-foreground/55 focus:border-primary focus:ring-2 focus:ring-ring/50 focus:ring-offset-2 focus:ring-offset-white disabled:opacity-60'

/** Step 1: company name. */
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
      <div className="space-y-1.5">
        <label htmlFor="company" className="text-foreground text-[15px] font-medium">
          Company name
        </label>
        <input
          id="company"
          autoFocus
          placeholder="Acme Inc."
          value={name}
          onChange={e => setName(e.target.value)}
          className={INPUT_CLASS}
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
