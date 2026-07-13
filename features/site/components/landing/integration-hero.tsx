'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Plug } from '@/features/site/components/icons'

import { AiChip } from '@/features/site/components/ui/ai-chip'
import { Button } from '@/features/site/components/ui/button'
import { cn } from '@/features/site/lib/utils'
import { LANDING_PRIMARY_CTA_CLASS } from '@/features/site/components/landing/constants'
import { INTEGRATION_HUB_CARDS } from '@/features/site/lib/landing-integration-content'

export function IntegrationHero() {
  return (
    <section className="bg-background relative px-6 pt-16 pb-16 lg:px-12 lg:pt-20 lg:pb-24">
      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)] lg:items-center lg:gap-8 xl:gap-12">
        <div className="relative z-10 max-w-xl min-w-0 text-left lg:max-w-none">
          <h1 className="text-foreground text-4xl leading-[1.08] font-bold tracking-tight sm:text-5xl lg:text-[3.25rem] xl:text-6xl">
            Plug{' '}
            <span className="text-foreground inline-flex items-center align-middle">
              <Plug className="h-8 w-8 sm:h-10 sm:w-10 lg:h-11 lg:w-11" aria-hidden />
            </span>{' '}
            your stack, make <AiChip /> see{' '}
            <span className="text-primary relative whitespace-nowrap">
              the same truth
              <span
                className="border-primary/50 absolute right-0 -bottom-1 left-0 border-b-2 border-dashed"
                aria-hidden
              />
            </span>{' '}
            as your customers
          </h1>

          <p className="text-accent-foreground mt-5 max-w-lg text-base leading-relaxed font-light sm:text-lg">
            Connect Shopify and WordPress so GEO audits, scores, and recommendations use live
            catalog and CMS data,not a stale crawl snapshot.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild className={cn(LANDING_PRIMARY_CTA_CLASS, 'px-5')}>
              <Link href="/sign-up">
                Connect workspace
                <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden />
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-black/15 px-5">
              <Link href="/sign-up">Get started</Link>
            </Button>
          </div>

          <p className="text-muted-foreground mt-5 text-xs font-medium">
            Read-oriented syncs · disconnect anytime from workspace settings
          </p>
        </div>

        <div className="relative z-10 grid min-w-0 gap-3 sm:grid-cols-2 lg:max-w-xl lg:justify-self-end">
          {INTEGRATION_HUB_CARDS.map(card => (
            <Link
              key={card.slug}
              href={card.href}
              className="group flex flex-col rounded-none border border-black/[0.08] bg-white/90 p-4 shadow-xs transition-all hover:-translate-y-0.5 hover:border-black/12 hover:shadow-md"
            >
              <span className="flex h-11 w-11 items-center justify-center">
                <Image
                  src={card.logoSrc}
                  alt={`${card.title} logo`}
                  width={36}
                  height={36}
                  className="h-9 w-9 object-contain"
                />
              </span>
              <span className="text-foreground mt-3 text-lg font-semibold tracking-tight">
                {card.title}
              </span>
              <span className="text-muted-foreground mt-1.5 text-sm leading-snug font-light">
                {card.description}
              </span>
              <span className="text-primary mt-4 inline-flex items-center gap-1 text-sm font-semibold">
                View integration
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
