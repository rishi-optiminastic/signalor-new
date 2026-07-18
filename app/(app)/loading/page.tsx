'use client'

import { Check } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { TickBar } from '@/features/catalyst/components/brands/BrandBits'
import { useAnalysisProgress } from '@/hooks/useAnalysisProgress'
import { routes } from '@/lib/routes'

/** The real pipeline phases, in order. Ticker lines are actual checks the
 * analyzer runs, so the wait narrates real work instead of vamping. */
const STEPS = [
  {
    label: 'Crawling your pages',
    ticker: ['Fetching robots.txt and llms.txt', 'Walking your sitemap', 'Reading page content'],
  },
  {
    label: 'Scoring the six GEO pillars',
    ticker: [
      'Checking FAQ and Product schema',
      'Measuring content depth',
      'Verifying author and trust signals',
    ],
  },
  {
    label: 'Asking AI engines about your brand',
    ticker: [
      'Querying ChatGPT, Claude and Gemini',
      'Checking Perplexity citations',
      'Comparing you to competitors',
    ],
  },
  {
    label: 'Building your action plan',
    ticker: ['Ranking fixes by score impact', 'Estimating effort per task'],
  },
]

/** Map the run's raw status (+ progress inside long phases) to the active step. */
function activeStepFor(status: string, progress: number, done: boolean): number {
  if (done) return STEPS.length
  if (status === 'scoring') return 3
  if (status === 'analyzing') return progress >= 70 ? 2 : 1
  return 0
}

function StepRow({
  label,
  state,
}: {
  label: string
  state: 'done' | 'active' | 'next'
}): JSX.Element {
  return (
    <li className="flex items-center gap-3 py-[7px]">
      <span
        className={`grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full ${
          state === 'done'
            ? 'bg-primary text-white'
            : state === 'active'
              ? 'border-primary border-2'
              : 'border-2 border-neutral-200'
        }`}
      >
        {state === 'done' && <Check className="h-3 w-3" strokeWidth={3} />}
        {state === 'active' && (
          <span className="bg-primary h-1.5 w-1.5 animate-pulse rounded-full" />
        )}
      </span>
      <span
        className={`text-[13.5px] ${
          state === 'active'
            ? 'text-foreground font-medium'
            : state === 'done'
              ? 'text-neutral-500'
              : 'text-neutral-400'
        }`}
      >
        {label}
      </span>
    </li>
  )
}

/** Rotates through the active phase's real checks so the wait feels alive. */
function Ticker({ step }: { step: number }): JSX.Element | null {
  const lines = STEPS[Math.min(step, STEPS.length - 1)]?.ticker ?? []
  const [i, setI] = useState(0)
  useEffect(() => {
    setI(0)
    const id = setInterval(() => setI(v => (v + 1) % lines.length), 2800)
    return () => clearInterval(id)
  }, [step, lines.length])
  if (lines.length === 0) return null
  return (
    <p className="mt-4 text-[12px] text-neutral-400" aria-live="polite">
      {lines[i]}…
    </p>
  )
}

function DoneCard(): JSX.Element {
  return (
    <div className="mt-8 flex flex-col items-center">
      <span className="bg-primary/10 text-primary grid h-12 w-12 place-items-center rounded-full">
        <Check className="h-6 w-6" />
      </span>
      <p className="text-foreground mt-4 text-[15px] font-semibold">Your GEO report is ready</p>
      <Link
        href={routes.dashboard}
        className="auth-cta-btn mt-4 flex h-10 w-full items-center justify-center rounded-md text-[15px] font-medium text-white"
      >
        Open the dashboard
      </Link>
    </div>
  )
}

export default function LoadingPage(): JSX.Element {
  const { progress, done, status } = useAnalysisProgress()
  const step = activeStepFor(status, progress, done)

  return (
    <main className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-[#fbfaf8] px-6 font-sans">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[560px] -translate-x-1/2 rounded-full opacity-[0.07]"
        style={{ background: 'radial-gradient(closest-side, #e04a3d, transparent 70%)' }}
      />
      <div className="relative z-10 w-full max-w-[420px]">
        <p className="text-[11px] font-semibold tracking-[0.18em] text-neutral-400 uppercase">
          SignalorAI · GEO analysis
        </p>

        <div className="mt-3 flex items-baseline gap-3">
          <span className="text-foreground text-[56px] leading-none font-bold tracking-tight tabular-nums">
            {progress}
            <span className="text-[28px] text-neutral-300">%</span>
          </span>
          <span className="pb-1 text-[13px] text-neutral-400">
            {done ? 'complete' : 'usually done in a minute or two'}
          </span>
        </div>

        <div className="mt-5">
          <TickBar value={progress} ticks={44} showValue={false} />
        </div>

        <ol className="mt-7 border-t border-neutral-200/70 pt-4">
          {STEPS.map((s, i) => (
            <StepRow
              key={s.label}
              label={s.label}
              state={i < step ? 'done' : i === step ? 'active' : 'next'}
            />
          ))}
        </ol>

        {done ? <DoneCard /> : <Ticker step={step} />}

        {!done && (
          <p className="mt-8 text-[11.5px] text-neutral-400">
            Safe to keep this tab open — we&apos;ll take you to your report automatically.
          </p>
        )}
      </div>
    </main>
  )
}
