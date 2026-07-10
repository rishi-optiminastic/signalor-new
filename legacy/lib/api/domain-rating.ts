export interface DomainRatingResult {
  domain: string
  /** 0-100 Domain Rating from Ahrefs. */
  domain_rating: number
}

/**
 * Free Domain Rating lookup. Calls the Next route (`/api/tools/domain-rating`),
 * which proxies Ahrefs' public DR endpoint server-side (avoids browser CORS).
 */
export async function checkDomainRating(domain: string): Promise<DomainRatingResult> {
  const res = await fetch('/api/tools/domain-rating', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ domain }),
  })

  if (!res.ok) {
    let detail = "Couldn't fetch domain rating. Try again."
    try {
      const data = (await res.json()) as { error?: string }
      if (data?.error) detail = data.error
    } catch {
      /* ignore non-JSON error bodies */
    }
    throw new Error(detail)
  }

  return (await res.json()) as DomainRatingResult
}
