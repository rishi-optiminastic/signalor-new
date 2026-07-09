import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@fe/lib/utils";

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <section className={cn("sv-card-surface sv-card-hover p-5", className)}>{children}</section>
  );
}

export function CardHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <h2 className="text-[15px] font-semibold tracking-tight">{title}</h2>
        {subtitle && <p className="mt-0.5 text-xs text-sv-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

/** Full-width footer link/button ("View all opportunities →"). */
export function CardFooterLink({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="sv-focus-ring group mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-sv-hair bg-sv-card-2 py-2.5 text-sm font-medium text-sv-muted transition-colors hover:border-sv-hair-strong hover:text-sv-ink"
    >
      {label}
      <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
    </button>
  );
}
