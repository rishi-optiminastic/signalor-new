import type { ButtonHTMLAttributes } from 'react'

import type { LucideIcon } from '@/lib/icons'

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: LucideIcon
  /** Square icon-only button (no label). */
  iconOnly?: boolean
}

/** The single brand CTA used across the app — consistent height, weight, icon. */
export function PrimaryButton({
  icon: Icon,
  iconOnly = false,
  className = '',
  children,
  ...rest
}: PrimaryButtonProps): JSX.Element {
  const base = iconOnly
    ? 'auth-cta-btn grid h-[34px] w-[34px] shrink-0 place-items-center rounded-md text-white'
    : 'auth-cta-btn inline-flex h-[34px] shrink-0 items-center gap-2 rounded-md px-3.5 text-[13px] font-semibold whitespace-nowrap text-white'
  return (
    <button type="button" {...rest} className={`${base} ${className}`}>
      {Icon && <Icon size={16} strokeWidth={2.2} />}
      {children}
    </button>
  )
}
