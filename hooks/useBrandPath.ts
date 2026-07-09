'use client'

import { useParams } from 'next/navigation'

/**
 * Builds brand-scoped dashboard paths from the active brand slug in the URL:
 * `brandPath('tasks')` → `/dashboard/<slug>/tasks`, `brandPath()` → the overview.
 * Falls back to `/dashboard` when no slug is present (it redirects to a brand).
 */
export function useBrandPath(): (sub?: string) => string {
  const params = useParams()
  const slug = typeof params?.slug === 'string' ? params.slug : undefined
  return (sub = ''): string => {
    if (!slug) return '/dashboard'
    return sub ? `/dashboard/${slug}/${sub}` : `/dashboard/${slug}`
  }
}
