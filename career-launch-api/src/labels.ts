// Shared labels — replaces the copies in index.ts, portal.ts, admin.ts, pages.ts.

export const PROGRAMME_LABELS: Record<string, string> = {
  apprenticeship: "Apprenticeship Programme (12 months)",
  "mentorship-6mo": "Professional Mentorship (6 months)",
  "mentorship-3mo": "Professional Mentorship (3 months)",
};

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

export const TRACK_LABEL: Record<string, string> = {
  swe: "Software Engineering",
  hr: "Human Resources",
  undecided: "Undecided",
};

export const programmeLabel = (p: string) => PROGRAMME_LABELS[p] ?? p;
