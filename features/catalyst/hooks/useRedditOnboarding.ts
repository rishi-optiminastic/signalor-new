'use client'

import { useCallback, useState, useSyncExternalStore } from 'react'

export type OnboardingStep = 'account' | 'username' | 'stats' | 'ready'

export interface RedditProfile {
  username: string
  karma: string
  ageDays: string
}

const DONE_KEY = 'reddit_onboarded'
const PROFILE_KEY = 'reddit_profile'
const EMPTY: RedditProfile = { username: '', karma: '', ageDays: '' }

// Persisted "onboarded" flag exposed as an external store so we read it without
// a setState-in-effect (and without a hydration mismatch): SSR sees not-ready,
// the client snapshot fills in after mount.
interface DoneState {
  ready: boolean
  done: boolean
}

const SERVER_STATE: DoneState = { ready: false, done: false }
let clientState: DoneState = { ready: true, done: false }
let listeners: Array<() => void> = []

function subscribe(cb: () => void): () => void {
  listeners.push(cb)
  window.addEventListener('storage', cb)
  return () => {
    listeners = listeners.filter(l => l !== cb)
    window.removeEventListener('storage', cb)
  }
}

function getSnapshot(): DoneState {
  const done = localStorage.getItem(DONE_KEY) === '1'
  if (clientState.done !== done) clientState = { ready: true, done }
  return clientState
}

function persistDone(profile: RedditProfile): void {
  localStorage.setItem(DONE_KEY, '1')
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
  for (const l of listeners) l()
}

interface UseRedditOnboarding {
  /** True once the client snapshot is in (avoids a hydration flash). */
  ready: boolean
  /** Onboarding finished — the caller should show the dashboard. */
  done: boolean
  step: OnboardingStep
  profile: RedditProfile
  setField: (key: keyof RedditProfile, value: string) => void
  goTo: (step: OnboardingStep) => void
  finish: () => void
}

export function useRedditOnboarding(): UseRedditOnboarding {
  const { ready, done } = useSyncExternalStore(subscribe, getSnapshot, () => SERVER_STATE)
  const [step, setStep] = useState<OnboardingStep>('account')
  const [profile, setProfile] = useState<RedditProfile>(EMPTY)

  const setField = useCallback((key: keyof RedditProfile, value: string): void => {
    setProfile(prev => ({ ...prev, [key]: value }))
  }, [])

  const finish = useCallback((): void => persistDone(profile), [profile])

  return { ready, done, step, profile, setField, goTo: setStep, finish }
}
