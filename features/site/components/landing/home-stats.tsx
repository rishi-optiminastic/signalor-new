import { GridCornerHandles, GridHandle } from '@/features/site/components/landing/home-grid'

// Proof metrics. Values carry over from the previous "Why SignalorAI" section —
// update here when real numbers land.
const HOME_STATS = [
  {
    value: '5k+',
    lead: 'Websites optimizing',
    rest: 'with SignalorAI to grow their AI citations.',
  },
  { value: '40%', lead: 'Average lift in AI citations', rest: 'after shipping the fix queue.' },
  { value: '40%', lead: 'Higher buyer intent', rest: 'from AI-referred visitors.' },
  { value: '24h', lead: 'To see visibility growth', rest: 'after your first shipped fix.' },
] as const

export function HomeStats(): JSX.Element {
  return (
    <section aria-labelledby="home-stats-heading">
      <div className="border-border relative border-t">
        <GridCornerHandles top />
        <GridHandle className="-top-[3.5px] left-1/2 -ml-[3.5px] hidden lg:block" />
        <div className="lg:divide-border grid lg:grid-cols-2 lg:divide-x">
          <div className="max-lg:border-border flex flex-col justify-center px-6 py-14 max-lg:border-b sm:px-10 lg:py-20">
            <p className="text-primary text-[12px] font-semibold tracking-[0.18em] uppercase">
              Proof
            </p>
            <h2
              id="home-stats-heading"
              className="text-foreground mt-3 max-w-md text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
            >
              The numbers behind the answers
            </h2>
            <p className="text-muted-foreground mt-4 max-w-sm text-base leading-relaxed text-pretty">
              Teams use SignalorAI to turn AI answers into{' '}
              <strong className="text-foreground font-semibold">measurable pipeline</strong>, not
              another vanity dashboard.
            </p>
          </div>
          <dl className="grid gap-x-10 gap-y-10 px-6 py-14 sm:grid-cols-2 sm:px-10 lg:py-20">
            {HOME_STATS.map(stat => (
              <div
                key={stat.lead}
                className="border-foreground/15 hover:border-primary border-l-2 pl-4 transition-colors duration-200"
              >
                <dd className="text-foreground text-3xl font-semibold tracking-tight tabular-nums sm:text-4xl">
                  {stat.value}
                </dd>
                <dt className="text-muted-foreground mt-2 max-w-[16rem] text-sm leading-relaxed text-pretty">
                  <strong className="text-foreground font-semibold">{stat.lead}</strong> {stat.rest}
                </dt>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
