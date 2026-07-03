'use client'

import { Moon, Sun } from 'lucide-react'

import { useCatalystTheme } from '@/features/catalyst/components/CatalystThemeProvider'

export function ThemeToggle(): JSX.Element {
  const { dark, toggle } = useCatalystTheme()
  return (
    <button
      type="button"
      onClick={toggle}
      className="flex items-center gap-3 rounded-md px-2.5 py-2 text-[14px] font-medium text-[var(--cat-ink-2)] transition-colors hover:bg-[var(--cat-hover)]"
    >
      {dark ? <Sun size={18} strokeWidth={1.8} /> : <Moon size={18} strokeWidth={1.8} />}
      {dark ? 'Light mode' : 'Dark mode'}
    </button>
  )
}
