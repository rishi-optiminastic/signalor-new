import Link from 'next/link'

export default function HomePage(): JSX.Element {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-[#F7F5F3] px-6 font-sans">
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="text-2xl font-semibold tracking-tight text-[#2F3037]">Signalor</span>
        <p className="max-w-md text-sm leading-relaxed text-[rgba(55,50,47,0.55)]">
          A fresh start. The new frontend is being built from the ground up.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/sign-in"
          className="flex h-11 items-center justify-center rounded-full border border-[#E0DEDB] bg-white px-6 text-sm font-medium text-[#37322F] transition-colors hover:bg-[#F0EEEC]"
        >
          Sign in
        </Link>
        <Link
          href="/sign-up"
          className="flex h-11 items-center justify-center rounded-full bg-[#37322F] px-6 text-sm font-medium text-white transition-all hover:-translate-y-px hover:bg-[#2A2520]"
        >
          Get started
        </Link>
      </div>
    </main>
  )
}
