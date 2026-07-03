import { setAccountType as apiSetAccountType } from '@/lib/api/account'
import { ApiError } from '@/lib/api/client'
import { fetchOnboardingToken } from '@/lib/api/onboarding'
import {
  checkOrganizationExists as apiCheckOrganizationExists,
  createOrganization as apiCreateOrganization,
} from '@/lib/api/organizations'
import { authClient, signIn } from '@/lib/auth-client'
import { env } from '@/lib/env'
import type { AccountType } from '@/stores/useOnboardingStore'

/**
 * ─── Onboarding service ──────────────────────────────────────────────────────
 *
 * Orchestration over the signalor backend (org/account/analyzer) and better-auth
 * (email OTP). When NEXT_PUBLIC_USE_STUBS='true' every call returns mocked data
 * so the full UI is clickable without a DB/backend — flip it off to go live.
 * UI components depend only on these signatures, unchanged either way.
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

const USE_STUBS = env.NEXT_PUBLIC_USE_STUBS === 'true'
const STUB_DELAY_MS = 500

function delay(ms: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

function errMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiError) return error.message
  if (error instanceof Error && error.message) return error.message
  return fallback
}

/** Whether an organization already exists for this email (backend). */
export async function checkOrganizationExists(email: string): Promise<boolean> {
  if (USE_STUBS) {
    await delay(STUB_DELAY_MS)
    return false // stub: treat every email as new
  }
  return apiCheckOrganizationExists(email)
}

/** Send a 6-digit OTP to the email via better-auth. */
export async function sendVerificationOtp(email: string): Promise<OnboardingResult> {
  if (USE_STUBS) {
    await delay(STUB_DELAY_MS)
    return { ok: true }
  }
  const { error } = await authClient.emailOtp.sendVerificationOtp({ email, type: 'sign-in' })
  if (error) {
    return { ok: false, error: error.message ?? 'Failed to send verification code.' }
  }
  return { ok: true }
}

/** Verify the OTP and establish a session (creates the user if new). */
export async function verifyOtp(email: string, code: string): Promise<OnboardingResult> {
  if (USE_STUBS) {
    await delay(STUB_DELAY_MS)
    // stub: accept any 6-digit code
    if (!/^\d{6}$/.test(code)) return { ok: false, error: 'Enter the 6-digit code.' }
    return { ok: true }
  }
  const { error } = await signIn.emailOtp({ email, otp: code })
  if (error) {
    return { ok: false, error: error.message ?? 'Invalid or expired code. Please try again.' }
  }
  return { ok: true }
}

/** Persist the Individual/Agency choice once the email is verified (best-effort). */
export async function persistAccountType(
  email: string,
  accountType: AccountType,
): Promise<OnboardingResult> {
  if (USE_STUBS) {
    await delay(STUB_DELAY_MS)
    return { ok: true }
  }
  try {
    await apiSetAccountType(email, accountType)
    return { ok: true }
  } catch (error) {
    return { ok: false, error: errMessage(error, 'Failed to save account type.') }
  }
}

/** Create the organization, fetching a single-use onboarding token first. */
export async function createOrganization(
  input: CreateOrganizationInput,
): Promise<OnboardingResult> {
  if (USE_STUBS) {
    await delay(STUB_DELAY_MS)
    return { ok: true }
  }
  try {
    let token: string | undefined
    try {
      token = await fetchOnboardingToken()
    } catch {
      // Best-effort — let the server's 401 surface if the token is required.
    }
    await apiCreateOrganization(input, token)
    return { ok: true }
  } catch (error) {
    // Org already exists → treat as success and move on.
    if (error instanceof ApiError && error.status === 409) return { ok: true }
    return { ok: false, error: errMessage(error, 'Failed to save company info. Please try again.') }
  }
}

/**
 * Suggest prompts to track for a brand/site.
 * TODO(wire): backend prompt-suggestion endpoint. Client fallback for now.
 */
export async function suggestPrompts(companyName: string): Promise<string[]> {
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
 * TODO(wire): POST the analyzer "create run" endpoint.
 */
export async function launchAnalysis(): Promise<OnboardingResult> {
  return { ok: true }
}
