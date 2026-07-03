'use client'

import { ArrowLeft, ArrowRight } from 'lucide-react'
import Image from 'next/image'

import { useOnboardingWizardStore, type Platform } from '@/stores/useOnboardingWizardStore'

interface PlatformOption {
  id: Platform
  label: string
  desc: string
  /** Logo path under /logos, or null to render a colored letter tile. */
  logo: string | null
  wrap: string
}

const PLATFORMS: PlatformOption[] = [
  {
    id: 'shopify',
    label: 'Shopify',
    desc: 'Connect via app install',
    logo: null,
    wrap: 'bg-[#96bf48]/12 text-[#5a7d1f]',
  },
  {
    id: 'wordpress',
    label: 'WordPress',
    desc: 'Connect via plugin',
    logo: null,
    wrap: 'bg-[#21759b]/12 text-[#21759b]',
  },
  {
    id: 'webflow',
    label: 'Webflow',
    desc: 'Run analysis by URL',
    logo: null,
    wrap: 'bg-[#146EF5]/12 text-[#146EF5]',
  },
  {
    id: 'framer',
    label: 'Framer',
    desc: 'Run analysis by URL',
    logo: '/logos/framer.svg',
    wrap: 'bg-[#0055FF]/10',
  },
  {
    id: 'nextjs',
    label: 'Next.js',
    desc: 'Install the SDK on your app',
    logo: '/logos/nextjs.svg',
    wrap: 'bg-foreground/5',
  },
]

/** Step 2: choose the platform the site is built on. */
export function PlatformStep(): JSX.Element {
  const { setPlatform, setStep } = useOnboardingWizardStore()

  const select = (id: Platform): void => {
    setPlatform(id)
    setStep('url')
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2.5">
        {PLATFORMS.map(p => (
          <button
            key={p.id}
            type="button"
            onClick={() => select(p.id)}
            className="shadow-input flex w-full items-center gap-4 rounded-xl border border-black/8 bg-white p-4 text-left transition hover:border-black/15 hover:bg-neutral-50 active:scale-[0.99]"
          >
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${p.wrap}`}
            >
              {p.logo ? (
                <Image
                  src={p.logo}
                  alt={p.label}
                  width={28}
                  height={28}
                  className="h-7 w-7 object-contain"
                />
              ) : (
                <span className="text-sm font-bold">{p.label.charAt(0)}</span>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-foreground text-[13px] font-medium">{p.label}</p>
              <p className="text-xs text-neutral-500">{p.desc}</p>
            </div>
            <ArrowRight className="ml-auto h-4 w-4 text-neutral-400" />
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={() => setStep('company')}
        className="shadow-input text-foreground flex h-10 w-full items-center justify-center gap-1.5 rounded-md border border-neutral-200 bg-white text-[13px] font-medium transition hover:bg-neutral-50"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back
      </button>
    </div>
  )
}
