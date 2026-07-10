/**
 * Work-email gate for Agency sign-ups.
 *
 * Agency accounts must be created with a company ("work") email — personal
 * inboxes from free providers are rejected. This is enforced on BOTH auth
 * paths (typed email + Google OAuth callback) on the client, and again
 * server-side in `AccountTypeView` as defense-in-depth. Keep this list in sync
 * with `apps/accounts/subscription_utils.FREE_EMAIL_DOMAINS`.
 */
export const FREE_EMAIL_DOMAINS: ReadonlySet<string> = new Set([
  // Google
  'gmail.com',
  'googlemail.com',
  // Microsoft
  'outlook.com',
  'outlook.co.uk',
  'hotmail.com',
  'hotmail.co.uk',
  'live.com',
  'live.co.uk',
  'msn.com',
  // Yahoo
  'yahoo.com',
  'yahoo.co.uk',
  'yahoo.in',
  'ymail.com',
  'rocketmail.com',
  // Apple
  'icloud.com',
  'me.com',
  'mac.com',
  // Proton
  'proton.me',
  'protonmail.com',
  'pm.me',
  // Other common free providers
  'aol.com',
  'gmx.com',
  'gmx.net',
  'mail.com',
  'zoho.com',
  'yandex.com',
  'yandex.ru',
  'tutanota.com',
  'tuta.io',
  'hey.com',
  'fastmail.com',
  'hushmail.com',
  'inbox.com',
])

/** The lowercased domain portion of an email, or "" if malformed. */
export function emailDomain(email: string): string {
  const at = email.lastIndexOf('@')
  if (at < 0) return ''
  return email
    .slice(at + 1)
    .trim()
    .toLowerCase()
}

/** True if the email belongs to a known free/personal provider. */
export function isFreeEmail(email: string): boolean {
  const domain = emailDomain(email)
  return domain.length > 0 && FREE_EMAIL_DOMAINS.has(domain)
}

/** True if the email looks like a company/work address (has a domain, not free). */
export function isWorkEmail(email: string): boolean {
  const domain = emailDomain(email)
  return domain.length > 0 && !FREE_EMAIL_DOMAINS.has(domain)
}
