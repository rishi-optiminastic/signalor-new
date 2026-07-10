'use client'

import { useSyncExternalStore } from 'react'

import type { RedditProfile } from '@/features/catalyst/hooks/useRedditOnboarding'

const PROFILE_KEY = 'reddit_profile'
const EMPTY: RedditProfile = { username: '', karma: '', ageDays: '' }

let cachedRaw = ''
let cached: RedditProfile = EMPTY

function subscribe(cb: () => void): () => void {
  window.addEventListener('storage', cb)
  return () => window.removeEventListener('storage', cb)
}

function safeParse(raw: string): Partial<RedditProfile> {
  try {
    const value = JSON.parse(raw)
    return value && typeof value === 'object' ? (value as Partial<RedditProfile>) : {}
  } catch {
    return {}
  }
}

function getSnapshot(): RedditProfile {
  const raw = localStorage.getItem(PROFILE_KEY) ?? ''
  if (raw !== cachedRaw) {
    cachedRaw = raw
    cached = raw ? { ...EMPTY, ...safeParse(raw) } : EMPTY
  }
  return cached
}

/** The Reddit details captured during onboarding (from localStorage). */
export function useRedditProfile(): RedditProfile {
  return useSyncExternalStore(subscribe, getSnapshot, () => EMPTY)
}
