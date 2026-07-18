'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { z } from 'zod'
import { Button } from '@/features/site/components/ui/button'
import { Input } from '@/features/site/components/ui/input'
import { Label } from '@/features/site/components/ui/label'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/features/site/components/ui/input-otp'
import { authClient } from '@/features/site/lib/auth-client'
import { checkCreatorExists } from '@/features/site/lib/api/partners-program'
import { ArrowRight, Loader2 } from '@/features/site/components/icons'

const OTP_LENGTH = 6

const emailSchema = z.object({
  email: z.string().trim().toLowerCase().email('Enter a valid email address.'),
})
const otpSchema = z.object({
  otp: z
    .string()
    .length(OTP_LENGTH, `Enter the ${OTP_LENGTH}-digit code.`)
    .regex(/^\d+$/, 'Code must contain only digits.'),
})

type Mode = 'sign-in' | 'sign-up'

interface CreatorAuthCardProps {
  mode: Mode
}

export function CreatorAuthCard({ mode }: CreatorAuthCardProps) {
  const router = useRouter()
  const params = useSearchParams()
  const returnTo = params.get('returnTo') || ''

  const [step, setStep] = useState<'email' | 'otp'>('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault()
    const parsed = emailSchema.safeParse({ email })
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Enter a valid email address.')
      return
    }
    const value = parsed.data.email
    setLoading(true)
    setError('')
    try {
      await authClient.emailOtp.sendVerificationOtp({ email: value, type: 'sign-in' })
      setEmail(value)
      setStep('otp')
    } catch {
      setError("Couldn't send the code. Try again.")
    } finally {
      setLoading(false)
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    const parsed = otpSchema.safeParse({ otp })
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? `Enter the ${OTP_LENGTH}-digit code.`)
      return
    }
    setLoading(true)
    setError('')
    try {
      await authClient.signIn.emailOtp({ email, otp })

      const existing = await checkCreatorExists(email).catch(() => ({ exists: false }))

      if (mode === 'sign-in' && !existing.exists) {
        setError('No creator account for this email. Apply first to get your link.')
        await authClient.signOut()
        setLoading(false)
        return
      }

      // After auth: existing creator → dashboard; new → returnTo (apply form) or apply.
      if (existing.exists) {
        router.replace('/creator-dashboard')
      } else {
        const safeReturn =
          returnTo && returnTo.startsWith('/') ? returnTo : '/creators-program/apply'
        router.replace(safeReturn)
      }
    } catch {
      setError('Invalid or expired code. Try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleResend() {
    setError('')
    try {
      await authClient.emailOtp.sendVerificationOtp({ email, type: 'sign-in' })
    } catch {
      setError("Couldn't resend. Try again.")
    }
  }

  const altMode: Mode = mode === 'sign-in' ? 'sign-up' : 'sign-in'
  const altHref = `/creator/${altMode}${returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : ''}`

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-black/8 bg-white p-6 shadow-md sm:p-8">
      <p className="text-muted-foreground text-[11px] font-semibold tracking-[0.22em] uppercase">
        [ creators program ]
      </p>
      <h1 className="text-foreground mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
        {step === 'otp'
          ? 'Verify your email'
          : mode === 'sign-up'
            ? 'Create your creator account'
            : 'Welcome back, creator'}
      </h1>
      <p className="text-muted-foreground mt-1.5 text-[13px] leading-relaxed">
        {step === 'otp' ? (
          <>
            Code sent to <span className="text-foreground font-medium">{email}</span>.
          </>
        ) : mode === 'sign-up' ? (
          'Sign up with email to apply and access your dashboard. Creator accounts are separate from your SignalorAI SaaS account.'
        ) : (
          'Sign in to manage your creator profile, see earnings, and update payout details.'
        )}
      </p>

      <div className="mt-6">
        {step === 'email' ? (
          <form onSubmit={handleSendOtp} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="creator-email" className="text-foreground text-xs font-medium">
                Email
              </Label>
              <Input
                id="creator-email"
                type="email"
                placeholder="you@domain.com"
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="h-10 rounded-md border-black/12 bg-white text-[13px]"
              />
            </div>
            {error && (
              <p className="text-destructive text-xs font-medium" role="alert">
                {error}
              </p>
            )}
            <Button
              type="submit"
              disabled={loading}
              className="bg-foreground text-background h-10 w-full gap-2 rounded-md text-[13px] font-semibold hover:opacity-90"
            >
              {loading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <ArrowRight className="size-4" />
              )}
              {loading ? 'Sending…' : mode === 'sign-up' ? 'Get my code' : 'Send sign-in code'}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-foreground text-xs font-medium">Enter the 6-digit code</Label>
              <div className="flex justify-center">
                <InputOTP maxLength={OTP_LENGTH} value={otp} onChange={setOtp}>
                  <InputOTPGroup>
                    {Array.from({ length: OTP_LENGTH }, (_, i) => (
                      <InputOTPSlot key={i} index={i} className="h-9 w-9 text-sm" />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>
            {error && <p className="text-destructive text-xs font-medium">{error}</p>}
            <Button
              type="submit"
              disabled={loading || otp.length !== OTP_LENGTH}
              className="bg-foreground text-background h-10 w-full gap-2 rounded-md text-[13px] font-semibold hover:opacity-90"
            >
              {loading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <ArrowRight className="size-4" />
              )}
              {loading ? 'Verifying…' : 'Verify and continue'}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={handleResend}
              className="text-muted-foreground hover:text-foreground h-9 w-full rounded-md text-xs font-medium"
            >
              Resend code
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setStep('email')
                setOtp('')
                setError('')
              }}
              className="text-muted-foreground hover:text-foreground h-9 w-full rounded-md text-xs font-medium"
            >
              Use a different email
            </Button>
          </form>
        )}
      </div>

      <p className="text-muted-foreground mt-6 text-center text-xs">
        {mode === 'sign-up' ? 'Already a creator?' : 'New here?'}{' '}
        <Link
          href={altHref}
          className="text-foreground hover:decoration-foreground font-semibold underline decoration-neutral-300 underline-offset-2"
        >
          {mode === 'sign-up' ? 'Sign in' : 'Apply now'}
        </Link>
      </p>
    </div>
  )
}
