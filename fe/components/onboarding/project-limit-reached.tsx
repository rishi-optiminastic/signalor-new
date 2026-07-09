import Link from "next/link";

import { AlertTriangle, ArrowRight, ArrowUpRight, Layers } from "@fe/components/icons";
import { Button } from "@fe/components/ui/button";
import { routes } from "@fe/lib/config";
import { cn } from "@fe/lib/utils";

type ProjectLimitReachedProps = {
  count: number;
  max: number;
  /** Human label, e.g. "Max". Falls back to "your plan" when empty. */
  planLabel?: string;
  /** Raw plan key: "starter" | "pro" | "business". */
  plan?: string;
  /** Whether the subscription is active. */
  isActive?: boolean;
  className?: string;
};

/**
 * Shown when a user is already at their project cap, in place of the project
 * creation UI. Never auto-redirects to pricing. Both single-brand plans
 * (Self-Serve, Managed Growth) are capped at 1 brand, so upgrading between them
 * does NOT add projects — the only path to more brands is Enterprise or an
 * agency plan, which is a sales conversation.
 */
export function ProjectLimitReached({
  count,
  max,
  planLabel,
  className,
}: ProjectLimitReachedProps) {
  const label = planLabel || "your";

  return (
    <div className={cn("mx-auto w-full max-w-md text-center", className)}>
      <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-warning/30 bg-warning/10 text-warning">
        <AlertTriangle className="h-5 w-5" strokeWidth={2} aria-hidden />
      </div>

      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        You&rsquo;ve reached your project limit
      </h1>
      <p className="mx-auto mt-2 max-w-sm text-[13px] leading-relaxed text-muted-foreground">
        Your {label} plan includes {max} project{max === 1 ? "" : "s"}, and you&rsquo;re using all{" "}
        {count} of them.
      </p>

      <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-black/8 bg-muted px-3 py-1.5 text-xs font-semibold text-foreground">
        <Layers className="h-3.5 w-3.5 text-primary" strokeWidth={2} aria-hidden />
        {count} / {max} projects used
      </div>

      <div className="mt-7 flex flex-col items-stretch gap-2.5">
        <Button asChild className="auth-cta-btn h-10 rounded-md text-[13px] font-medium text-white">
          <Link href={routes.dashboard}>
            Go to dashboard
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </Button>

        <p className="text-xs leading-relaxed text-muted-foreground">
          Need to track more brands?{" "}
          <Link
            href={routes.contactSales}
            className="inline-flex items-center gap-0.5 font-semibold text-primary hover:underline"
          >
            Talk to sales about Enterprise or an agency plan
            <ArrowUpRight className="h-3 w-3" aria-hidden />
          </Link>{" "}
          — or remove a project from your dashboard.
        </p>
      </div>
    </div>
  );
}
