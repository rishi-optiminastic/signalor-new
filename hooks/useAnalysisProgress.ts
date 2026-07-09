'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import { getRuns } from '@/lib/api/analyzer'
import { useSession } from '@/lib/auth-client'
import { routes } from '@/lib/routes'

interface AnalysisProgress {
  progress: number
  done: boolean
}

/**
 * Drives the analysing screen: polls the user's latest run for real progress,
 * gently creeps the bar between updates, and auto-advances to the dashboard
 * once the run completes.
 */
export function useAnalysisProgress(): AnalysisProgress {
  const router = useRouter()
  const { data: session } = useSession()
  const email = session?.user?.email
  const [progress, setProgress] = useState(0)
  const [complete, setComplete] = useState(false)
  const tick = useRef(0)

  useEffect(() => {
    if (!email) return
    let active = true
    const poll = async (): Promise<void> => {
      try {
        const latest = (await getRuns(email))[0]
        if (!active || !latest) return
        setProgress(p => Math.max(p, latest.progress ?? 0))
        if (latest.status === 'complete') {
          setProgress(100)
          setComplete(true)
        }
      } catch {
        // transient — keep polling
      }
    }
    void poll()
    const id = setInterval(poll, 3000)
    return () => {
      active = false
      clearInterval(id)
    }
  }, [email])

  // Creep quickly to ~90, then keep crawling slowly toward 98 so a long backend
  // run never looks frozen (real progress from the poll still overrides upward).
  useEffect(() => {
    if (complete) return
    const id = setInterval(() => {
      tick.current += 1
      setProgress(p => {
        if (p >= 98) return p
        if (p < 90) return p + 1
        return tick.current % 6 === 0 ? p + 1 : p
      })
    }, 400)
    return () => clearInterval(id)
  }, [complete])

  useEffect(() => {
    if (!complete) return
    const t = setTimeout(() => router.push(routes.dashboard), 1500)
    return () => clearTimeout(t)
  }, [complete, router])

  return { progress, done: complete || progress >= 100 }
}
