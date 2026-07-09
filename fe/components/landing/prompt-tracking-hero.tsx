import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@fe/components/icons";

import { Button } from "@fe/components/ui/button";
import { cn } from "@fe/lib/utils";
import { LANDING_PRIMARY_CTA_CLASS } from "@fe/components/landing/constants";
import { HeroBackgroundGrid } from "@fe/components/landing/hero-background-grid";
import {
  PROMPT_TRACKING_HERO,
  PROMPT_TRACKING_HUB_CARDS,
} from "@fe/lib/landing-prompt-tracking-content";
import type { LucideIcon } from "@fe/components/icons";

type HeroContent = {
  titleLine1: string;
  /** @deprecated Legacy "AI" badge text — no longer rendered now that the hero uses a leading icon. */
  titleBadge?: string;
  /** Page-relevant glyph shown alongside the headline as a bare accent icon (no box). */
  titleIcon?: LucideIcon;
  titleLine2: string;
  titleAccent: string;
  subhead: string;
  primaryCta: string;
  secondaryCta: string;
  footnote: string;
};
type HubCard = {
  slug: string;
  href: string;
  title: string;
  description: string;
  Icon: LucideIcon;
  /** Optional real brand logo (image path). When set, shown instead of `Icon`. */
  logo?: string;
  cta: string;
};

export function PromptTrackingHero({
  hero = PROMPT_TRACKING_HERO,
  cards = PROMPT_TRACKING_HUB_CARDS,
}: {
  hero?: HeroContent;
  cards?: readonly HubCard[];
}) {
  const h = hero;
  const TitleIcon = h.titleIcon;
  return (
    <section className="relative bg-background px-6 pb-16 pt-16 lg:px-12 lg:pb-24 lg:pt-20">
      <HeroBackgroundGrid />
      <div className="relative z-10 grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)] lg:items-center lg:gap-8 xl:gap-12">
        <div className="relative z-10 min-w-0 max-w-xl text-left lg:max-w-none">
          <h1 className="text-4xl font-bold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem] xl:text-6xl">
            <span className="block">
              {h.titleLine1}{" "}
              {TitleIcon ? (
                <>
                  <TitleIcon
                    className="inline-block h-8 w-8 align-[-0.18em] text-primary sm:h-9 sm:w-9 lg:h-10 lg:w-10"
                    strokeWidth={1.75}
                    aria-hidden
                  />{" "}
                </>
              ) : null}
              {h.titleLine2}
            </span>
            <span className="relative inline-block whitespace-nowrap text-primary">
              {h.titleAccent}
              <span
                className="absolute -bottom-1 left-0 right-0 border-b-2 border-dashed border-primary/50"
                aria-hidden
              />
            </span>
          </h1>

          <p className="mt-5 max-w-lg text-base font-light leading-relaxed text-accent-foreground sm:text-lg">
            {h.subhead}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild className={cn(LANDING_PRIMARY_CTA_CLASS, "px-5")}>
              <Link href="/sign-up">
                {h.primaryCta}
                <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden />
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-black/15 px-5">
              <Link href="/sign-up">{h.secondaryCta}</Link>
            </Button>
          </div>

          <p className="mt-5 text-xs font-medium text-muted-foreground">{h.footnote}</p>
        </div>

        <div className="relative z-10 grid min-w-0 gap-3 sm:grid-cols-2 lg:max-w-xl lg:justify-self-end">
          {cards.map((card) => {
            const CardIcon = card.Icon;
            return (
              <Link
                key={card.slug}
                href={card.href}
                className="group flex flex-col rounded-none border border-black/8 bg-white/90 p-4 shadow-xs transition-all hover:-translate-y-0.5 hover:border-black/12 hover:shadow-md"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-none border border-black/8 bg-white">
                  {card.logo ? (
                    <Image
                      src={card.logo}
                      alt={`${card.title} logo`}
                      width={24}
                      height={24}
                      unoptimized
                      className="h-6 w-6 object-contain"
                    />
                  ) : (
                    <CardIcon className="h-5 w-5 text-primary" strokeWidth={1.75} aria-hidden />
                  )}
                </span>
                <span className="mt-3 text-lg font-semibold tracking-tight text-foreground">
                  {card.title}
                </span>
                <span className="mt-1.5 text-sm font-light leading-snug text-muted-foreground">
                  {card.description}
                </span>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  {card.cta}
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
