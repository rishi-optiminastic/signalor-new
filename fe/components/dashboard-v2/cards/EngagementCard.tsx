"use client";

import { useRouter } from "next/navigation";
import { FileText, Gauge, Link2, ShieldCheck, Sparkles, Wrench } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card, CardFooterLink, CardHeader } from "@fe/components/dashboard-v2/ui/Card";
import { ImpactPill } from "@fe/components/dashboard-v2/ui/StatusPill";
import { priorityToImpact } from "@fe/components/dashboard-v2/data/constants";
import type { Recommendation } from "@fe/lib/api/analyzer";

const pillarGlyph: Record<string, { Icon: LucideIcon; color: string }> = {
  content: { Icon: FileText, color: "#fb7185" },
  schema: { Icon: Sparkles, color: "#60a5fa" },
  eeat: { Icon: ShieldCheck, color: "#a78bfa" },
  technical: { Icon: Wrench, color: "#34d399" },
  entity: { Icon: Gauge, color: "#fbbf24" },
  ai_visibility: { Icon: Sparkles, color: "#f97316" },
};

function glyph(pillar: string) {
  return pillarGlyph[pillar] ?? { Icon: Link2, color: "#8b5cf6" };
}

export function EngagementCard({
  recommendations,
  tasksHref,
}: {
  recommendations: Recommendation[];
  tasksHref?: string;
}) {
  const router = useRouter();
  const goToTasks = () => {
    if (tasksHref) router.push(tasksHref);
  };
  const items = [...recommendations]
    .sort((a, b) => rank(b.priority) - rank(a.priority))
    .slice(0, 3);

  return (
    <Card>
      <CardHeader
        title="Engagement Opportunities"
        subtitle="Act on these to boost your LLM visibility score"
      />

      {items.length === 0 ? (
        <p className="mt-4 rounded-xl border border-sv-hair bg-sv-card-2 p-4 text-center text-sm text-sv-muted">
          No open recommendations right now.
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {items.map((o) => {
            const { Icon, color } = glyph(o.pillar);
            return (
              <li
                key={o.id}
                className="rounded-xl border border-sv-hair bg-sv-card-2 p-3.5 transition-colors hover:border-sv-hair-strong"
              >
                <div className="flex items-start gap-3">
                  <span
                    className="grid size-9 shrink-0 place-items-center rounded-lg"
                    style={{ background: `${color}1f`, color }}
                  >
                    <Icon className="size-[18px]" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="min-w-0 flex-1 text-sm font-semibold leading-snug line-clamp-2">
                        {o.title}
                      </p>
                      <ImpactPill impact={priorityToImpact(o.priority)} />
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs text-sv-muted">{o.description}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-sv-faint">
                    {o.impact_estimate || `~${o.estimated_minutes} min`}
                  </span>
                  <button
                    onClick={goToTasks}
                    className="sv-focus-ring inline-flex items-center gap-1.5 rounded-lg border border-sv-hair-strong bg-sv-elevated px-3 py-1.5 text-xs font-medium transition-colors hover:border-sv-hair-strong hover:bg-[var(--sv-hover-strong)]"
                  >
                    <Link2 className="size-3.5" />
                    View
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <CardFooterLink label="View all tasks" onClick={goToTasks} />
    </Card>
  );
}

function rank(priority: string): number {
  return { critical: 3, high: 2, medium: 1, low: 0 }[priority] ?? 0;
}
