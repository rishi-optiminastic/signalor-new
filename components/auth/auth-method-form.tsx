'use client'

import { ArrowLeft, Loader2 } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { z } from 'zod'

import { isWorkEmail } from '@/lib/work-email'
import { checkOrganizationExists, sendVerificationOtp } from '@/services/onboarding.service'
import { useOnboardingStore } from '@/stores/useOnboardingStore'

import { GoogleButton } from './google-button'

const authEmailSchema = z.object({
  email: z.string().trim().toLowerCase().email('Enter a valid email address.'),
})

/** Step 2: continue with Google, or enter an email to receive a code. */
export function AuthMethodForm(): JSX.Element {
  const { authMode, accountType, setEmail, setStep, setSignupMethod } = useOnboardingStore()
  const [emailInput, setEmailInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const isSignUp = authMode === 'sign-up'
  // Agency sign-ups must use a company email — personal providers are rejected.
  const requireWorkEmail = isSignUp && accountType === 'agency'

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault()
    const parsed = authEmailSchema.safeParse({ email: emailInput })
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Enter a valid email address.')
      return
    }
    const email = parsed.data.email

    if (requireWorkEmail && !isWorkEmail(email)) {
      setError("Agency accounts require a work email. Personal providers aren't allowed.")
      return
    }

    setLoading(true)
    setError('')

    try {
      const orgExists = await checkOrganizationExists(email)
      if (isSignUp && orgExists) {
        setError('An account with this email already exists. Please sign in.')
        return
      }
      if (!isSignUp && !orgExists) {
        setError('No account found for this email. Please sign up first.')
        return
      }

      const sent = await sendVerificationOtp(email)
      if (!sent.ok) {
        setError(sent.error ?? 'Failed to send verification code. Please try again.')
        return
      }

      setEmail(email)
      setSignupMethod('email')
      setStep('otp-verify')
    } catch {
      setError('Failed to send verification code. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-5">
      <button
        type="button"
        onClick={() =>
          setStep(
            authMode === 'sign-up' && accountType === 'agency' ? 'org-details' : 'account-type',
          )
        }
        className="text-muted-foreground hover:text-foreground -mt-1 flex items-center gap-1 text-[11px] font-medium transition-colors"
      >
        <ArrowLeft className="h-3 w-3" />
        Back
      </button>

      <GoogleButton />

      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-neutral-200" />
        <span className="text-[11px] text-neutral-500">or continue with email</span>
        <span className="h-px flex-1 bg-neutral-200" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-3" noValidate>
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-foreground text-[15px] font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={emailInput}
            onChange={e => setEmailInput(e.target.value)}
            disabled={loading}
            className="shadow-input text-foreground placeholder:text-muted-foreground/55 focus:border-primary focus:ring-ring/50 h-[38px] w-full rounded-md border border-neutral-200 bg-white px-3 text-[13px] transition outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white disabled:opacity-60"
          />
          {isSignUp && (
            <p className="text-[11px] text-neutral-500">
              {requireWorkEmail
                ? "Use your company email — personal providers (gmail, outlook…) aren't allowed."
                : 'Use your work email.'}
            </p>
          )}
        </div>

        {error && (
          <p role="alert" className="text-destructive text-[11px] font-medium">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="auth-cta-btn flex h-10 w-full items-center justify-center gap-1.5 rounded-md text-[15px] font-medium text-white"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending…
            </>
          ) : isSignUp ? (
            'Sign up'
          ) : (
            'Sign in'
          )}
        </button>
      </form>
    </div>
  )
}
