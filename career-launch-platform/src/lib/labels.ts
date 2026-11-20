// Labels + formatting shared by the portal and admin pages.
// Keep in sync with career-launch-api/src/labels.ts.

export const PROGRAMME_LABELS: Record<string, string> = {
  apprenticeship: "Apprenticeship Programme",
  "mentorship-6mo": "Professional Mentorship · 6 months",
  "mentorship-3mo": "Professional Mentorship · 3 months",
};
export const programmeLabel = (p: string) => PROGRAMME_LABELS[p] ?? p;

export const TRACK_LABEL: Record<string, string> = {
  swe: "Software Engineering",
  hr: "Human Resources",
  undecided: "Undecided",
};
export const trackLabel = (t?: string | null) => (t ? (TRACK_LABEL[t] ?? t) : "—");

export const STATUSES = [
  "awaiting_payment",
  "active",
  "approved",
  "rejected",
  "payment_failed",
  "cancelled",
  "completed",
] as const;
export type Status = (typeof STATUSES)[number];

export const STATUS_LABEL: Record<Status, string> = {
  awaiting_payment: "Awaiting payment",
  active: "Paid · under review",
  approved: "Approved",
  rejected: "Rejected",
  payment_failed: "Payment failed",
  cancelled: "Cancelled",
  completed: "Completed",
};

/** Tailwind classes for the status pill. */
export const STATUS_STYLE: Record<Status, string> = {
  awaiting_payment: "bg-amber-50 text-amber-700 border-amber-200",
  active: "bg-sky-50 text-sky-700 border-sky-200",
  approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rejected: "bg-rose-50 text-rose-700 border-rose-200",
  payment_failed: "bg-rose-50 text-rose-700 border-rose-200",
  cancelled: "bg-slate-100 text-slate-600 border-slate-200",
  completed: "bg-violet-50 text-violet-700 border-violet-200",
};

/** What the student sees under the pill. */
export const STATUS_HINT: Record<Status, string> = {
  awaiting_payment: "Complete your first payment to reserve your place.",
  active: "Payment received. We are reviewing your application and will confirm by email.",
  approved: "Your place is confirmed. Onboarding details will arrive by email.",
  rejected: "We were unable to offer a place this time.",
  payment_failed: "Your last instalment failed. Please update your payment method in PayPal.",
  cancelled: "This enrolment has been cancelled. No further payments will be taken.",
  completed: "Programme completed — congratulations.",
};

export const billingLabel = (b?: string | null) => (b === "upfront" ? "Paid upfront" : "Monthly instalments");

/** D1 stores "YYYY-MM-DD HH:MM:SS" (UTC, no zone) — normalise before Date parses it. */
export function parseDate(s?: string | null): Date | null {
  if (!s) return null;
  const iso = /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(s) ? s.replace(" ", "T") + "Z" : s;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function fmtDate(s?: string | null, withTime = false) {
  const d = parseDate(s);
  if (!d) return "—";
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  });
}

export function money(cents: number, currency = "USD") {
  return new Intl.NumberFormat("en", { style: "currency", currency }).format(cents / 100);
}
