/** Presentational maps for dashboard-v2 — labels/colors that aren't stored in the DB. */

export const ENGINE_META: Record<
  string,
  { label: string; color: string; short: string; domain: string }
> = {
  chatgpt: { label: "ChatGPT", color: "#10a37f", short: "GP", domain: "openai.com" },
  claude: { label: "Claude", color: "#d97757", short: "Cl", domain: "claude.ai" },
  gemini: { label: "Gemini", color: "#8e6fe6", short: "Gm", domain: "gemini.google.com" },
  perplexity: { label: "Perplexity", color: "#20b8cd", short: "Px", domain: "perplexity.ai" },
  google: { label: "Google AI Overview", color: "#4285f4", short: "G", domain: "google.com" },
  bing: {
    label: "Microsoft Copilot",
    color: "#2563eb",
    short: "Co",
    domain: "copilot.microsoft.com",
  },
};

export function engineMeta(engine: string) {
  return (
    ENGINE_META[engine?.toLowerCase?.()] ?? {
      label: engine || "Source",
      color: "#94a3b8",
      short: (engine || "?").slice(0, 2),
      domain: "",
    }
  );
}

/** AI engines shown as the little logo row per ranking (design order). */
export const AI_MODEL_ENGINES = ["chatgpt", "claude", "gemini", "perplexity"] as const;

/** The six GEO scoring pillars (values come from run.page_scores). */
export const PILLARS: { key: string; label: string; color: string }[] = [
  { key: "content_score", label: "Content Structure", color: "#fb7185" },
  { key: "schema_score", label: "Schema Markup", color: "#60a5fa" },
  { key: "eeat_score", label: "E-E-A-T Signals", color: "#a78bfa" },
  { key: "technical_score", label: "Technical GEO", color: "#34d399" },
  { key: "entity_score", label: "Entity Authority", color: "#fbbf24" },
  { key: "ai_visibility_score", label: "AI Visibility", color: "#f97316" },
];

/** Recommendation priority → Impact bucket used by the impact pill. */
export function priorityToImpact(priority: string): "high" | "medium" | "low" {
  if (priority === "critical" || priority === "high") return "high";
  if (priority === "medium") return "medium";
  return "low";
}
