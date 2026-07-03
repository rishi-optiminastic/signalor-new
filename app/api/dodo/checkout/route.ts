import { NextResponse } from 'next/server'

const DEFAULT_BASE = 'https://test.dodopayments.com'
const DEFAULT_PRODUCT_ID = 'pdt_0NceyW5ep0hLXtqnQCSjR'

type DodoCheckoutResponse = {
  session_id?: string
  checkout_url?: string | null
  message?: string
  detail?: unknown
}

export async function POST(request: Request) {
  const apiKey = process.env.DODO_PAYMENTS_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Missing DODO_PAYMENTS_API_KEY in environment.' },
      { status: 500 },
    )
  }

  const productId = process.env.DODO_PAYMENTS_PRODUCT_ID ?? DEFAULT_PRODUCT_ID
  const base = (process.env.DODO_PAYMENTS_API_BASE ?? DEFAULT_BASE).replace(/\/$/, '')

  let returnUrl: string | undefined
  let cancelUrl: string | undefined
  try {
    const body = (await request.json().catch(() => ({}))) as {
      return_url?: string
      cancel_url?: string
    }
    returnUrl = body.return_url
    cancelUrl = body.cancel_url
  } catch {
    /* use defaults */
  }

  const payload: Record<string, unknown> = {
    product_cart: [{ product_id: productId, quantity: 1 }],
  }
  if (returnUrl) payload.return_url = returnUrl
  if (cancelUrl) payload.cancel_url = cancelUrl

  const res = await fetch(`${base}/checkouts`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const data = (await res.json().catch(() => ({}))) as DodoCheckoutResponse

  if (!res.ok) {
    return NextResponse.json(
      {
        error: 'Dodo API error',
        status: res.status,
        detail: data.detail ?? data.message ?? data,
      },
      { status: res.status >= 400 && res.status < 600 ? res.status : 502 },
    )
  }

  if (!data.checkout_url) {
    return NextResponse.json(
      { error: 'No checkout_url in response', session_id: data.session_id, raw: data },
      { status: 502 },
    )
  }

  return NextResponse.json({
    checkout_url: data.checkout_url,
    session_id: data.session_id,
  })
}
