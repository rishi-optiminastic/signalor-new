import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { z } from 'zod'

export const runtime = 'nodejs'

const requestSchema = z.object({
  domain: z.string().trim().min(1, 'A valid domain is required.'),
})

interface DomainRatingResult {
  domain: string
  /** 0-100 Domain Rating from Ahrefs. */
  domain_rating: number
}

/** Strip scheme, www., and any path/query so Ahrefs gets a bare hostname. */
function normalizeDomain(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/[/?#].*$/, '')
}

/**
 * Free Domain Rating lookup. Proxies Ahrefs' public DR endpoint server-side so
 * the browser never hits it directly (avoids CORS). Returns just the 0-100 DR.
 */
export async function POST(req: NextRequest) {
  try {
    const parsed = requestSchema.safeParse(await req.json())
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Invalid request.' },
        { status: 400 },
      )
    }

    const domain = normalizeDomain(parsed.data.domain)
    if (!domain) {
      return NextResponse.json({ error: 'A valid domain is required.' }, { status: 400 })
    }

    const url = `https://api.ahrefs.com/v3/public/domain-rating-free?target=${encodeURIComponent(
      domain,
    )}&output=json`

    const ctl = new AbortController()
    const timeout = setTimeout(() => ctl.abort(), 10_000)
    let res: Response
    try {
      res = await fetch(url, {
        signal: ctl.signal,
        headers: {
          Accept: 'application/json',
          'User-Agent': 'Mozilla/5.0 (compatible; SignalorBot/1.0)',
        },
        cache: 'no-store',
      })
    } finally {
      clearTimeout(timeout)
    }

    if (!res.ok) {
      return NextResponse.json(
        { error: "Couldn't fetch domain rating. Try again." },
        { status: 502 },
      )
    }

    // Shape: { domain_rating: { domain_rating: number, license: string } }
    const json = (await res.json()) as { domain_rating?: { domain_rating?: number } }
    const dr = json?.domain_rating?.domain_rating
    if (typeof dr !== 'number') {
      return NextResponse.json(
        { error: 'No domain rating available for this domain.' },
        { status: 404 },
      )
    }

    const result: DomainRatingResult = {
      domain,
      // Preserve one decimal so low-authority domains (e.g. 0.4) aren't rounded to 0.
      domain_rating: Math.round(dr * 10) / 10,
    }
    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ error: 'Check failed. Try another domain.' }, { status: 500 })
  }
}
