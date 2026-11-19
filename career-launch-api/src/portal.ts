import { Hono } from "hono";
import { getCookie, deleteCookie } from "hono/cookie";
import { readSession } from "./auth";
import { layout, esc, pill } from "./pages";

const PROGRAMME_LABELS: Record<string, string> = {
  apprenticeship: "Apprenticeship Programme (12 months)",
  "mentorship-6mo": "Professional Mentorship (6 months)",
  "mentorship-3mo": "Professional Mentorship (3 months)",
};

export const portal = new Hono<{ Bindings: Env }>();

portal.get("/", async (c) => {
  const userId = await readSession(
    c.env.SESSION_SECRET,
    getCookie(c, "session"),
  );
  if (!userId) {
    return c.html(
      layout(
        "Sign in",
        `
      <h1>Student portal</h1>
      <p>You are not signed in. Go back to the <a href="https://praxis.birthdaymessaging.io">main site</a> and use <strong>Sign In</strong> to get a login link.</p>`,
      ),
    );
  }

  const db = c.env.career_launch_db;
  const user = await db
    .prepare(
      "SELECT full_name, email, institution, graduation_year FROM users WHERE id = ?",
    )
    .bind(userId)
    .first<{
      full_name: string;
      email: string;
      institution: string;
      graduation_year: number;
    }>();
  const enrolments = (
    await db
      .prepare(
        "SELECT id, programme, track, status, billing, created_at FROM enrolments WHERE user_id = ? ORDER BY created_at DESC",
      )
      .bind(userId)
      .all<{
        id: string;
        programme: string;
        track: string;
        status: string;
        billing: string;
        created_at: string;
      }>()
  ).results;
  const payments = (
    await db
      .prepare(
        "SELECT p.amount, p.currency, p.status, p.paid_at, e.programme FROM payments p JOIN enrolments e ON e.id = p.enrolment_id WHERE e.user_id = ? ORDER BY p.paid_at DESC",
      )
      .bind(userId)
      .all<{
        amount: number;
        currency: string;
        status: string;
        paid_at: string;
        programme: string;
      }>()
  ).results;

  const rows = enrolments
    .map(
      (e) => `
    <tr>
      <td>${esc(PROGRAMME_LABELS[e.programme] ?? e.programme)} <span class="muted">· ${e.billing === "upfront" ? "Paid upfront" : "Monthly"}</span><br><span class="muted">${esc(e.track ?? "")}</span></td>
      <td>${pill(e.status)}</td>
      <td class="muted">${esc(e.created_at)}</td>
      <td>${e.status === "awaiting_payment" ? `<a class="btn small" href="/api/payments/paypal/start?enrolment=${esc(e.id)}">Pay now</a>` : ""}</td>
    </tr>`,
    )
    .join("");

  const payRows = payments.length
    ? payments
        .map(
          (p) =>
            `<tr><td>${esc(p.paid_at)}</td><td>${esc(PROGRAMME_LABELS[p.programme] ?? p.programme)}</td><td>${(p.amount / 100).toFixed(2)} ${esc(p.currency)}</td><td>${esc(p.status)}</td></tr>`,
        )
        .join("")
    : `<tr><td colspan="4" class="muted">No payments yet.</td></tr>`;

  return c.html(
    layout(
      "My programme",
      `
    <div class="top"><h1>Hi ${esc(user?.full_name)}</h1>
      <form class="inline" method="post" action="/portal/logout"><button class="btn secondary small">Sign out</button></form></div>
    <p class="muted">${esc(user?.email)} · ${esc(user?.institution ?? "")} · Class of ${esc(user?.graduation_year ?? "")}</p>

    <h2>My enrolments</h2>
    <table><tr><th>Programme</th><th>Status</th><th>Applied</th><th></th></tr>${rows || `<tr><td colspan="4" class="muted">No enrolments.</td></tr>`}</table>

    <h2>Payments</h2>
    <table><tr><th>Date</th><th>Programme</th><th>Amount</th><th>Status</th></tr>${payRows}</table>
    <p class="muted">To update your card or view PayPal receipts, log in to your PayPal account.</p>
  `,
    ),
  );
});

portal.post("/logout", (c) => {
  deleteCookie(c, "session", { path: "/" });
  return c.redirect("/portal");
});
