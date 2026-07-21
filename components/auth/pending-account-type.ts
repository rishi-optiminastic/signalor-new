import type { AccountType } from '@/stores/useOnboardingStore'

/**
 * The Individual/Agency choice is made pre-auth and lives in an in-memory Zustand
 * store. A Google OAuth sign-up is a full-page redirect, which wipes that store —
 * so the choice was lost and every Google agency signup was silently treated as
 * Individual (is_agency=false → single-brand cap). We stash it in localStorage so
 * it survives the redirect and gets persisted to the backend on onboarding entry.
 */

const KEY = 'signalor.pendingAccountType'

export interface PendingAccountType {
  accountType: AccountType
  agencyName?: string
  role?: string
}

export function savePendingAccountType(value: PendingAccountType): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(value))
  } catch {
    // localStorage unavailable (private mode / SSR) — degrade silently.
  }
}

export function readPendingAccountType(): PendingAccountType | null {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as PendingAccountType) : null
  } catch {
    return null
  }
}

export function clearPendingAccountType(): void {
  try {
    localStorage.removeItem(KEY)
  } catch {
    // ignore
  }
}
