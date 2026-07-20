/**
 * Formats an ISO date (or date-only `YYYY-MM-DD`) into a short, human label
 * like `Aug 18, 2025`. Date-only strings are normalized to local midnight so
 * they don't shift a day across timezones.
 */
export function formatBlogDate(iso: string): string {
  const normalized = iso.length === 10 ? `${iso}T00:00:00` : iso
  return new Date(normalized).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
