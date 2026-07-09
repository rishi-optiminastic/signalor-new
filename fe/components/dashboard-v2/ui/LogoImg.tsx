"use client";

import { useState } from "react";
import { cn } from "@fe/lib/utils";
import { BrandTile } from "@fe/components/dashboard-v2/ui/Glyphs";
import { AI_MODEL_ENGINES, engineMeta } from "@fe/components/dashboard-v2/data/constants";

function bareHost(domain?: string): string {
  if (!domain) return "";
  return domain
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .split("/")[0]
    .trim();
}

/**
 * Renders a real brand logo for a domain via the favicon service (reliable,
 * returns the brand's actual icon for any domain/subdomain), falling back to
 * colored initials — so it always shows something and never a broken image.
 */
export function LogoImg({
  domain,
  name,
  color,
  size = 26,
  rounded = "rounded-md",
}: {
  domain?: string;
  name: string;
  color: string;
  size?: number;
  rounded?: string;
}) {
  const host = bareHost(domain);
  const [failed, setFailed] = useState(false);

  if (!host || failed) {
    return <BrandTile short={name.slice(0, 2)} color={color} size={size} rounded={rounded} />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://www.google.com/s2/favicons?domain=${host}&sz=64`}
      alt={name}
      width={size}
      height={size}
      loading="lazy"
      onError={() => setFailed(true)}
      className={cn("shrink-0 border border-sv-hair bg-white object-contain", rounded)}
      style={{ width: size, height: size, padding: size >= 22 ? 3 : 2 }}
    />
  );
}

/** The little row of real AI-model logos shown per ranking row. */
export function AiModelDots({ size = 16 }: { size?: number }) {
  return (
    <span className="flex items-center gap-1">
      {AI_MODEL_ENGINES.map((eng) => {
        const m = engineMeta(eng);
        return (
          <LogoImg
            key={eng}
            domain={m.domain}
            name={m.label}
            color={m.color}
            size={size}
            rounded="rounded-[5px]"
          />
        );
      })}
    </span>
  );
}
