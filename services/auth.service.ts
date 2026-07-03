import { signIn, signOut, signUp } from '@/lib/auth-client'
import type { SignInInput, SignUpInput } from '@/lib/validators/auth'

export interface AuthResult {
  ok: boolean
  error?: string
}

export async function signInWithGoogle(callbackUrl = '/dashboard'): Promise<AuthResult> {
  // On success this redirects the browser to Google, so control never returns
  // here; the result path only matters when the provider is unconfigured or errors.
  const result = await signIn.social({ provider: 'google', callbackURL: callbackUrl })
  if (result?.error) {
    return { ok: false, error: result.error.message ?? 'Google sign-in is unavailable right now.' }
  }
  return { ok: true }
}

export async function signInWithEmail(input: SignInInput): Promise<AuthResult> {
  const result = await signIn.email(input)
  if (result.error) {
    return { ok: false, error: result.error.message ?? 'Invalid credentials. Please try again.' }
  }
  return { ok: true }
}

export async function signUpWithEmail(input: SignUpInput): Promise<AuthResult> {
  const result = await signUp.email(input)
  if (result.error) {
    return {
      ok: false,
      error: result.error.message ?? 'Failed to create account. Please try again.',
    }
  }
  return { ok: true }
}

export async function signOutCurrentUser(): Promise<void> {
  await signOut()
}
