import Link from 'next/link'

import { LANDING_PRIMARY_CTA_CLASS } from '@/features/site/components/landing/constants'
import { Button } from '@/features/site/components/ui/button'
import { cn } from '@/features/site/lib/utils'

export function IntegrationDetailCta() {
  return (
    <section className="bg-muted/30 border-t border-black/8 px-6 py-14 lg:px-12">
      <div className="mx-auto flex max-w-3xl flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <p className="text-foreground max-w-md text-lg font-semibold tracking-tight">
          OAuth and sync controls live in your SignalorAI workspace after you sign in.
        </p>
        <Button asChild className={cn(LANDING_PRIMARY_CTA_CLASS, 'shrink-0 px-5')}>
          <Link href="/sign-up">Create account</Link>
        </Button>
      </div>
    </section>
  )
}
