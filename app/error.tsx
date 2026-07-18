'use client'

import Link from 'next/link'
import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}): JSX.Element {
  useEffect(() => {
    // Surface the error in the console for debugging.
    // eslint-disable-next-line no-console
    console.error(error)
  }, [error])

  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-5 bg-[#fafafa] px-6 text-center font-sans">
      <span className="text-foreground text-lg font-semibold tracking-tight">SignalorAI</span>
      <div>
        <h1 className="text-foreground text-xl font-semibold tracking-tight">
          Something went wrong
        </h1>
        <p className="mt-1.5 text-[13px] leading-relaxed font-light text-neutral-500">
          An unexpected error occurred. You can try again or head back.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={reset}
          className="auth-cta-btn flex h-10 items-center rounded-md px-4 text-[14px] font-medium text-white"
        >
          Try again
        </button>
        <Link
          href="/dashboard"
          className="text-foreground flex h-10 items-center rounded-md border border-neutral-200 bg-white px-4 text-[14px] font-medium transition-colors hover:bg-neutral-50"
        >
          Back to dashboard
        </Link>
      </div>
    </main>
  )
}
