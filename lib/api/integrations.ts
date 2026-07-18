import { z } from 'zod'

import { ApiError, apiDelete, apiGet, apiPost } from './client'

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

/* ──────────────────────────────────────────────── Google Search Console (GSC) */

/**
 * GET /api/integrations/google-search-console/auth-url/ → the Google OAuth URL.
 *
 * Unlike GA4, GSC's callback is server-side: Google redirects to the backend,
 * which exchanges the code and then sends the browser back to
 * `{frontend_base}{return_to}?gsc=connected|error`. Both are passed here so the
 * user lands back on the page they started from.
 */
export async function getGscAuthUrl(email: string, returnTo: string): Promise<string> {
  const data = await apiGet<unknown>('/api/integrations/google-search-console/auth-url/', {
    params: {
      email: normalizeEmail(email),
      return_to: returnTo,
      frontend_base: typeof window === 'undefined' ? '' : window.location.origin,
    },
  })
  return z.object({ auth_url: z.string() }).parse(data).auth_url
}

/** DELETE /api/integrations/google-search-console/disconnect/?email= */
export async function disconnectGsc(email: string): Promise<void> {
  await apiDelete<unknown>(
    `/api/integrations/google-search-console/disconnect/?email=${encodeURIComponent(normalizeEmail(email))}`,
  )
}

/** GET /api/integrations/shopify/auth-url/?email=&shop= → the app install URL. */
export async function getShopifyAuthUrl(email: string, shop: string): Promise<string> {
  const data = await apiGet<unknown>('/api/integrations/shopify/auth-url/', {
    params: { email: normalizeEmail(email), shop: shop.trim() },
  })
  return z.object({ auth_url: z.string() }).parse(data).auth_url
}

/** DELETE /api/integrations/shopify/disconnect/?email= → unlink the store. */
export async function disconnectShopify(email: string): Promise<void> {
  await apiDelete<unknown>(
    `/api/integrations/shopify/disconnect/?email=${encodeURIComponent(normalizeEmail(email))}`,
  )
}

interface ShopifyCustomAppInput {
  email: string
  shopDomain: string
  accessToken: string
}

/** Bare *.myshopify.com domain from whatever the user pasted. */
export function normalizeShopDomain(input: string): string {
  return input
    .trim()
    .replace(/^https?:\/\//, '')
    .replace(/\/.*$/, '')
    .toLowerCase()
}

/**
 * POST /api/integrations/shopify/connect/ → connect a store with a custom-app
 * Admin API access token. Validated against Shopify server-side; no OAuth app
 * registration needed, which is the practical path for local/self-hosted use.
 */
export async function connectShopifyCustomApp(input: ShopifyCustomAppInput): Promise<void> {
  await apiPost<unknown>('/api/integrations/shopify/connect/', {
    email: normalizeEmail(input.email),
    shop_domain: normalizeShopDomain(input.shopDomain),
    access_token: input.accessToken.trim(),
  })
}

/**
 * POST /api/integrations/google-analytics/callback/ → exchange the OAuth code.
 *
 * The backend needs the signed `state` Google echoes back (it carries the org id
 * and is HMAC-verified), NOT the caller's email — it identifies the org from the
 * state, not the session. Passing email instead of state is a guaranteed 400.
 */
export async function sendGACallback(code: string, state: string): Promise<void> {
  await apiPost<unknown>('/api/integrations/google-analytics/callback/', { code, state })
}

/** DELETE /api/integrations/google-analytics/disconnect/?email= → revoke + remove. */
export async function disconnectGA(email: string): Promise<void> {
  await apiDelete<unknown>(
    `/api/integrations/google-analytics/disconnect/?email=${encodeURIComponent(normalizeEmail(email))}`,
  )
}

export const gaPropertySchema = z.object({
  property_id: z.string(),
  display_name: z.string(),
  account_name: z.string().optional().default(''),
})
export type GAProperty = z.infer<typeof gaPropertySchema>

/**
 * GET /api/integrations/google-analytics/properties/?email= → the GA4 properties
 * this Google account can read.
 *
 * Connecting stores tokens but does not pick a property, and every downstream
 * call needs one: `fetch_ga4_data` raises "No GA4 property selected" and the sync
 * endpoint 400s without it. So this is a required step, not an optional one.
 */
export async function getGAProperties(email: string): Promise<GAProperty[]> {
  const data = await apiGet<unknown>('/api/integrations/google-analytics/properties/', {
    params: { email: normalizeEmail(email) },
  })
  return z.object({ properties: z.array(gaPropertySchema) }).parse(data).properties
}

/** POST /api/integrations/google-analytics/select-property/ → bind a property to the org. */
export async function selectGAProperty(options: {
  email: string
  propertyId: string
  propertyName?: string
}): Promise<void> {
  await apiPost<unknown>('/api/integrations/google-analytics/select-property/', {
    email: normalizeEmail(options.email),
    property_id: options.propertyId,
    property_name: options.propertyName ?? '',
  })
}

/** POST /api/integrations/google-analytics/sync/?email= → kick off a background GA4 pull. */
export async function syncGA(email: string): Promise<void> {
  await apiPost<unknown>(
    `/api/integrations/google-analytics/sync/?email=${encodeURIComponent(normalizeEmail(email))}`,
    {},
  )
}

export const gaCountrySchema = z.object({
  country: z.string(),
  country_id: z.string(),
  sessions: z.number(),
})
export type GACountry = z.infer<typeof gaCountrySchema>

export const gaDataSchema = z.object({
  sessions: z.number().default(0),
  organic_sessions: z.number().default(0),
  bounce_rate: z.number().default(0),
  avg_session_duration: z.number().default(0),
  countries: z.array(gaCountrySchema).default([]),
  sync_status: z.string().default('pending'),
  date_start: z.string().optional(),
  date_end: z.string().optional(),
})
export type GAData = z.infer<typeof gaDataSchema>

/**
 * GET /api/integrations/google-analytics/data/?email= → the latest GA4 snapshot.
 *
 * Returns null when GA isn't connected or has never synced — both are 404s from
 * the backend and are normal states, not errors worth surfacing.
 */
export async function getGAData(email: string): Promise<GAData | null> {
  try {
    const data = await apiGet<unknown>('/api/integrations/google-analytics/data/', {
      params: { email: normalizeEmail(email) },
    })
    return gaDataSchema.parse(data)
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null
    throw err
  }
}
