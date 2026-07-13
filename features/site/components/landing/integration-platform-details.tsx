import {
  INTEGRATION_PLATFORM_DETAILS,
  type IntegrationPlatformDetail,
  type PlatformSlug,
} from '@/features/site/lib/landing-integration-content'

interface IntegrationPlatformDetailsProps {
  platform: PlatformSlug
  /** Platform display name, woven into section headings for SEO. */
  title: string
}

/**
 * Content-rich, SEO-semantic body for a platform integration page: an overview
 * paragraph, a how-it-works ladder, a "what Signalor reads" feature grid, and a
 * benefits row. Kept consistent with the rest of the marketing site.
 */
export function IntegrationPlatformDetails({
  platform,
  title,
}: IntegrationPlatformDetailsProps): JSX.Element {
  const detail = INTEGRATION_PLATFORM_DETAILS[platform]
  return (
    <>
      <OverviewBand overview={detail.overview} />
      <HowItWorks title={title} steps={detail.howItWorks} />
      <ReadsGrid title={title} reads={detail.reads} />
      <Benefits benefits={detail.benefits} bestFor={detail.bestFor} />
    </>
  )
}

const SECTION = 'border-t border-black/8 px-6 py-14 lg:px-12'
const EYEBROW = 'text-xs font-semibold uppercase tracking-widest text-muted-foreground'
const H2 = 'mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl'
const BODY = 'text-sm leading-relaxed text-muted-foreground'

function OverviewBand({ overview }: { overview: string }): JSX.Element {
  return (
    <section className={`${SECTION} bg-background`}>
      <div className="mx-auto max-w-3xl">
        <p className={EYEBROW}>Overview</p>
        <p className="text-foreground mt-3 text-lg leading-relaxed font-light sm:text-xl">
          {overview}
        </p>
      </div>
    </section>
  )
}

function HowItWorks({
  title,
  steps,
}: {
  title: string
  steps: IntegrationPlatformDetail['howItWorks']
}): JSX.Element {
  return (
    <section className={`${SECTION} bg-muted/30`}>
      <div className="mx-auto max-w-5xl">
        <p className={EYEBROW}>How it works</p>
        <h2 className={H2}>How the {title} integration works</h2>
        <ol className="mt-8 grid gap-6 sm:grid-cols-3">
          {steps.map(s => (
            <li key={s.step} className="border-primary/70 border-t-2 pt-4">
              <span className="text-primary text-sm font-semibold">{s.step}</span>
              <h3 className="text-foreground mt-1 text-base font-semibold">{s.title}</h3>
              <p className={`mt-1.5 ${BODY}`}>{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function ReadsGrid({
  title,
  reads,
}: {
  title: string
  reads: IntegrationPlatformDetail['reads']
}): JSX.Element {
  return (
    <section className={`${SECTION} bg-background`}>
      <div className="mx-auto max-w-5xl">
        <p className={EYEBROW}>Data scope</p>
        <h2 className={H2}>What Signalor reads from {title}</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {reads.map(r => (
            <div
              key={r.title}
              className="border border-black/8 bg-white/90 p-5 shadow-xs transition-colors hover:border-black/12"
            >
              <h3 className="text-foreground text-base font-semibold">{r.title}</h3>
              <p className={`mt-1.5 ${BODY}`}>{r.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Benefits({
  benefits,
  bestFor,
}: {
  benefits: IntegrationPlatformDetail['benefits']
  bestFor: string
}): JSX.Element {
  return (
    <section className={`${SECTION} bg-muted/30`}>
      <div className="mx-auto max-w-5xl">
        <p className={EYEBROW}>Why it matters</p>
        <h2 className={H2}>Better answers, grounded in your real data</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {benefits.map(b => (
            <div key={b.title}>
              <span className="bg-primary mb-3 block h-1.5 w-8 rounded-full" aria-hidden />
              <h3 className="text-foreground text-base font-semibold">{b.title}</h3>
              <p className={`mt-1.5 ${BODY}`}>{b.body}</p>
            </div>
          ))}
        </div>
        <p className="text-foreground mt-10 border-t border-black/8 pt-6 text-sm font-medium">
          Best for: <span className="text-muted-foreground font-normal">{bestFor}</span>
        </p>
      </div>
    </section>
  )
}
