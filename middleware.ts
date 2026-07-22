import { getSessionCookie } from 'better-auth/cookies'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// Every authenticated app route, so an unauthenticated user is bounced before
// the page loads. This is defense-in-depth UX only — a session cookie's mere
// presence is checked here, NOT its signature; real access control is enforced
// by the backend on every data request.
const protectedRoutes = [
  '/dashboard',
  '/creator-dashboard',
  '/onboarding',
  '/loading',
  '/payments',
  '/profile',
  '/settings',
]
const authRoutes = ['/sign-in', '/sign-up']

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const sessionCookie = getSessionCookie(request)
  const { pathname } = request.nextUrl

  const isProtected = protectedRoutes.some(route => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))

  if (isProtected && !sessionCookie) {
    const signInUrl = new URL('/sign-in', request.url)
    signInUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(signInUrl)
  }

  if (isAuthRoute && sessionCookie) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
