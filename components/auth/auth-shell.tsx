import Image from 'next/image'
import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

const DEFAULT_EYEBROW = 'Answer-engine visibility'
const DEFAULT_HEADLINE = 'See how your brand shows up in AI search, and fix what holds you back.'

interface AuthMarketingPanelProps {
  /** Right-panel background image. Defaults to the sign-in/up sunset visual. */
  imageSrc?: string
  /** Small uppercase kicker above the headline. */
  eyebrow?: string
  /** Bottom-right headline copy. */
  headline?: string
}

/**
 * Right-hand marketing panel: an inset, large-radius visual with the eyebrow +
 * headline anchored bottom-right. Hidden below the lg breakpoint.
 */
export function AuthMarketingPanel({
  imageSrc = '/auth-visual.jpg',
  eyebrow = DEFAULT_EYEBROW,
  headline = DEFAULT_HEADLINE,
}: AuthMarketingPanelProps): JSX.Element {
  return (
    <aside className="relative hidden min-h-svh p-3 lg:flex xl:p-4">
      <div className="relative flex flex-1 flex-col justify-end overflow-hidden rounded-[16px] p-10 xl:p-14">
        <Image
          src={imageSrc}
          alt=""
          fill
          priority
          sizes="50vw"
          className="pointer-events-none object-cover select-none"
        />

        {/* Soft scrim so the bottom-right copy stays legible over darker imagery. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-2/3 bg-gradient-to-t from-white/70 via-white/25 to-transparent"
        />

        <div className="relative z-10 ml-auto max-w-md text-right">
          <p className="text-[10px] font-medium tracking-[0.14em] text-neutral-700/80 uppercase">
            {eyebrow}
          </p>
          <h2 className="mt-3 ml-auto max-w-sm text-2xl leading-[1.15] font-semibold tracking-tight text-neutral-900 xl:text-[28px]">
            {headline}
          </h2>
        </div>
      </div>
    </aside>
  )
}

interface AuthShellProps {
  children: ReactNode
  /** Inner column max width. Auth forms use the default 360px. */
  contentClassName?: string
  /** Override the right-hand panel. Defaults to the marketing panel. */
  rightPanel?: ReactNode
}

/**
 * Split-screen auth layout: a card column on the left and a marketing panel on
 * the right.
 */
export function AuthShell({
  children,
  contentClassName = '',
  rightPanel,
}: AuthShellProps): JSX.Element {
  return (
    <div className="min-h-svh w-full text-[13px] leading-normal lg:grid lg:h-svh lg:grid-cols-2 lg:overflow-hidden lg:bg-white">
      {/* LEFT — scrolls independently so the right illustration stays fixed. */}
      <div className="relative flex min-h-svh flex-col justify-center px-4 py-8 sm:px-5 lg:h-svh lg:min-h-0 lg:overflow-y-auto lg:bg-white lg:px-10 xl:px-14">
        <div className="relative flex w-full flex-col justify-center py-4 lg:min-h-full">
          <div className={cn('relative z-10 mx-auto w-[360px] max-w-full', contentClassName)}>
            <div className="rounded-lg border border-black/6 bg-white p-6 shadow-xs sm:p-7 lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">
              {children}
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT */}
      {rightPanel ?? <AuthMarketingPanel />}
    </div>
  )
}
