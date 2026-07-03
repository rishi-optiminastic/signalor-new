import { z } from 'zod'

import { apiPost } from './client'

const tokenSchema = z.object({
  token: z.string().min(1),
  expires_in: z.number().int().positive(),
  turnstile_enabled: z.boolean(),
})

/**
 * POST /api/analyzer/onboarding-start/ → a single-use, 15-min token that gates
 * the org onboard endpoint. Fetch a fresh one per gated call (tokens are
 * consumed server-side after a successful verify).
 */
export async function fetchOnboardingToken(turnstileToken = ''): Promise<string> {
  const data = await apiPost<unknown>('/api/analyzer/onboarding-start/', {
    turnstile_token: turnstileToken,
  })
  return tokenSchema.parse(data).token
}
