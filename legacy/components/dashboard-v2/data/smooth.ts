export type SeriesPoint = { date: string; score: number };

/**
 * Densify a sparse score series with cosine (smoothstep) interpolation so a
 * line renders as a soft curve instead of a stiff straight segment between two
 * points. Real points keep their exact original date (so axis ticks still line
 * up); inserted points get an interpolated ISO timestamp. Values are eased
 * between the real endpoints — nothing is invented, it's the real trend, curved.
 * Returns the input unchanged when there are fewer than 2 points.
 */
export function smoothSpline(points: SeriesPoint[], steps = 14): SeriesPoint[] {
  if (points.length < 2) return points;
  const out: SeriesPoint[] = [];
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i];
    const b = points[i + 1];
    const at = Date.parse(a.date);
    const bt = Date.parse(b.date);
    for (let s = 0; s < steps; s++) {
      const t = s / steps;
      const ease = 0.5 - 0.5 * Math.cos(Math.PI * t); // ease in-out
      out.push({
        date: s === 0 ? a.date : new Date(at + (bt - at) * t).toISOString(),
        score: a.score + (b.score - a.score) * ease,
      });
    }
  }
  out.push(points[points.length - 1]);
  return out;
}
