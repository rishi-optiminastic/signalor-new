'use client'

import { Check } from 'lucide-react'
import Link from 'next/link'

import { useAnalysisProgress } from '@/hooks/useAnalysisProgress'
import { routes } from '@/lib/routes'

/** Sweep ring with the live percentage, or a check when complete. */
function SweepRing({ progress, done }: { progress: number; done: boolean }): JSX.Element {
  return (
    <div className="relative mb-7 h-28 w-28">
      <div className="absolute inset-0 rounded-full border border-neutral-200" />
      {!done && (
        <div
          className="absolute inset-0 animate-spin rounded-full [animation-duration:1.1s]"
          style={{
            background:
              'conic-gradient(from 0deg, rgba(224,74,61,0) 0%, rgba(224,74,61,0) 62%, #e04a3d 100%)',
            WebkitMask:
              'radial-gradient(farthest-side, transparent calc(100% - 4px), #000 calc(100% - 4px))',
            mask: 'radial-gradient(farthest-side, transparent calc(100% - 4px), #000 calc(100% - 4px))',
          }}
        />
      )}
      <div className="absolute inset-0 flex items-center justify-center">
        {done ? (
          <span className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-full">
            <Check className="h-6 w-6" />
          </span>
        ) : (
          <span className="text-foreground text-xl font-semibold tabular-nums">{progress}%</span>
        )}
      </div>
    </div>
  )
}

function Heading({ done }: { done: boolean }): JSX.Element {
  return (
    <>
      <h1 className="text-foreground text-xl font-semibold tracking-tight">
        {done ? 'Analysis complete' : 'Analyzing your site'}
      </h1>
      <p className="mt-1.5 text-[13px] leading-relaxed font-light text-neutral-400">
        {done
          ? 'Your GEO report is ready to explore.'
          : "We're checking how AI engines see your brand. This usually takes a minute or two — feel free to keep this open."}
      </p>
    </>
  )
}

export default function LoadingPage(): JSX.Element {
  const { progress, done } = useAnalysisProgress()

  return (
    <main className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-white px-6 font-sans">
      <div className="relative z-10 flex w-full max-w-[400px] flex-col items-center text-center">
        <span className="text-foreground mb-8 text-lg font-semibold tracking-tight">Signalor</span>

        <SweepRing progress={progress} done={done} />

        <Heading done={done} />

        <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
          <div
            className="bg-primary h-full rounded-full transition-[width] duration-200 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {done && (
          <Link
            href={routes.dashboard}
            className="auth-cta-btn mt-7 flex h-10 w-full items-center justify-center rounded-md text-[15px] font-medium text-white"
          >
            View results
          </Link>
        )}
      </div>
    </main>
  )
}
