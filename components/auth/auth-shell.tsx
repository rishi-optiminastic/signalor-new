import Image from 'next/image'
import type { CSSProperties, ReactNode } from 'react'

import { cn } from '@/lib/utils'

const DIAMOND_SIZE = 5

/**
 * Single diamond marker, absolutely positioned by the caller. Punctuates the
 * corners where the auth frame's detached edge lines cross.
 */
function Diamond({ style }: { style?: CSSProperties }): JSX.Element {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute z-10 rotate-45"
      style={{
        width: DIAMOND_SIZE,
        height: DIAMOND_SIZE,
        background: 'rgba(0,0,0,0.22)',
        ...style,
      }}
    />
  )
}

/** Right-hand marketing panel. Hidden below the lg breakpoint. */
export function AuthMarketingPanel(): JSX.Element {
  return (
    <aside className="bg-muted relative hidden min-h-svh flex-col overflow-hidden border-l border-black/6 p-7 lg:flex xl:p-9">
      <div className="pointer-events-none absolute inset-0 opacity-25">
        <svg
          className="absolute top-1/2 left-1/2 h-[min(340px,72%)] w-[min(340px,72%)] -translate-x-1/2 -translate-y-[42%]"
          viewBox="0 0 400 400"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M200 80 C 120 80 80 140 80 200 C 80 280 140 320 200 320 C 280 320 320 260 320 200 C 320 120 260 80 200 80"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="6 10"
            className="text-muted-foreground"
          />
          <circle cx="200" cy="120" r="22" className="stroke-border fill-white" strokeWidth="1" />
          <circle cx="110" cy="220" r="18" className="stroke-border fill-white" strokeWidth="1" />
          <circle cx="290" cy="210" r="18" className="stroke-border fill-white" strokeWidth="1" />
          <text
            x="200"
            y="126"
            textAnchor="middle"
            fill="#737373"
            fontFamily="system-ui, sans-serif"
            fontSize="14"
            fontWeight="600"
          >
            S
          </text>
        </svg>
      </div>

      <div className="relative shrink-0">
        <p className="text-muted-foreground text-[10px] font-medium tracking-[0.14em] uppercase">
          Answer-engine visibility
        </p>
        <h2 className="text-foreground mt-2.5 max-w-[280px] text-lg leading-snug font-semibold tracking-tight xl:max-w-xs xl:text-xl">
          See how your brand shows up in AI search, and fix what holds you back.
        </h2>
      </div>

      <div className="absolute top-[11.5rem] right-[-9rem] bottom-[-2rem] left-7 z-10 overflow-hidden rounded-tl-xl shadow-lg xl:left-9">
        <Image
          src="/carousel1.png"
          alt="AI search surfaces preview"
          width={1877}
          height={892}
          priority
          className="pointer-events-none block h-full w-full object-cover object-left-top select-none"
        />
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
 * Split-screen auth layout: a framed card column on the left (with detached
 * edge lines + corner diamonds) and a marketing panel on the right.
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
          {/* Detached frame lines */}
          <div className="absolute top-4 -right-8 -left-8 h-px bg-black/6" />
          <div className="absolute -right-8 bottom-4 -left-8 h-px bg-black/6" />
          <div className="absolute -top-8 -bottom-8 left-4 w-px bg-black/6" />
          <div className="absolute -top-8 right-4 -bottom-8 w-px bg-black/6" />

          {/* Corner diamonds */}
          <Diamond style={{ top: 'calc(1rem - 2.5px)', left: 'calc(1rem - 2.5px)' }} />
          <Diamond style={{ top: 'calc(1rem - 2.5px)', right: 'calc(1rem - 2.5px)' }} />
          <Diamond style={{ bottom: 'calc(1rem - 2.5px)', left: 'calc(1rem - 2.5px)' }} />
          <Diamond style={{ bottom: 'calc(1rem - 2.5px)', right: 'calc(1rem - 2.5px)' }} />

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
