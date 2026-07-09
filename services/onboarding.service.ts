import { z } from 'zod'

import { setAccountType as apiSetAccountType } from '@/lib/api/account'
import { generatePrompts, startAnalysis } from '@/lib/api/analyzer'
import { ApiError } from '@/lib/api/client'
import { fetchOnboardingToken } from '@/lib/api/onboarding'
import {
  checkOrganizationExists as apiCheckOrganizationExists,
  createOrganization as apiCreateOrganization,
} from '@/lib/api/organizations'
import { getSubscriptionStatus } from '@/lib/api/payments'
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
  /** The created brand-as-project id (set by createOrganization on success). */
  orgId?: number
}

export interface CreateOrganizationInput {
  name: string
  url: string
  email: string
}

/** Shape of the onboard endpoint's 409 body: the existing org to switch to. */
const conflictBodySchema = z.object({ organization: z.object({ id: z.number() }) })

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
  extras: { agencyName?: string; role?: string } = {},
): Promise<OnboardingResult> {
  if (USE_STUBS) {
    await delay(STUB_DELAY_MS)
    return { ok: true }
  }
  try {
    await apiSetAccountType(email, accountType, extras)
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
    const org = await apiCreateOrganization(input, token)
    return { ok: true, orgId: org.id }
  } catch (error) {
    // Org already exists → the 409 body carries the existing org; recover its id
    // so later steps (launch's verify_org_workspace) still have a real org_id.
    if (error instanceof ApiError && error.status === 409) {
      return { ok: true, orgId: orgIdFromConflict(error.data) }
    }
    return { ok: false, error: errMessage(error, 'Failed to save company info. Please try again.') }
  }
}

/** Pull the existing org id out of the onboard endpoint's 409 conflict body. */
function orgIdFromConflict(data: unknown): number | undefined {
  const parsed = conflictBodySchema.safeParse(data)
  return parsed.success ? parsed.data.organization.id : undefined
}

function fallbackPrompts(brandName: string): string[] {
  const brand = brandName.trim() || 'your brand'
  return [
    `What is ${brand} and what do they do?`,
    `Is ${brand} a good choice for small businesses?`,
    `What are the best alternatives to ${brand}?`,
    `How much does ${brand} cost?`,
    `${brand} reviews and reputation`,
  ]
}

/**
 * Suggest prompts to track for a brand/site via the analyzer's generate-prompts
 * endpoint (gated by a fresh onboarding token). Falls back to templated prompts
 * if the backend call fails so the step is never blocked.
 */
export async function suggestPrompts(input: {
  brandName: string
  brandUrl: string
}): Promise<string[]> {
  if (USE_STUBS) {
    await delay(STUB_DELAY_MS)
    return fallbackPrompts(input.brandName)
  }
  try {
    let token: string | undefined
    try {
      token = await fetchOnboardingToken()
    } catch {
      // Best-effort — the endpoint may accept the call without a token.
    }
    const prompts = await generatePrompts(input, token)
    return prompts.length > 0 ? prompts : fallbackPrompts(input.brandName)
  } catch {
    return fallbackPrompts(input.brandName)
  }
}

/**
 * Whether the email has an active subscription. The backend reports internal
 * (@optiminastic.com) emails as active too, so this doubles as the paywall
 * bypass. Fails open (true) so a transient error never wrongly blocks launch —
 * the analyzer's own gate still 403s a genuine non-subscriber.
 */
export async function hasActiveSubscription(email: string): Promise<boolean> {
  if (USE_STUBS) {
    await delay(STUB_DELAY_MS)
    return true
  }
  try {
    return (await getSubscriptionStatus(email)).is_active
  } catch {
    return true
  }
}

/** Kick off the first analysis run for the new brand-as-project (analyzer `analyze/`). */
export async function launchAnalysis(input: {
  url: string
  email: string
  orgId?: number
  brandName?: string
  prompts?: string[]
}): Promise<OnboardingResult> {
  if (USE_STUBS) {
    await delay(STUB_DELAY_MS)
    return { ok: true }
  }
  try {
    await startAnalysis({
      url: input.url,
      email: input.email,
      orgId: input.orgId,
      runType: 'single_page',
      brandName: input.brandName,
      prompts: input.prompts,
      verifyOrgWorkspace: true,
    })
    return { ok: true }
  } catch (error) {
    // 409 → a run for this org is already in flight; the loading screen will
    // pick it up, so treat as success.
    if (error instanceof ApiError && error.status === 409) return { ok: true }
    return { ok: false, error: errMessage(error, 'Failed to start analysis. Please try again.') }
  }
}
