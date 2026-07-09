import { cn } from "@fe/lib/utils";

/** Rounded "app logo" tile with initials — approximates brand marks. */
export function BrandTile({
  short,
  color,
  size = 30,
  rounded = "rounded-lg",
}: {
  short: string;
  color: string;
  size?: number;
  rounded?: string;
}) {
  return (
    <span
      className={cn("grid shrink-0 place-items-center font-semibold text-white", rounded)}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.4,
        background: `linear-gradient(150deg, ${color}, ${color}cc)`,
        boxShadow: `0 4px 12px -4px ${color}80, inset 0 1px 0 rgba(255,255,255,0.25)`,
      }}
      aria-hidden
    >
      {short}
    </span>
  );
}

const models = [
  { c: "#4285f4", l: "G" },
  { c: "#d97757", l: "C" },
  { c: "#8e6fe6", l: "G" },
  { c: "#20b8cd", l: "P" },
];

/** The little row of AI-model marks shown per ranking row. */
export function ModelDots() {
  return (
    <span className="flex items-center gap-1" aria-hidden>
      {models.map((m, i) => (
        <span
          key={i}
          className="grid size-4 place-items-center rounded-[5px] text-[8px] font-bold text-white"
          style={{ background: m.c }}
        >
          {m.l}
        </span>
      ))}
    </span>
  );
}
