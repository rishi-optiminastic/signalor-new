"use client";

import { useEffect, useState } from "react";

type MailLinkProps = Omit<React.ComponentPropsWithoutRef<"a">, "href"> & {
  /** mailbox part before the @ (e.g. "hello") */
  user: string;
  /** domain part after the @ */
  domain?: string;
  /** optional subject line */
  subject?: string;
};

/**
 * Renders a `mailto:` link whose address is assembled on the client after mount.
 *
 * The literal email never appears in the server-rendered HTML, so Cloudflare's
 * Email Address Obfuscation (Scrape Shield) leaves it alone. Otherwise Cloudflare
 * rewrites the link to `/cdn-cgi/l/email-protection`, which crawlers like Ahrefs
 * flag as a broken (404) internal link on every page.
 *
 * Server + hydration render with no `href` (matching, no hydration mismatch);
 * the real `mailto:` is filled in by the effect once mounted.
 */
export function MailLink({
  user,
  domain = "signalor.ai",
  subject,
  children,
  ...rest
}: MailLinkProps) {
  const [href, setHref] = useState<string | undefined>(undefined);

  useEffect(() => {
    const query = subject ? `?subject=${encodeURIComponent(subject)}` : "";
    setHref(`mailto:${user}@${domain}${query}`);
  }, [user, domain, subject]);

  return (
    <a href={href} {...rest}>
      {children}
    </a>
  );
}

/** Parse a `mailto:user@domain?subject=...` string into MailLink props. */
export function parseMailto(href: string): { user: string; domain?: string; subject?: string } {
  const withoutScheme = href.replace(/^mailto:/, "");
  const [address, query = ""] = withoutScheme.split("?");
  const [user, domain] = address.split("@");
  const subject = new URLSearchParams(query).get("subject") ?? undefined;
  return { user, domain, subject };
}
