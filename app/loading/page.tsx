'use client'

import { Check, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { routes } from '@/lib/routes'

const STAGES = [
  'Crawling your site',
  'Analyzing content & schema',
  'Checking AI engine visibility',
  'Benchmarking competitors',
  'Scoring GEO pillars',
]

type StageState = 'done' | 'active' | 'pending'

function stageStateFor(index: number, activeStage: number, done: boolean): StageState {
  if (done || index < activeStage) return 'done'
  if (index === activeStage) return 'active'
  return 'pending'
}

function StageIcon({ state }: { state: StageState }): JSX.Element {
  if (state === 'done') return <Check className="text-primary h-4 w-4" />
  if (state === 'active') return <Loader2 className="text-primary h-4 w-4 animate-spin" />
  return <span className="h-1.5 w-1.5 rounded-full bg-neutral-300" />
}

// Deterministic scatter so SSR and client render identically (no hydration mismatch).
const PIXELS = Array.from({ length: 52 }, (_, i) => ({
  left: (i * 61) % 100,
  top: (i * 37 + 7) % 100,
  size: 2 + (i % 3),
  delay: (i % 12) * 0.26,
  red: i % 5 === 0,
}))

/** Twinkling pixel field drifting behind the radar rings. */
function PixelField(): JSX.Element {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {PIXELS.map((px, i) => (
        <span
          key={i}
          className="absolute animate-[pixel-twinkle_3.4s_ease-in-out_infinite] rounded-[1px]"
          style={{
            left: `${px.left}%`,
            top: `${px.top}%`,
            width: px.size,
            height: px.size,
            animationDelay: `${px.delay}s`,
            backgroundColor: px.red ? '#e04a3d' : '#171717',
          }}
        />
      ))}
    </div>
  )
}

// Fixed radar coordinates (% within the scan box) for the pulsing blips.
const BLIPS = [
  { x: 33, y: 30, delay: 0 },
  { x: 69, y: 41, delay: 1.1 },
  { x: 57, y: 67, delay: 0.5 },
  { x: 41, y: 61, delay: 1.7 },
  { x: 66, y: 25, delay: 2.3 },
]

/** Concentric dashed rings + crosshair — the radar grid. */
function RadarGrid(): JSX.Element {
  return (
    <svg
      viewBox="0 0 400 400"
      className="absolute inset-0 h-full w-full text-neutral-300 opacity-50"
      fill="none"
      aria-hidden="true"
    >
      {[190, 150, 110, 70, 30].map(r => (
        <circle key={r} cx="200" cy="200" r={r} stroke="currentColor" strokeDasharray="3 8" />
      ))}
      <line x1="200" y1="12" x2="200" y2="388" stroke="currentColor" />
      <line x1="12" y1="200" x2="388" y2="200" stroke="currentColor" />
    </svg>
  )
}

/** Rotating brand-red sweep beam. */
function RadarSweep(): JSX.Element {
  return (
    <div
      className="absolute inset-0 animate-spin rounded-full [animation-duration:5s]"
      style={{
        background:
          'conic-gradient(from 0deg, rgba(224,74,61,0) 0deg, rgba(224,74,61,0) 296deg, rgba(224,74,61,0.16) 356deg, rgba(224,74,61,0) 360deg)',
        WebkitMask: 'radial-gradient(circle at center, #000 66%, transparent 67%)',
        mask: 'radial-gradient(circle at center, #000 66%, transparent 67%)',
      }}
    />
  )
}

/** Radar grid + sweep + detected-signal blips, centered behind the content. */
function RadarScan(): JSX.Element {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
      <div className="relative h-[680px] w-[680px]">
        <RadarGrid />
        <RadarSweep />
        {BLIPS.map((b, i) => (
          <span key={i} className="absolute" style={{ left: `${b.x}%`, top: `${b.y}%` }}>
            <span className="bg-primary absolute h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full" />
            <span
              className="border-primary/70 absolute h-7 w-7 animate-[radar-ping_3s_ease-out_infinite] rounded-full border"
              style={{ animationDelay: `${b.delay}s` }}
            />
          </span>
        ))}
      </div>
    </div>
  )
}

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

function StageList({ activeStage, done }: { activeStage: number; done: boolean }): JSX.Element {
  return (
    <ul className="mt-6 w-full space-y-2.5 text-left">
      {STAGES.map((stage, i) => {
        const state = stageStateFor(i, activeStage, done)
        return (
          <li key={stage} className="flex items-center gap-3">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center">
              <StageIcon state={state} />
            </span>
            <span
              className={`text-[13px] ${state === 'pending' ? 'text-neutral-400' : 'text-foreground'}`}
            >
              {stage}
            </span>
          </li>
        )
      })}
    </ul>
  )
}

export default function LoadingPage(): JSX.Element {
  const [progress, setProgress] = useState(0)

  // Simulated progress for the demo. In production, poll the run status and
  // drive `progress` from the backend, then redirect to the dashboard on done.
  useEffect(() => {
    const id = setInterval(() => {
      setProgress(p => (p >= 100 ? 100 : p + 1))
    }, 90)
    return () => clearInterval(id)
  }, [])

  const done = progress >= 100
  const activeStage = Math.min(STAGES.length - 1, Math.floor((progress / 100) * STAGES.length))

  return (
    <main className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-white px-6 font-sans">
      <PixelField />
      <RadarScan />

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

        <StageList activeStage={activeStage} done={done} />

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
