"use client";

import { motion } from "motion/react";
import { useId, type ReactNode } from "react";

type Segment = { value: number; color: string };

/** Multi-segment donut (share breakdown) with an animated sweep. */
export function SegmentedDonut({
  segments,
  size = 150,
  thickness = 14,
  gap = 3,
  children,
}: {
  segments: Segment[];
  size?: number;
  thickness?: number;
  gap?: number;
  children?: ReactNode;
}) {
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;

  // Precompute each segment's start offset so we never mutate during render.
  const starts: number[] = [];
  segments.reduce((acc, seg) => {
    starts.push(acc);
    return acc + (seg.value / total) * c;
  }, 0);

  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--sv-track)"
          strokeWidth={thickness}
        />
        {segments.map((seg, i) => {
          const frac = seg.value / total;
          const len = Math.max(0, frac * c - gap);
          const dash = `${len} ${c - len}`;
          const thisOffset = -starts[i];
          return (
            <motion.circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={seg.color}
              strokeWidth={thickness}
              strokeLinecap="round"
              strokeDasharray={dash}
              initial={{ strokeDashoffset: c }}
              animate={{ strokeDashoffset: thisOffset }}
              transition={{ duration: 1, delay: 0.15 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center leading-tight">
        {children}
      </div>
    </div>
  );
}

/** Single-value ring with a gradient stroke (citation coverage). */
export function RingProgress({
  value,
  size = 120,
  thickness = 12,
  from = "#f97316",
  to = "#fb7185",
  children,
}: {
  value: number;
  size?: number;
  thickness?: number;
  from?: string;
  to?: string;
  children?: ReactNode;
}) {
  const id = useId();
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  const len = (Math.max(0, Math.min(100, value)) / 100) * c;

  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={`ring-${id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={from} />
            <stop offset="100%" stopColor={to} />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--sv-track)"
          strokeWidth={thickness}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={`url(#ring-${id})`}
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeDasharray={`${len} ${c - len}`}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: 0 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center leading-tight">
        {children}
      </div>
    </div>
  );
}
