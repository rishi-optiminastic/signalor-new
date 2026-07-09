'use client'

import { useQuery } from '@tanstack/react-query'

import { getIntegrationStatus } from '@/lib/api/integrations'
import { useSession } from '@/lib/auth-client'

/** Backend provider id → the catalog card slug it connects. */
const PROVIDER_SLUG: Record<string, string> = {
  ga4: 'google-analytics',
  google_analytics: 'google-analytics',
  gsc: 'search-console',
  search_console: 'search-console',
  shopify: 'shopify',
  wordpress: 'wordpress',
  woocommerce: 'wordpress',
  slack: 'slack',
  zapier: 'zapier',
}

function slugFor(provider: string): string {
  return PROVIDER_SLUG[provider.toLowerCase()] ?? provider.toLowerCase()
}

interface UseIntegrationsResult {
  connected: Set<string>
  isLoading: boolean
  isError: boolean
}

/** The set of catalog slugs that currently have an active backend integration. */
export function useIntegrations(): UseIntegrationsResult {
  const { data: session } = useSession()
  const email = session?.user?.email ?? undefined

  const query = useQuery({
    queryKey: ['catalyst', 'integrations', email ?? ''],
    enabled: Boolean(email),
    queryFn: async (): Promise<string[]> => {
      const rows = await getIntegrationStatus(email as string)
      return rows.filter(r => r.is_active).map(r => slugFor(r.provider))
    },
  })

  return {
    connected: new Set(query.data ?? []),
    isLoading: query.isLoading,
    isError: query.isError,
  }
}
