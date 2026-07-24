'use client'

import { useEffect, useState } from 'react'

import { Globe } from '@/lib/icons'

/** Best-effort hostname from a partially-typed URL, or '' if it isn't a domain yet. */
function domainFromInput(value: string): string {
  const v = value.trim()
  if (!v) return ''
  try {
    const host = new URL(/^https?:\/\//.test(v) ? v : `https://${v}`).hostname
    return host.includes('.') ? host : ''
  } catch {
    return ''
  }
}

/**
 * Shows the entered site's favicon (via Google's favicon service) as the user
 * types, so they can confirm they typed the right site. Falls back to a muted
 * globe before a domain resolves or if the favicon can't be loaded.
 */
export function SiteFavicon({ value }: { value: string }): JSX.Element {
  const [domain, setDomain] = useState('')
  const [failed, setFailed] = useState(false)

  // Debounce so we don't request a favicon on every keystroke.
  useEffect(() => {
    const id = setTimeout(() => setDomain(domainFromInput(value)), 400)
    return () => clearTimeout(id)
  }, [value])

  useEffect(() => setFailed(false), [domain])

  if (!domain || failed) return <Globe className="h-4 w-4 text-neutral-300" aria-hidden />
  // External favicon (Google's service) — a plain img, not next/image, so it
  // isn't run through the optimiser or gated on a remotePatterns config.
  return (
    <img
      src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
      alt=""
      width={16}
      height={16}
      className="h-4 w-4 rounded-sm"
      onError={() => setFailed(true)}
    />
  )
}
