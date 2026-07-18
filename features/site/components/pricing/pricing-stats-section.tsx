import { PRICING_STATS } from '@/features/site/lib/pricing-marketing-content'

export function PricingStatsSection() {
  return (
    <section
      className="bg-background relative px-6 py-14 lg:px-12 lg:py-16"
      aria-labelledby="pricing-stats-heading"
    >
      <div className="mx-auto max-w-7xl">
        <p className="text-muted-foreground text-[11px] font-medium tracking-[0.22em] uppercase">
          [ in numbers ]
        </p>
        <h2
          id="pricing-stats-heading"
          className="text-foreground mt-4 max-w-4xl text-3xl leading-[1.12] font-bold tracking-tight sm:text-4xl lg:text-[2.65rem]"
        >
          What teams{' '}
          <span className="text-primary relative whitespace-nowrap">
            ship with SignalorAI
            <span
              className="border-primary/45 absolute right-0 -bottom-1 left-0 border-b-2 border-dashed"
              aria-hidden
            />
          </span>
        </h2>
      </div>

      <div className="bg-black-10 mx-auto mt-10 max-w-7xl">
        <div className="grid grid-cols-1 divide-y divide-black/6 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:divide-black/6">
          {PRICING_STATS.map(s => (
            <div
              key={s.label}
              className="flex flex-col gap-2 bg-white px-6 py-10 md:px-8 md:py-12 lg:px-10"
            >
              <p className="text-muted-foreground text-[11px] font-semibold tracking-widest uppercase">
                {s.label}
              </p>
              <p className="text-foreground text-3xl font-bold tracking-tight tabular-nums md:text-4xl">
                {s.value}
              </p>
              <p className="text-muted-foreground text-sm leading-snug font-light">{s.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
