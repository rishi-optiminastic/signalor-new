'use client'

import { useState } from 'react'

interface BrandFaviconProps {
  domain: string
  name: string
  /** Monogram tile colour used when no favicon can be loaded. */
  color: string
  size?: number
}

/** A brand's real favicon (via Google's favicon service), falling back to a
 * coloured monogram tile when the domain has no icon or it fails to load. */
export function BrandFavicon({ domain, name, color, size = 40 }: BrandFaviconProps): JSX.Element {
  const [failed, setFailed] = useState(false)

  if (!domain || failed) {
    return (
      <span
        className="grid shrink-0 place-items-center rounded-md text-[15px] font-bold text-white"
        style={{ background: color, width: size, height: size }}
      >
        {(name[0] ?? '?').toUpperCase()}
      </span>
    )
  }

  return (
    <span
      className="grid shrink-0 place-items-center overflow-hidden rounded-md border border-[var(--cat-border)] bg-white"
      style={{ width: size, height: size }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=64`}
        alt=""
        width={size - 14}
        height={size - 14}
        onError={() => setFailed(true)}
      />
    </span>
  )
}
