"use client";

import { useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

// Tiny external store so the toggle re-renders when we flip the <html> class,
// without calling setState inside an effect.
const listeners = new Set<() => void>();
function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
function getSnapshot(): Theme {
  return document.documentElement.classList.contains("light") ? "light" : "dark";
}
function getServerSnapshot(): Theme {
  return "light";
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const isLight = theme === "light";

  const toggle = () => {
    const next: Theme = isLight ? "dark" : "light";
    document.documentElement.classList.toggle("light", next === "light");
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* storage unavailable — theme still applies for this session */
    }
    listeners.forEach((l) => l());
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${isLight ? "dark" : "light"} mode`}
      title={`Switch to ${isLight ? "dark" : "light"} mode`}
      className="sv-focus-ring relative grid size-[38px] place-items-center overflow-hidden rounded-xl border border-sv-hair-strong bg-sv-card-2 text-sv-muted transition-colors hover:border-sv-hair-strong hover:text-sv-ink"
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.span
          key={theme}
          initial={{ y: 12, opacity: 0, rotate: -30 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: -12, opacity: 0, rotate: 30 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="absolute"
        >
          {isLight ? <Moon className="size-[18px]" /> : <Sun className="size-[18px]" />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
