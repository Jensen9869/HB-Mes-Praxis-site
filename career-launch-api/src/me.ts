// Student JSON API — mounted at /api/me in index.ts.
// The React portal at praxis.birthdaymessaging.io/portal talks to this.

import { Hono } from "hono";
import { getCookie, deleteCookie } from "hono/cookie";
import { readSession } from "./auth";
import { esc } from "./email-templates";
import { programmeLabel } from "./labels";

export const me = new Hono<{ Bindings: Env; Variables: { userId: string } }>();

me.use("*", async (c, next) => {
  const userId = await readSession(c.env.SESSION_SECRET, getCookie(c, "session"));
  if (!userId) return c.json({ error: "not signed in" }, 401);
  c.set("userId", userId);
  await next();
});

me.get("/", async (c) => {
  const userId = c.get("userId");
  const db = c.env.career_launch_db;

  const user = await db
    .prepare("SELECT id, email, full_name, institution, graduation_year, created_at FROM users WHERE id = ?")
    .bind(userId)
    .first();
  if (!user) return c.json({ error: "not signed in" }, 401);

  const [enrolments, payments, updates, mentoring] = await Promise.all([
    db.prepare(
      `SELECT e.id, e.programme, e.track, e.status, e.billing, e.created_at, e.approved_at,
              m.full_name AS mentor_name, m.email AS mentor_email
       FROM enrolments e LEFT JOIN mentors m ON m.id = e.mentor_id AND m.active = 1
       WHERE e.user_id = ? ORDER BY e.created_at DESC`,
    ).bind(userId).all(),
    db.prepare(
      `SELECT p.id, p.amount, p.currency, p.status, p.paid_at, e.programme
       FROM payments p JOIN enrolments e ON e.id = p.enrolment_id
       WHERE e.user_id = ? ORDER BY p.paid_at DESC`,
    ).bind(userId).all(),
    db.prepare(
      `SELECT n.id, n.body, n.created_at, e.programme
       FROM notes n JOIN enrolments e ON e.id = n.enrolment_id
       WHERE e.user_id = ? AND n.visible_to_student = 1 ORDER BY n.created_at DESC`,
    ).bind(userId).all(),
    // Apprentices assigned to this person, if they are a mentor
    db.prepare(
      `SELECT e.id, e.programme, e.track, e.status, u.full_name, u.email
       FROM mentors m JOIN enrolments e ON e.mentor_id = m.id JOIN users u ON u.id = e.user_id
       WHERE m.user_id = ? AND m.active = 1 ORDER BY u.full_name`,
    ).bind(userId).all(),
  ]);

  return c.json({
    user,
    enrolments: enrolments.results,
    payments: payments.results,
    updates: updates.results,
    mentoring: mentoring.results,
  });
});

me.patch("/", async (c) => {
  const { fullName, institution, graduationYear } = await c.req.json<{
    fullName?: string;
    institution?: string;
    graduationYear?: number | null;
  }>();
  if (!fullName?.trim()) return c.json({ error: "Please enter your name" }, 400);
  await c.env.career_launch_db
    .prepare("UPDATE users SET full_name = ?, institution = ?, graduation_year = ? WHERE id = ?")
    .bind(fullName.trim(), institution?.trim() || null, graduationYear ?? null, c.get("userId"))
    .run();
  return c.json({ ok: true });
});

me.post("/logout", (c) => {
  deleteCookie(c, "session", { path: "/" });
  return c.json({ ok: true });
});

// Printable receipt (student clicks "Receipt" → opens in new tab → Print / Save as PDF).
me.get("/receipts/:paymentId", async (c) => {
  const row = await c.env.career_launch_db
    .prepare(
      `SELECT p.id, p.amount, p.currency, p.paid_at, p.provider_invoice_id, e.programme, e.billing, u.full_name, u.email
       FROM payments p JOIN enrolments e ON e.id = p.enrolment_id JOIN users u ON u.id = e.user_id
       WHERE p.id = ? AND e.user_id = ?`,
    )
    .bind(c.req.param("paymentId"), c.get("userId"))
    .first<{
      id: string; amount: number; currency: string; paid_at: string; provider_invoice_id: string;
      programme: string; billing: string; full_name: string; email: string;
    }>();
  if (!row) return c.text("Receipt not found", 404);

  const amount = new Intl.NumberFormat("en", { style: "currency", currency: row.currency }).format(row.amount / 100);
  const date = new Date(row.paid_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  return c.html(`<!doctype html><html lang="en"><head><meta charset="utf-8">
<title>Receipt ${esc(row.id)}</title>
<style>
body{font:15px/1.6 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;color:#334155;margin:0;background:#f8fafc}
main{max-width:640px;margin:40px auto;background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:40px}
h1{color:#102a43;font-size:24px;margin:0 0 4px}
.muted{color:#64748b;font-size:13px}
table{width:100%;border-collapse:collapse;margin:24px 0}
td{padding:10px 0;border-bottom:1px solid #e2e8f0;vertical-align:top}
td:last-child{text-align:right;font-weight:600;color:#102a43}
.total td{border:0;font-size:20px;padding-top:16px}
.btn{display:inline-block;margin-top:8px;padding:10px 18px;background:#ea580c;color:#fff;border-radius:999px;text-decoration:none;font-weight:600}
@media print{.btn{display:none}body{background:#fff}main{border:0;margin:0}}
</style></head><body><main>
<h1>Payment receipt</h1>
<p class="muted">Career Launch Platform · BirthdayMessaging, 15 Forest Road, Erith, Kent DA8 2NS, United Kingdom</p>
<table>
<tr><td>Receipt no.</td><td>${esc(row.id)}</td></tr>
<tr><td>Date</td><td>${esc(date)}</td></tr>
<tr><td>Billed to</td><td>${esc(row.full_name)}<br><span class="muted">${esc(row.email)}</span></td></tr>
<tr><td>Programme</td><td>${esc(programmeLabel(row.programme))}</td></tr>
<tr><td>Payment plan</td><td>${row.billing === "upfront" ? "Paid upfront" : "Monthly instalment"}</td></tr>
<tr><td>Paid via</td><td>PayPal (ref ${esc(row.provider_invoice_id)})</td></tr>
<tr class="total"><td>Amount paid</td><td>${esc(amount)}</td></tr>
</table>
<p class="muted">Prices in ${esc(row.currency)}. This receipt was generated from our records; your PayPal account holds the payment-processor receipt.</p>
<a class="btn" href="javascript:window.print()">Print / Save as PDF</a>
</main></body></html>`);
});
