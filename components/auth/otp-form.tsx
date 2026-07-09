'use client'

import { ArrowLeft, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, type FormEvent } from 'react'

import { authClient } from '@/lib/auth-client'
import { routes } from '@/lib/routes'
import { persistAccountType, sendVerificationOtp, verifyOtp } from '@/services/onboarding.service'
import { useOnboardingStore } from '@/stores/useOnboardingStore'

import { OtpInput } from './otp-input'

const OTP_LENGTH = 6

/** Step 3: verify the 6-digit code sent to the email. */
export function OtpForm(): JSX.Element {
  const router = useRouter()
  const { email, authMode, accountType, companyName, userName, userRole, setStep } =
    useOnboardingStore()
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [error, setError] = useState('')

  const handleVerify = async (e: FormEvent): Promise<void> => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const result = await verifyOtp(email, otp)
      if (!result.ok) {
        setError(result.error ?? 'Invalid or expired code. Please try again.')
        return
      }

      if (authMode === 'sign-up') {
        // Persist the account type (+ agency name / role for agencies) now that
        // the email is verified, then continue into the product onboarding wizard.
        if (userName) await authClient.updateUser({ name: userName }).catch(() => {})
        await persistAccountType(email, accountType, {
          agencyName: companyName,
          role: userRole,
        })
        router.push(routes.onboarding)
      } else {
        setStep('complete')
      }
    } catch {
      setError('Invalid or expired code. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async (): Promise<void> => {
    setResending(true)
    setError('')
    try {
      await sendVerificationOtp(email)
    } catch {
      setError('Failed to resend code.')
    } finally {
      setResending(false)
    }
  }

  return (
    <form onSubmit={handleVerify} className="space-y-4">
      <button
        type="button"
        onClick={() => setStep('auth-method')}
        className="text-muted-foreground hover:text-foreground -mt-1 flex items-center gap-1 text-[11px] font-medium transition-colors"
      >
        <ArrowLeft className="h-3 w-3" />
        Back
      </button>

      <div className="space-y-2.5">
        <p className="text-[13px] font-light text-neutral-400">
          We sent a code to{' '}
          <span className="text-foreground font-medium">{email || 'your email'}</span>
        </p>
        <OtpInput value={otp} onChange={setOtp} length={OTP_LENGTH} disabled={loading} autoFocus />
      </div>

      {error && (
        <p role="alert" className="text-destructive text-[11px] font-medium">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading || otp.length !== OTP_LENGTH}
        className="auth-cta-btn flex h-10 w-full items-center justify-center gap-1.5 rounded-md text-[15px] font-medium text-white"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Verifying…
          </>
        ) : (
          'Verify'
        )}
      </button>

      <button
        type="button"
        onClick={handleResend}
        disabled={resending}
        className="text-muted-foreground hover:text-foreground h-8 w-full text-xs font-medium transition-colors disabled:opacity-60"
      >
        {resending ? 'Resending…' : 'Resend code'}
      </button>
    </form>
  )
}
