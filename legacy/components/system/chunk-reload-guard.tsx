"use client";

import { useEffect } from "react";

const RELOAD_FLAG = "signalor:chunk-reloaded";

// A failed JS chunk load (stale build after a deploy, or a dev rebuild under an
// open tab) surfaces as one of these messages. When it happens, the app can't
// "start the view" and dead-ends at the root error boundary. Detect it and do a
// single silent reload to fetch fresh chunks.
function isChunkLoadError(message?: string | null): boolean {
  if (!message) return false;
  return (
    /ChunkLoadError/i.test(message) ||
    /Loading chunk [\w-]+ failed/i.test(message) ||
    /Loading CSS chunk/i.test(message) ||
    /Failed to fetch dynamically imported module/i.test(message) ||
    /error loading dynamically imported module/i.test(message) ||
    /Importing a module script failed/i.test(message)
  );
}

/**
 * Self-heals stale-chunk failures: on a ChunkLoadError, reload once (guarded by a
 * sessionStorage flag so it can never loop). If the reload still fails, the user
 * sees the error boundary exactly once instead of an endless refresh. The flag is
 * cleared shortly after a successful load so a later deploy can recover again.
 */
export function ChunkReloadGuard() {
  useEffect(() => {
    const recover = (message?: string | null) => {
      if (!isChunkLoadError(message)) return;
      try {
        if (sessionStorage.getItem(RELOAD_FLAG)) return; // already tried once
        sessionStorage.setItem(RELOAD_FLAG, "1");
      } catch {
        // sessionStorage unavailable — bail rather than risk a loop.
        return;
      }
      window.location.reload();
    };

    const onError = (e: ErrorEvent) => recover(e.message || e.error?.message);
    const onRejection = (e: PromiseRejectionEvent) => {
      const r = e.reason;
      recover(typeof r === "string" ? r : r?.message);
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);

    // This effect only runs after a successful render — i.e. chunks loaded fine.
    // Clear the guard so a future stale-chunk event (e.g. after a new deploy) can
    // recover again.
    const clear = window.setTimeout(() => {
      try {
        sessionStorage.removeItem(RELOAD_FLAG);
      } catch {
        /* ignore */
      }
    }, 5000);

    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
      window.clearTimeout(clear);
    };
  }, []);

  return null;
}
