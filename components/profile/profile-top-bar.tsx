'use client'

import { ArrowLeft, LogOut } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { signOut } from '@/lib/auth-client'
import { routes } from '@/lib/routes'

export function ProfileTopBar(): JSX.Element {
  const router = useRouter()

  const handleSignOut = async (): Promise<void> => {
    await signOut().catch(() => {})
    router.push(routes.signIn)
  }

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-neutral-200 bg-white/85 px-5 backdrop-blur">
      <Link
        href={routes.dashboard}
        className="hover:text-foreground flex items-center gap-1.5 text-[13px] text-neutral-500 transition"
      >
        <ArrowLeft className="h-4 w-4" />
        Dashboard
      </Link>
      <span className="text-foreground text-[15px] font-semibold tracking-tight">Signalor</span>
      <button
        type="button"
        onClick={handleSignOut}
        className="hover:text-foreground flex items-center gap-1.5 text-[13px] text-neutral-500 transition"
      >
        <LogOut className="h-4 w-4" />
        Sign out
      </button>
    </header>
  )
}
