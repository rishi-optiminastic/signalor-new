/**
 * Work-email gate for Agency sign-ups. Agency accounts must use a company
 * ("work") email — personal inboxes from free providers are rejected. Mirror
 * of the backend's FREE_EMAIL_DOMAINS list; keep the two in sync when wiring.
 */
export const FREE_EMAIL_DOMAINS: ReadonlySet<string> = new Set([
  'gmail.com',
  'googlemail.com',
  'outlook.com',
  'outlook.co.uk',
  'hotmail.com',
  'hotmail.co.uk',
  'live.com',
  'live.co.uk',
  'msn.com',
  'yahoo.com',
  'yahoo.co.uk',
  'yahoo.in',
  'ymail.com',
  'rocketmail.com',
  'icloud.com',
  'me.com',
  'mac.com',
  'proton.me',
  'protonmail.com',
  'pm.me',
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

/** True when the email is a company/work email (not a known free provider). */
export function isWorkEmail(email: string): boolean {
  const domain = emailDomain(email)
  return domain.length > 0 && !FREE_EMAIL_DOMAINS.has(domain)
}
