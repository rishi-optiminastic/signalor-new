"use client";

import { useEffect, useId, useRef } from "react";

/**
 * Cloudflare Turnstile widget.
 *
 * Cloudflare Turnstile protection has been REMOVED — `siteKey` is forced
 * undefined below, so the widget renders nothing and the CF challenge
 * script is never loaded, regardless of NEXT_PUBLIC_TURNSTILE_SITE_KEY.
 * The onboarding flow proceeds with an empty token, which the backend
 * accepts (turnstile_enabled() is also force-disabled server-side).
 *
 * To restore: read `env.NEXT_PUBLIC_TURNSTILE_SITE_KEY` again on the
 * `siteKey` line and re-enable TURNSTILE_SECRET on the backend.
 */
type Props = {
  onToken: (token: string) => void;
  onError?: (err: string) => void;
};

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement,
        opts: {
          sitekey: string;
          callback: (token: string) => void;
          "error-callback"?: (err: string) => void;
          "expired-callback"?: () => void;
          theme?: "auto" | "light" | "dark";
          size?: "normal" | "compact" | "invisible";
        },
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js";
let scriptPromise: Promise<void> | null = null;

function loadScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("turnstile script failed")));
      return;
    }
    const s = document.createElement("script");
    s.src = SCRIPT_SRC;
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("turnstile script failed"));
    document.head.appendChild(s);
  });
  return scriptPromise;
}

export function TurnstileWidget({ onToken, onError }: Props) {
  // Cloudflare Turnstile protection removed — force-disabled (see file header).
  const siteKey: string | undefined = undefined;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);
  const onTokenRef = useRef(onToken);
  const onErrorRef = useRef(onError);
  const id = useId();

  // Keep refs current so the render call's closures stay in sync without
  // re-rendering the (heavy) widget on every parent re-render.
  useEffect(() => {
    onTokenRef.current = onToken;
    onErrorRef.current = onError;
  }, [onToken, onError]);

  useEffect(() => {
    if (!siteKey) return;
    let cancelled = false;
    loadScript()
      .then(() => {
        if (cancelled || !containerRef.current || !window.turnstile) return;
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          theme: "auto",
          size: "normal",
          callback: (token) => onTokenRef.current(token),
          "error-callback": (err) => onErrorRef.current?.(err),
          "expired-callback": () => {
            if (widgetIdRef.current && window.turnstile) {
              window.turnstile.reset(widgetIdRef.current);
            }
          },
        });
      })
      .catch((err: Error) => onErrorRef.current?.(err.message));

    return () => {
      cancelled = true;
      const id = widgetIdRef.current;
      if (id && window.turnstile) {
        try {
          window.turnstile.remove(id);
        } catch {
          // ignore — widget already gone
        }
      }
      widgetIdRef.current = null;
    };
  }, [siteKey]);

  if (!siteKey) return null;
  return <div ref={containerRef} data-turnstile-id={id} />;
}
