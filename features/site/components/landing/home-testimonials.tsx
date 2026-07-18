import { HomeSectionHeader } from '@/features/site/components/landing/home-section-header'
import { HOME_CARD } from '@/features/site/components/landing/home-styles'
import { TESTIMONIALS, type Testimonial } from '@/features/site/lib/landing-testimonials-content'

function TestimonialCard({ testimonial }: { testimonial: Testimonial }): JSX.Element {
  return (
    <figure className={`${HOME_CARD} flex flex-col gap-5 p-6 sm:p-7`}>
      <blockquote className="text-foreground flex-1 text-sm leading-relaxed text-pretty sm:text-[15px]">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>
      <figcaption className="border-border flex items-center gap-3 border-t pt-4">
        <span
          className="bg-muted text-foreground ring-border flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold ring-1"
          aria-hidden
        >
          {testimonial.initials}
        </span>
        <div className="min-w-0">
          <p className="text-foreground truncate text-[13px] font-semibold">
            <cite className="not-italic">{testimonial.name}</cite>
          </p>
          <p className="text-muted-foreground truncate text-xs">
            {testimonial.role} · {testimonial.company}
          </p>
        </div>
      </figcaption>
    </figure>
  )
}

export function HomeTestimonials(): JSX.Element {
  return (
    <section
      className="mx-auto max-w-6xl px-6 py-16 sm:py-20"
      aria-labelledby="home-testimonials-heading"
    >
      <HomeSectionHeader
        eyebrow="In their words"
        headingId="home-testimonials-heading"
        title="Teams running weekly GEO sprints"
        description="Real outcomes from growth, content, and DTC teams shipping SignalorAI into their existing workflow."
      />
      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {TESTIMONIALS.map(testimonial => (
          <TestimonialCard key={testimonial.name} testimonial={testimonial} />
        ))}
      </div>
    </section>
  )
}
