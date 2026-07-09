'use client'

import { ArrowLeft, ArrowRight, ChevronDown } from 'lucide-react'
import { useState } from 'react'

import { useOnboardingStore } from '@/stores/useOnboardingStore'

const ROLE_OPTIONS = [
  'Founder / CEO',
  'Marketing / Growth',
  'SEO / Content',
  'Account Manager',
  'Developer / Engineer',
  'Other',
] as const

const FIELD =
  'h-10 w-full rounded-md border border-neutral-200 bg-white px-3 text-[14px] text-foreground outline-none transition focus:border-foreground'

/** Agency-only step: collect the person's name, agency name and their role. */
export function OrgDetailsForm(): JSX.Element {
  const { userName, companyName, userRole, setUserName, setUserRole, setCompanyInfo, setStep } =
    useOnboardingStore()
  const [name, setName] = useState(userName)
  const [agency, setAgency] = useState(companyName)
  const [role, setRole] = useState(userRole)
  const [error, setError] = useState('')

  const handleContinue = (): void => {
    const trimmedName = name.trim()
    const trimmedAgency = agency.trim()
    if (!trimmedName || !trimmedAgency || !role) {
      setError('Please fill in your name, agency name and role.')
      return
    }
    setUserName(trimmedName)
    setUserRole(role)
    setCompanyInfo(trimmedAgency, '')
    setStep('auth-method')
  }

  return (
    <div className="space-y-3.5">
      <div className="space-y-1.5">
        <label className="text-[13px] font-medium text-neutral-600">Your name</label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Jane Doe"
          className={FIELD}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-[13px] font-medium text-neutral-600">Agency name</label>
        <input
          value={agency}
          onChange={e => setAgency(e.target.value)}
          placeholder="Acme Agency"
          className={FIELD}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-[13px] font-medium text-neutral-600">Your role</label>
        <div className="relative">
          <select
            value={role}
            onChange={e => setRole(e.target.value)}
            className={`${FIELD} appearance-none pr-9 ${role ? 'text-foreground' : 'text-neutral-400'}`}
          >
            <option value="" disabled>
              Select your position
            </option>
            {ROLE_OPTIONS.map(r => (
              <option key={r} value={r} className="text-foreground">
                {r}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-neutral-400" />
        </div>
      </div>

      {error && (
        <p className="border-destructive/20 bg-destructive/5 text-destructive rounded-md border px-3 py-2 text-xs font-medium">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={handleContinue}
        className="auth-cta-btn flex h-10 w-full items-center justify-center gap-1.5 rounded-md text-[15px] font-medium text-white"
      >
        Continue
        <ArrowRight className="h-4 w-4" />
      </button>

      <button
        type="button"
        onClick={() => setStep('account-type')}
        className="hover:text-foreground flex h-9 w-full items-center justify-center gap-1.5 text-[13px] text-neutral-500 transition"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back
      </button>
    </div>
  )
}
