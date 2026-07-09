import Image from "next/image";

import { cn } from "@fe/lib/utils";

/**
 * Decorative right-rail panel for the onboarding / integration connection flow.
 * Integration logos are scattered across a faint grid lattice with the Signalor
 * mark anchored in the center — the "your stack, connected" visual from #18.
 */

type GridIcon = {
  src: string;
  alt: string;
  /** Lattice position on a 5×5 grid (1-5). The center cell is reserved for Signalor. */
  col: number;
  row: number;
};

// Five platform integrations + adjacent tools (Slack, GA, Zapier, Search Console)
// and a couple of answer engines, scattered so the lattice reads "filled but airy".
const ICONS: GridIcon[] = [
  { src: "/logos/shopify.svg", alt: "Shopify", col: 1, row: 1 },
  { src: "/logos/google-analytics.svg", alt: "Google Analytics", col: 3, row: 1 },
  { src: "/logos/wordpress.svg", alt: "WordPress", col: 5, row: 1 },
  { src: "/logos/webflow.svg", alt: "Webflow", col: 1, row: 2 },
  { src: "/logos/claude.svg", alt: "Claude", col: 5, row: 2 },
  { src: "/logos/chatgpt.svg", alt: "ChatGPT", col: 2, row: 3 },
  { src: "/logos/framer.svg", alt: "Framer", col: 4, row: 3 },
  { src: "/logos/slack.svg", alt: "Slack", col: 1, row: 4 },
  { src: "/logos/gemini.svg", alt: "Gemini", col: 5, row: 4 },
  { src: "/logos/nextjs.svg", alt: "Next.js", col: 2, row: 5 },
  { src: "/logos/search-console.svg", alt: "Search Console", col: 4, row: 5 },
];

// col/row 1-5 → centered percentages 6, 28, 50, 72, 94 (outer tiles pushed
// toward the edges so the lattice reads airy and spread out, not clustered).
const pos = (n: number) => `${(n - 1) * 22 + 6}%`;

function IconTile({ src, alt, col, row }: GridIcon) {
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: pos(col), top: pos(row) }}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-black/8 bg-white shadow-md">
        <Image
          src={src}
          alt={alt}
          width={28}
          height={28}
          unoptimized
          className="h-7 w-7 object-contain"
        />
      </div>
    </div>
  );
}

export function IntegrationGridPanel({ className }: { className?: string }) {
  return (
    <aside
      className={cn(
        "relative hidden min-h-svh flex-col items-center justify-center overflow-hidden border-l border-black/6 bg-muted p-7 xl:p-9 lg:flex",
        className,
      )}
    >
      {/* Faint grid lattice, faded toward the edges. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.045)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_at_center,black_45%,transparent_82%)]"
      />

      {/* Icon lattice with Signalor anchored in the center. */}
      <div className="relative aspect-square w-full max-w-[540px]">
        {ICONS.map((icon) => (
          <IconTile key={icon.alt} {...icon} />
        ))}

        <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
          <div className="flex h-[88px] w-[88px] items-center justify-center rounded-2xl border border-black/8 bg-white shadow-[0_16px_44px_-10px_rgba(249,92,75,0.5)] ring-1 ring-primary/25">
            <Image src="/icon.svg" alt="Signalor" width={48} height={48} className="h-11 w-11" />
          </div>
        </div>
      </div>

      {/* Caption */}
      <div className="relative mt-8 max-w-[320px] text-center">
        <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
          Integrations
        </p>
        <h2 className="mt-2 text-lg font-semibold leading-snug tracking-tight text-foreground xl:text-xl">
          Connect your stack — Signalor handles the auto-fixes, schema, and GEO insights.
        </h2>
      </div>
    </aside>
  );
}
