'use client'

import { IconMoonFilled, IconSunFilled } from '@tabler/icons-react'

import { useCatalystTheme } from '@/features/catalyst/components/CatalystThemeProvider'
import { ICON_TILE } from '@/features/catalyst/components/control-styles'

/** Compact icon-only theme toggle for the top bar. */
export function ThemeToggleButton(): JSX.Element {
  const { dark, toggle } = useCatalystTheme()
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={ICON_TILE}
    >
      {dark ? <IconSunFilled size={17} /> : <IconMoonFilled size={17} />}
    </button>
  )
}
