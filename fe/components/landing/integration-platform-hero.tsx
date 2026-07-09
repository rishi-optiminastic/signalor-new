"use client";

import Image from "next/image";
import { Breadcrumbs } from "@fe/components/seo/breadcrumbs";

import { HeroBackgroundGrid } from "@fe/components/landing/hero-background-grid";

export type IntegrationPlatformCopy = {
  title: string;
  headline: string;
  subhead: string;
  bullets: readonly string[];
};

export function IntegrationPlatformHero({
  copy,
  logoSrc,
}: {
  copy: IntegrationPlatformCopy;
  logoSrc: string;
}) {
  return (
    <section className="relative bg-background px-6 pb-14 pt-14 lg:px-12 lg:pb-20 lg:pt-16">
      <HeroBackgroundGrid spotlight={false} />
      <div className="relative z-10 mx-auto max-w-3xl">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Integrations", href: "/integration" },
            { name: copy.title },
          ]}
        />
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-none border border-black/8 bg-white shadow-sm">
            <Image
              src={logoSrc}
              alt={`${copy.title} logo`}
              width={36}
              height={36}
              className="h-9 w-9 object-contain"
            />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Integration
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {copy.headline}
            </h1>
          </div>
        </div>
        <p className="mt-5 text-base font-light leading-relaxed text-muted-foreground sm:text-lg">
          {copy.subhead}
        </p>
        <ul className="mt-8 space-y-3 border-t border-black/8 pt-8">
          {copy.bullets.map((line) => (
            <li
              key={line}
              className="flex gap-3 text-sm leading-relaxed text-foreground sm:text-sm"
            >
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
              {line}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
