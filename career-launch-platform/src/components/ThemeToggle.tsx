import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../lib/useTheme";

/**
 * Sun / moon button that switches between light and dark mode.
 * `onNavy` = it sits on a dark navy bar (portal and admin header).
 */
export const ThemeToggle: React.FC<{ onNavy?: boolean; className?: string }> = ({ onNavy = false, className = "" }) => {
  const { theme, toggle } = useTheme();
  const dark = theme === "dark";
  const label = dark ? "Switch to light mode" : "Switch to dark mode";

  const look = onNavy
    ? "w-9 h-9 sm:w-10 sm:h-10 text-slate-300 hover:text-white hover:bg-white/10"
    : "w-10 h-10 text-slate-600 hover:text-ink hover:bg-slate-100 border border-slate-200";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className={`shrink-0 rounded-lg inline-flex items-center justify-center transition-colors cursor-pointer ${look} ${className}`}
    >
      {dark ? <Sun className="w-5 h-5" aria-hidden="true" /> : <Moon className="w-5 h-5" aria-hidden="true" />}
    </button>
  );
};
