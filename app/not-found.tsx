import Link from 'next/link'

export default function NotFound(): JSX.Element {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-5 bg-[#fafafa] px-6 text-center font-sans">
      <span className="text-foreground text-lg font-semibold tracking-tight">SignalorAI</span>
      <div>
        <h1 className="text-foreground text-xl font-semibold tracking-tight">Page not found</h1>
        <p className="mt-1.5 text-[13px] leading-relaxed font-light text-neutral-500">
          The page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>
      </div>
      <Link
        href="/dashboard"
        className="auth-cta-btn flex h-10 items-center rounded-md px-4 text-[14px] font-medium text-white"
      >
        Back to dashboard
      </Link>
    </main>
  )
}
