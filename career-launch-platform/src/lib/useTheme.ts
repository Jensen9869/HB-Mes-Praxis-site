import { useSyncExternalStore } from "react";

/**
 * Light / dark mode.
 *
 * The mode lives as a class on <html> ("dark" or nothing) and the visitor's
 * choice is remembered in localStorage under "theme". Until they choose, the
 * site follows their device setting. The same key is read by the script in
 * index.html (so the page never flashes the wrong mode) and by the legal pages.
 */
export type Theme = "light" | "dark";

const KEY = "theme";
const listeners = new Set<() => void>();

const stored = (): Theme | null => {
  try {
    const v = localStorage.getItem(KEY);
    return v === "dark" || v === "light" ? v : null;
  } catch {
    return null; // storage blocked (private mode etc.)
  }
};

const current = (): Theme => (document.documentElement.classList.contains("dark") ? "dark" : "light");

const apply = (theme: Theme) => {
  document.documentElement.classList.toggle("dark", theme === "dark");
  listeners.forEach((notify) => notify());
};

export function setTheme(theme: Theme) {
  try {
    localStorage.setItem(KEY, theme);
  } catch {
    /* still switch for this visit */
  }
  apply(theme);
}

let wired = false;
function wireOnce() {
  if (wired || typeof window === "undefined") return;
  wired = true;
  // Device setting changed and the visitor has not chosen for themselves → follow it.
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    if (!stored()) apply(e.matches ? "dark" : "light");
  });
  // Changed in another tab → keep this tab in step.
  window.addEventListener("storage", (e) => {
    if (e.key === KEY && (e.newValue === "dark" || e.newValue === "light")) apply(e.newValue);
  });
}

function subscribe(notify: () => void) {
  wireOnce();
  listeners.add(notify);
  return () => {
    listeners.delete(notify);
  };
}

export function useTheme() {
  const theme = useSyncExternalStore<Theme>(subscribe, current, () => "light");
  return { theme, toggle: () => setTheme(theme === "dark" ? "light" : "dark") };
}
