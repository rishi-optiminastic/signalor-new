import Link from 'next/link'

export default function AboutPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl px-6 py-10 md:px-10">
      <header className="border-border mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold tracking-tight">About Signalor GEO</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          We help brands understand and improve how they appear in AI-driven search experiences.
        </p>
      </header>

      <section className="text-foreground/90 space-y-5 text-sm leading-7">
        <p>
          Signalor GEO is built for teams that care about discoverability in modern search. Our
          platform combines technical checks, content quality analysis, brand visibility, and
          recommendation workflows to make GEO improvements measurable.
        </p>
        <p>
          We focus on practical outcomes: clear scoring, transparent diagnostics, and action items
          teams can execute quickly. We also support integrations so insights can be connected to
          real business and traffic data.
        </p>
        <p>
          If you need support, contact us through your account support channel or your internal
          implementation contact.
        </p>
      </section>

      <footer className="border-border text-muted-foreground mt-10 border-t pt-4 text-sm">
        <Link href="/" className="hover:text-foreground">
          Back to Home
        </Link>
      </footer>
    </main>
  )
}
