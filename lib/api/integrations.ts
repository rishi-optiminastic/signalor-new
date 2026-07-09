import { z } from 'zod'

import { apiGet, apiPost } from './client'

/**
 * Integrations API — GA4 / Shopify / GSC connections live in the backend's
 * `apps.integrations`. The dashboard only needs to know which providers are
 * connected (to flip catalog cards and gate the Analytics tab).
 */

function normalizeEmail(email: string): string {
  return email.toLowerCase().trim()
}

export const integrationStatusSchema = z.object({
  provider: z.string(),
  provider_display: z.string().optional().default(''),
  is_active: z.boolean().optional().default(false),
})
export type IntegrationStatus = z.infer<typeof integrationStatusSchema>

/** GET /api/integrations/status/?email=&org_id= → the org's connected integrations. */
export async function getIntegrationStatus(
  email: string,
  orgId?: number,
): Promise<IntegrationStatus[]> {
  const data = await apiGet<unknown>('/api/integrations/status/', {
    params: { email: normalizeEmail(email), org_id: orgId ? String(orgId) : undefined },
  })
  return z.array(integrationStatusSchema).parse(data)
}

/* ─────────────────────────────────────────────────────── Google Analytics (GA4) */

/** GET /api/integrations/google-analytics/auth-url/?email= → the Google OAuth URL. */
export async function getGAAuthUrl(email: string): Promise<string> {
  const data = await apiGet<unknown>('/api/integrations/google-analytics/auth-url/', {
    params: { email: normalizeEmail(email) },
  })
  return z.object({ auth_url: z.string() }).parse(data).auth_url
}

/** POST /api/integrations/google-analytics/callback/ → exchange the OAuth code. */
export async function sendGACallback(email: string, code: string): Promise<void> {
  await apiPost<unknown>('/api/integrations/google-analytics/callback/', {
    email: normalizeEmail(email),
    code,
  })
}
