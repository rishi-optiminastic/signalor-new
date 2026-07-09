import Link from "next/link";
import { ArrowRight } from "@fe/components/icons";
import { relatedLinks } from "@fe/lib/internal-links";

/**
 * Server-rendered "Explore more" section of contextual internal links.
 *
 * Real, crawlable <a> anchors with descriptive text — this is the primary way
 * link equity flows between tools, features, and solutions, since the main nav
 * is a JS-only mega-menu crawlers can't see. Links are curated per page in
 * lib/internal-links.ts.
 */
export function RelatedLinks({
  page,
  heading = "Explore more",
}: {
  page: string;
  heading?: string;
}) {
  const links = relatedLinks(page);
  if (links.length === 0) return null;

  return (
    <section
      aria-label="Related pages"
      className="border-t border-black/6 bg-neutral-50/60 px-6 py-14 lg:px-12"
    >
      <div className="mx-auto max-w-5xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-500">
          [ {heading} ]
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group flex items-start justify-between gap-4 rounded-xl border border-black/8 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-black/12 hover:shadow-md"
            >
              <span className="min-w-0">
                <span className="block text-[15px] font-semibold text-foreground">
                  {link.title}
                </span>
                <span className="mt-1 block text-[13px] leading-relaxed text-neutral-600">
                  {link.desc}
                </span>
              </span>
              <ArrowRight
                className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary"
                aria-hidden
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
