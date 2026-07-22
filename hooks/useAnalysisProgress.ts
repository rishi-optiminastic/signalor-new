'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import { getRuns } from '@/lib/api/analyzer'
import { useSession } from '@/lib/auth-client'
import { routes } from '@/lib/routes'

interface AnalysisProgress {
  progress: number
  done: boolean
  /** The run stalled or the backend marked it failed — surface a retry, not a spinner. */
  failed: boolean
  /** Raw run phase: pending | crawling | analyzing | scoring | complete | failed. */
  status: string
}

// The backend reports real progress at pipeline checkpoints (5,15,20,30,…,85,100).
// The shown bar mirrors that value exactly — it only eases (animates) toward it so
// checkpoint jumps glide instead of snapping, and never shows 96–99% until the run
// truly ends. It never runs ahead of the backend's reported progress.
const PRE_COMPLETE_CAP = 95
const POLL_MS = 3500
const EASE_MS = 220
// Client-side backstop: if the run hasn't advanced for this long it's almost
// certainly dead. The backend self-heals a silent run to FAILED at 5 min, so this
// only fires if that never reaches us — either way the UI recovers instead of
// spinning forever.
const CLIENT_STALL_MS = 6 * 60 * 1000

/**
 * Drives the analysing screen: polls the user's latest run for its REAL progress
 * and eases the shown bar toward it, then auto-advances to the dashboard once the
 * run completes.
 *
 * It deliberately does NOT invent progress. An earlier version crept the bar to
 * ~98% on a fixed timer regardless of the run, so a run genuinely at 5% displayed
 * 98%. The bar now stays anchored to the backend's reported progress.
 */
export function useAnalysisProgress(): AnalysisProgress {
  const router = useRouter()
  const { data: session } = useSession()
  const email = session?.user?.email
  const [real, setReal] = useState(0)
  const [display, setDisplay] = useState(0)
  const [complete, setComplete] = useState(false)
  const [failed, setFailed] = useState(false)
  const [status, setStatus] = useState('pending')
  // Whether we've applied the initial value from the backend yet. On a page
  // refresh mid-run this lets us snap the bar straight to the run's real
  // progress ("resume where it was left") instead of crawling up from 0 again.
  const seeded = useRef(false)
  // Monotonic mirror of `real`, and the wall-clock of its last increase, so the
  // poll can detect a run that has stopped advancing (see CLIENT_STALL_MS).
  const realRef = useRef(0)
  const lastAdvance = useRef(0)

  // Poll the latest run for its real progress + phase. Stops on any terminal
  // outcome (complete / failed / stalled) so a finished or dead run doesn't keep
  // hitting the API every few seconds for the tab's whole lifetime.
  useEffect(() => {
    if (!email) return
    let active = true
    // Holder so poll() can clear its own interval (the id doesn't exist yet when
    // poll is defined).
    const timer: { id?: ReturnType<typeof setInterval> } = {}
    const stop = (): void => {
      active = false
      if (timer.id) clearInterval(timer.id)
    }
    const poll = async (): Promise<void> => {
      try {
        const latest = (await getRuns(email))[0]
        if (!active || !latest) return
        setStatus(latest.status)
        if (latest.status === 'failed') {
          setFailed(true)
          stop()
          return
        }
        const now = Date.now()
        const isComplete = latest.status === 'complete'
        const value = isComplete ? 100 : (latest.progress ?? 0)
        if (value > realRef.current) {
          realRef.current = value
          lastAdvance.current = now
        }
        setReal(realRef.current)
        if (!seeded.current) {
          seeded.current = true
          lastAdvance.current = now
          setDisplay(d => Math.max(d, Math.min(realRef.current, PRE_COMPLETE_CAP)))
        }
        if (isComplete) {
          setComplete(true)
          stop()
        } else if (now - lastAdvance.current > CLIENT_STALL_MS) {
          setFailed(true)
          stop()
        }
      } catch {
        // transient — keep polling
      }
    }
    void poll()
    timer.id = setInterval(poll, POLL_MS)
    return () => stop()
  }, [email])

  // Ease the shown value toward the real target so checkpoint jumps glide. The
  // target IS the backend value (capped pre-complete), never ahead of it, then
  // fills smoothly to 100 once the run completes.
  useEffect(() => {
    const id = setInterval(() => {
      setDisplay(d => {
        const target = complete ? 100 : Math.min(real, PRE_COMPLETE_CAP)
        if (d >= target) return d
        const next = d + Math.max(0.4, (target - d) * 0.12)
        return Math.min(next, target)
      })
    }, EASE_MS)
    return () => clearInterval(id)
  }, [real, complete])

  // Auto-advance once the run completes and the bar has filled to 100.
  useEffect(() => {
    if (!complete) return
    const t = setTimeout(() => router.push(routes.dashboard), 1500)
    return () => clearTimeout(t)
  }, [complete, router])

  return { progress: Math.round(display), done: complete, failed, status }
}
