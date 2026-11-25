import React from "react";
import { Link } from "react-router-dom";
import { Compass, ArrowLeft } from "lucide-react";
import { BRAND_CONFIG } from "../config/platformConfig";
import { ThemeToggle } from "./ThemeToggle";

/** Page frame shared by the student portal and the admin panel. */
export const PortalShell: React.FC<{
  area: string; // "Student Portal" | "Admin"
  right?: React.ReactNode;
  wide?: boolean;
  children: React.ReactNode;
}> = ({ area, right, wide, children }) => (
  <div className="min-h-screen flex flex-col bg-soft text-body">
    <header className="bg-navy text-white">
      <div className={`${wide ? "max-w-7xl" : "max-w-5xl"} mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4`}>
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <span className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#38bdf8] to-[#ea580c] flex items-center justify-center">
            <Compass className="w-5 h-5" aria-hidden="true" />
          </span>
          <span className="font-bold text-base sm:text-lg tracking-tight hidden sm:inline">{BRAND_CONFIG.name}</span>
          <span className="text-xs font-semibold tracking-wider uppercase text-[#38bdf8] bg-white/10 px-2 py-0.5 rounded-md">
            {area}
          </span>
        </Link>
        <div className="flex items-center gap-1.5 sm:gap-3 text-sm [&_button]:whitespace-nowrap">
          <ThemeToggle onNavy />
          <Link to="/" className="inline-flex items-center gap-1 text-slate-300 hover:text-white whitespace-nowrap">
            <ArrowLeft className="w-4 h-4" aria-hidden="true" /> <span className="hidden sm:inline">Main site</span>
          </Link>
          {right}
        </div>
      </div>
    </header>

    <main className={`flex-1 w-full ${wide ? "max-w-7xl" : "max-w-5xl"} mx-auto px-4 sm:px-6 py-8`}>{children}</main>

    <footer className="text-xs text-slate-500 text-center py-6">
      © {new Date().getFullYear()} {BRAND_CONFIG.name} ·{" "}
      <a href="/legal/privacy.html" target="_blank" rel="noopener" className="hover:text-ink">Privacy</a> ·{" "}
      <a href="/legal/terms.html" target="_blank" rel="noopener" className="hover:text-ink">Terms</a>
    </footer>
  </div>
);

export const Card: React.FC<{ title?: string; action?: React.ReactNode; className?: string; children: React.ReactNode }> = ({
  title,
  action,
  className = "",
  children,
}) => (
  <section className={`bg-surface rounded-2xl border border-slate-200 shadow-xs ${className}`}>
    {(title || action) && (
      <div className="px-5 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-3">
        {title && <h2 className="text-sm font-bold uppercase tracking-wider text-ink">{title}</h2>}
        {action}
      </div>
    )}
    <div className="px-5 sm:px-6 py-5">{children}</div>
  </section>
);

export const Btn: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "danger" | "ghost"; size?: "sm" | "md" }
> = ({ variant = "primary", size = "md", className = "", ...rest }) => {
  const v = {
    primary: "bg-accent hover:bg-accent-hover text-white",
    secondary: "bg-navy-solid hover:bg-navy-solid-hover text-white",
    danger: "bg-danger hover:bg-danger-hover text-white",
    ghost: "bg-surface hover:bg-slate-50 text-ink border border-slate-300",
  }[variant];
  const s = size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2.5 text-sm";
  return (
    <button
      {...rest}
      className={`inline-flex items-center justify-center gap-1.5 font-semibold rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${v} ${s} ${className}`}
    />
  );
};

export const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <label className="block">
    <span className="block text-xs font-semibold text-slate-600 mb-1">{label}</span>
    {children}
  </label>
);

export const inputCls =
  "w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-surface focus:border-accent focus:ring-1 focus:ring-accent outline-none";

export const Spinner: React.FC<{ label?: string }> = ({ label = "Loading…" }) => (
  <div className="py-16 text-center text-sm text-slate-500">{label}</div>
);

export const ErrorBox: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-lg px-4 py-3">{children}</div>
);
