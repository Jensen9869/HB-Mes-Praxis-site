import { Hono } from "hono";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";
import { createSession, readSession } from "./auth";
import { layout, esc, pill, STATUS_LABEL } from "./pages";
import { paypalToken, cancelSubscription } from "./paypal";
import { sendEmail } from "./email";

export const admin = new Hono<{ Bindings: Env }>();

const isAdmin = async (c: any) =>
  (await readSession(c.env.SESSION_SECRET, getCookie(c, "admin_session"))) ===
  "admin";

admin.get("/login", (c) =>
  c.html(
    layout(
      "Admin login",
      `
    <h1>Admin</h1>
    <form method="post" action="/admin/login">
      <input type="password" name="password" placeholder="Password" required>
      <button class="btn">Sign in</button>
    </form>`,
    ),
  ),
);

admin.post("/login", async (c) => {
  const form = await c.req.parseBody();
  if (form.password !== c.env.ADMIN_PASSWORD) {
    return c.html(
      layout(
        "Admin login",
        `<p>Wrong password. <a href="/admin/login">Try again</a></p>`,
      ),
      401,
    );
  }
  const token = await createSession(c.env.SESSION_SECRET, "admin");
  setCookie(c, "admin_session", token, {
    httpOnly: true,
    secure: true,
    sameSite: "Lax",
    path: "/admin",
    maxAge: 60 * 60 * 8,
  });
  return c.redirect("/admin");
});

admin.post("/logout", (c) => {
  deleteCookie(c, "admin_session", { path: "/admin" });
  return c.redirect("/admin/login");
});

admin.get("/", async (c) => {
  if (!(await isAdmin(c))) return c.redirect("/admin/login");

  const status = c.req.query("status") ?? "";
  const db = c.env.career_launch_db;
  const where = status ? "WHERE e.status = ?" : "";
  const stmt = db.prepare(
    `SELECT e.id, e.programme, e.track, e.status, e.created_at, e.provider_subscription_id,
            u.full_name, u.email, u.institution,
            (SELECT COUNT(*) FROM payments p WHERE p.enrolment_id = e.id) AS paid_count
     FROM enrolments e JOIN users u ON u.id = e.user_id ${where} ORDER BY e.created_at DESC LIMIT 200`,
  );
  const rows = (await (status ? stmt.bind(status) : stmt).all<any>()).results;

  const counts = (
    await db
      .prepare("SELECT status, COUNT(*) AS n FROM enrolments GROUP BY status")
      .all<{ status: string; n: number }>()
  ).results;

  const filter = `<select onchange="location='/admin?status='+this.value">
    <option value="">All statuses</option>
    ${Object.entries(STATUS_LABEL)
      .map(
        ([k, v]) =>
          `<option value="${k}" ${k === status ? "selected" : ""}>${v}</option>`,
      )
      .join("")}
  </select>`;

  const actions = (r: any) => {
    const btn = (to: string, label: string, cls = "") =>
      `<form class="inline" method="post" action="/admin/enrolments/${esc(r.id)}/status"><input type="hidden" name="status" value="${to}"><button class="btn small ${cls}">${label}</button></form>`;
    if (r.status === "active")
      return (
        btn("approved", "Approve") + " " + btn("rejected", "Reject", "danger")
      );
    if (r.status === "awaiting_payment" || r.status === "payment_failed")
      return btn("cancelled", "Cancel", "danger");
    return "";
  };

  const table = rows
    .map(
      (r: any) => `
    <tr>
      <td>${esc(r.full_name)}<br><span class="muted">${esc(r.email)}</span></td>
      <td>${esc(r.institution ?? "")}</td>
      <td>${esc(r.programme)}<br><span class="muted">${esc(r.track ?? "")}</span></td>
      <td>${pill(r.status)}</td>
      <td>${r.paid_count}</td>
      <td class="muted">${esc(r.created_at)}</td>
      <td>${actions(r)}</td>
    </tr>`,
    )
    .join("");

  return c.html(
    layout(
      "Admin · Applications",
      `
    <div class="top"><h1>Applications</h1>
      <form class="inline" method="post" action="/admin/logout"><button class="btn secondary small">Sign out</button></form></div>
    <p class="muted">${counts.map((x) => `${esc(STATUS_LABEL[x.status] ?? x.status)}: <strong>${x.n}</strong>`).join(" · ")}</p>
    <p>${filter} <a class="btn secondary small" href="/admin/export.csv">Export CSV</a></p>
    <table>
      <tr><th>Applicant</th><th>Institution</th><th>Programme</th><th>Status</th><th>Paid</th><th>Applied</th><th></th></tr>
      ${table || `<tr><td colspan="7" class="muted">No applications.</td></tr>`}
    </table>`,
    ),
  );
});

admin.post("/enrolments/:id/status", async (c) => {
  if (!(await isAdmin(c))) return c.redirect("/admin/login");
  const form = await c.req.parseBody();
  const status = String(form.status);
  if (!["approved", "rejected", "cancelled"].includes(status))
    return c.text("bad status", 400);

  const db = c.env.career_launch_db;
  const row = await db
    .prepare(
      "SELECT e.provider_subscription_id, e.programme, u.email, u.full_name FROM enrolments e JOIN users u ON u.id = e.user_id WHERE e.id = ?",
    )
    .bind(c.req.param("id"))
    .first<{
      provider_subscription_id: string | null;
      programme: string;
      email: string;
      full_name: string;
    }>();
  if (!row) return c.text("not found", 404);

  if (status !== "approved" && row.provider_subscription_id) {
    try {
      const token = await paypalToken(
        c.env.PAYPAL_BASE,
        c.env.PAYPAL_CLIENT_ID,
        c.env.PAYPAL_CLIENT_SECRET,
      );
      await cancelSubscription(
        c.env.PAYPAL_BASE,
        token,
        row.provider_subscription_id,
        `Enrolment ${status} by admin`,
      );
    } catch (e) {
      console.error("paypal cancel failed", e); // already-cancelled subs throw; harmless
    }
  }

  await db
    .prepare(
      "UPDATE enrolments SET status = ?, approved_at = CASE WHEN ? = 'approved' THEN datetime('now') ELSE approved_at END WHERE id = ?",
    )
    .bind(status, status, c.req.param("id"))
    .run();

  const msg = {
    approved: {
      subject: "You're in — Career Launch Platform",
      html: `<p>Hi ${row.full_name},</p><p>Your application has been approved. We will be in touch shortly with your onboarding details.</p>`,
    },
    rejected: {
      subject: "Update on your application — Career Launch Platform",
      html: `<p>Hi ${row.full_name},</p><p>Unfortunately we are unable to offer you a place at this time.</p>`,
    },
    cancelled: {
      subject: "Your enrolment has been cancelled — Career Launch Platform",
      html: `<p>Hi ${row.full_name},</p><p>Your enrolment has been cancelled and no further instalments will be charged.</p>`,
    },
  }[status]!;
  await sendEmail(c.env.POSTAL_API_KEY, { to: row.email, ...msg }).catch((e) =>
    console.error("status email failed", e),
  );

  return c.redirect("/admin");
});

admin.get("/export.csv", async (c) => {
  if (!(await isAdmin(c))) return c.redirect("/admin/login");
  const rows = (
    await c.env.career_launch_db
      .prepare(
        "SELECT u.full_name, u.email, u.institution, u.graduation_year, e.programme, e.track, e.status, e.created_at FROM enrolments e JOIN users u ON u.id = e.user_id ORDER BY e.created_at DESC",
      )
      .all<any>()
  ).results;
  const csv = [
    "name,email,institution,graduation_year,programme,track,status,applied",
    ...rows.map((r: any) =>
      [
        r.full_name,
        r.email,
        r.institution,
        r.graduation_year,
        r.programme,
        r.track,
        r.status,
        r.created_at,
      ]
        .map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`)
        .join(","),
    ),
  ].join("\n");
  return c.body(csv, 200, {
    "Content-Type": "text/csv",
    "Content-Disposition": "attachment; filename=applications.csv",
  });
});

// TEMP — delete after plans are created
// admin.get("/paypal-setup", async (c) => {
//   if (!(await isAdmin(c))) return c.redirect("/admin/login");
//   const token = await paypalToken(
//     c.env.PAYPAL_BASE,
//     c.env.PAYPAL_CLIENT_ID,
//     c.env.PAYPAL_CLIENT_SECRET,
//   );
//   const ids = await createProductAndPlans(c.env.PAYPAL_BASE, token, "USD");
//   return c.json(ids);
// });
