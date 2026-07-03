import type { AccountType } from '@/stores/useOnboardingStore'

/**
 * ─── STUBBED onboarding API ──────────────────────────────────────────────────
 *
 * These functions mock the multi-step onboarding backend so the flow is fully
 * clickable BEFORE any real wiring. Every function returns a happy-path result
 * after a short fake delay. Swap each body for the real signalor backend call
 * (endpoints noted in the TODOs) when we go live — the signatures are the
 * contract the UI depends on, so keep them stable.
 */

export interface OnboardingResult {
  ok: boolean
  error?: string
}

export interface CreateOrganizationInput {
  name: string
  url: string
  email: string
}

const STUB_DELAY_MS = 500

function delay(ms: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

/**
 * Whether an organization already exists for this email.
 * TODO(wire): GET /organizations/exists?email= (or the existing check endpoint).
 * Stub: always false → every email is treated as a brand-new user.
 */
export async function checkOrganizationExists(_email: string): Promise<boolean> {
  await delay(STUB_DELAY_MS)
  return false
}

/**
 * Send a 6-digit verification code to the email.
 * TODO(wire): authClient.emailOtp.sendVerificationOtp({ email, type: 'sign-in' }).
 * Stub: resolves ok; use any 6 digits to "verify".
 */
export async function sendVerificationOtp(_email: string): Promise<OnboardingResult> {
  await delay(STUB_DELAY_MS)
  return { ok: true }
}

/**
 * Verify the OTP for an email.
 * TODO(wire): authClient.signIn.emailOtp({ email, otp }).
 * Stub: accepts any 6-digit code.
 */
export async function verifyOtp(_email: string, code: string): Promise<OnboardingResult> {
  await delay(STUB_DELAY_MS)
  if (!/^\d{6}$/.test(code)) {
    return { ok: false, error: 'Enter the 6-digit code.' }
  }
  return { ok: true }
}

/**
 * Persist the chosen account type once we have a verified email.
 * TODO(wire): POST /account/type { email, accountType }.
 * Stub: resolves ok.
 */
export async function persistAccountType(
  _email: string,
  _accountType: AccountType,
): Promise<OnboardingResult> {
  await delay(STUB_DELAY_MS)
  return { ok: true }
}

/**
 * Create the organization / company record.
 * TODO(wire): POST /organizations/onboard (with single-use onboarding token).
 * Stub: resolves ok.
 */
export async function createOrganization(
  _input: CreateOrganizationInput,
): Promise<OnboardingResult> {
  await delay(STUB_DELAY_MS)
  return { ok: true }
}

/**
 * Suggest prompts to track for a brand/site.
 * TODO(wire): POST /prompts/suggest { companyName, siteUrl }.
 * Stub: returns a few generic starter prompts.
 */
export async function suggestPrompts(companyName: string): Promise<string[]> {
  await delay(STUB_DELAY_MS)
  const brand = companyName.trim() || 'your brand'
  return [
    `What is ${brand} and what do they do?`,
    `Is ${brand} a good choice for small businesses?`,
    `What are the best alternatives to ${brand}?`,
    `How much does ${brand} cost?`,
    `${brand} reviews and reputation`,
  ]
}

/**
 * Kick off the first analysis run for the new org.
 * TODO(wire): POST /analyze / create first run.
 * Stub: resolves ok.
 */
export async function launchAnalysis(): Promise<OnboardingResult> {
  await delay(STUB_DELAY_MS)
  return { ok: true }
}
