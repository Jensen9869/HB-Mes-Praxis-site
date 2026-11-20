// Admin JSON API — mounted at /api/admin in index.ts.
// The React admin page at praxis.birthdaymessaging.io/admin talks to this.

import { Hono } from "hono";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";
import { createSession, readSession } from "./auth";
import { paypalToken, cancelSubscription } from "./paypal";
import { sendEmail } from "./email";
import { statusEmail, customEmail, mentorAssignedEmail, apprenticeAssignedEmail } from "./email-templates";
import { STATUSES, STATUS_LABEL, TRACK_LABEL, programmeLabel, type Status } from "./labels";

export const admin = new Hono<{ Bindings: Env }>();

const COOKIE = "admin_session";

const isAdmin = async (c: any) =>
  (await readSession(c.env.SESSION_SECRET, getCookie(c, COOKIE))) === "admin";

// Every route except /login requires the admin cookie.
admin.use("*", async (c, next) => {
  if (c.req.path.endsWith("/login") && c.req.method === "POST") return next();
  if (!(await isAdmin(c))) return c.json({ error: "unauthorised" }, 401);
  await next();
});

admin.post("/login", async (c) => {
  const { password } = await c.req.json<{ password?: string }>();
  if (!password || password !== c.env.ADMIN_PASSWORD) {
    return c.json({ error: "Wrong password" }, 401);
  }
  const token = await createSession(c.env.SESSION_SECRET, "admin");
  setCookie(c, COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "Lax",
    path: "/api/admin",
    maxAge: 60 * 60 * 8,
  });
  return c.json({ ok: true });
});

admin.post("/logout", (c) => {
  deleteCookie(c, COOKIE, { path: "/api/admin" });
  return c.json({ ok: true });
});

admin.get("/me", (c) => c.json({ ok: true }));

// ── List ──────────────────────────────────────────────────────────────────
admin.get("/enrolments", async (c) => {
  const status = c.req.query("status") ?? "";
  const q = (c.req.query("q") ?? "").trim();
  const db = c.env.career_launch_db;

  const where: string[] = [];
  const binds: unknown[] = [];
  if (status) {
    where.push("e.status = ?");
    binds.push(status);
  }
  if (q) {
    where.push("(u.full_name LIKE ? OR u.email LIKE ? OR u.institution LIKE ?)");
    binds.push(`%${q}%`, `%${q}%`, `%${q}%`);
  }
  const sql = `
    SELECT e.id, e.programme, e.track, e.status, e.billing, e.created_at, e.approved_at,
           e.provider_subscription_id, e.user_id,
           u.full_name, u.email, u.institution, u.graduation_year,
           (SELECT COUNT(*) FROM payments p WHERE p.enrolment_id = e.id) AS paid_count,
           (SELECT COALESCE(SUM(amount),0) FROM payments p WHERE p.enrolment_id = e.id) AS paid_total
    FROM enrolments e JOIN users u ON u.id = e.user_id
    ${where.length ? "WHERE " + where.join(" AND ") : ""}
    ORDER BY e.created_at DESC LIMIT 500`;
  const rows = (await db.prepare(sql).bind(...binds).all()).results;

  const counts = (
    await db
      .prepare("SELECT status, COUNT(*) AS n FROM enrolments GROUP BY status")
      .all<{ status: string; n: number }>()
  ).results;

  return c.json({ rows, counts });
});

// ── Detail ────────────────────────────────────────────────────────────────
admin.get("/enrolments/:id", async (c) => {
  const id = c.req.param("id");
  const db = c.env.career_launch_db;

  const enrolment = await db
    .prepare(
      `SELECT e.*, u.full_name, u.email, u.institution, u.graduation_year, u.created_at AS user_created_at
       FROM enrolments e JOIN users u ON u.id = e.user_id WHERE e.id = ?`,
    )
    .bind(id)
    .first();
  if (!enrolment) return c.json({ error: "not found" }, 404);

  const userId = (enrolment as any).user_id as string;
  const mentorId = (enrolment as any).mentor_id as string | null;

  const [payments, notes, log, emails, otherEnrolments, mentor, mentoring] = await Promise.all([
    db.prepare("SELECT * FROM payments WHERE enrolment_id = ? ORDER BY paid_at DESC").bind(id).all(),
    db.prepare("SELECT * FROM notes WHERE enrolment_id = ? ORDER BY created_at DESC").bind(id).all(),
    db.prepare("SELECT * FROM status_log WHERE enrolment_id = ? ORDER BY created_at DESC").bind(id).all(),
    db.prepare("SELECT id, subject, created_at FROM emails_sent WHERE enrolment_id = ? ORDER BY created_at DESC").bind(id).all(),
    db.prepare("SELECT id, programme, status, created_at FROM enrolments WHERE user_id = ? AND id != ? ORDER BY created_at DESC")
      .bind(userId, id).all(),
    mentorId
      ? db.prepare("SELECT id, full_name, email, kind, active FROM mentors WHERE id = ?").bind(mentorId).first()
      : Promise.resolve(null),
    // If this person is also a mentor, list their apprentices.
    db.prepare(
      `SELECT e.id, e.programme, e.track, e.status, u.full_name, u.email
       FROM mentors m JOIN enrolments e ON e.mentor_id = m.id JOIN users u ON u.id = e.user_id
       WHERE m.user_id = ? ORDER BY u.full_name`,
    ).bind(userId).all(),
  ]);

  return c.json({
    enrolment,
    payments: payments.results,
    notes: notes.results,
    log: log.results,
    emails: emails.results,
    otherEnrolments: otherEnrolments.results,
    mentor,
    mentoring: mentoring.results,
  });
});

// ── Mentors ───────────────────────────────────────────────────────────────
admin.get("/mentors", async (c) => {
  const db = c.env.career_launch_db;
  const [mentors, apprentices, candidates] = await Promise.all([
    db.prepare(
      `SELECT m.*, (SELECT COUNT(*) FROM enrolments e WHERE e.mentor_id = m.id) AS apprentice_count
       FROM mentors m ORDER BY m.active DESC, m.full_name`,
    ).all(),
    db.prepare(
      `SELECT e.id, e.mentor_id, e.programme, e.track, e.status, u.full_name, u.email
       FROM enrolments e JOIN users u ON u.id = e.user_id WHERE e.mentor_id IS NOT NULL ORDER BY u.full_name`,
    ).all(),
    // Mentorship students who are not mentors yet (for "Add from Mentorship students")
    db.prepare(
      `SELECT e.id AS enrolment_id, e.programme, e.status, u.full_name, u.email
       FROM enrolments e JOIN users u ON u.id = e.user_id
       WHERE e.programme LIKE 'mentorship%' AND e.status IN ('active','approved')
         AND NOT EXISTS (SELECT 1 FROM mentors m WHERE m.enrolment_id = e.id)
       ORDER BY u.full_name`,
    ).all(),
  ]);
  return c.json({ mentors: mentors.results, apprentices: apprentices.results, candidates: candidates.results });
});

admin.post("/mentors", async (c) => {
  const { fullName, email, enrolmentId } = await c.req.json<{ fullName?: string; email?: string; enrolmentId?: string }>();
  const db = c.env.career_launch_db;
  const id = crypto.randomUUID();

  if (enrolmentId) {
    // From a Mentorship student
    const row = await db
      .prepare("SELECT e.user_id, u.full_name, u.email FROM enrolments e JOIN users u ON u.id = e.user_id WHERE e.id = ? AND e.programme LIKE 'mentorship%'")
      .bind(enrolmentId)
      .first<{ user_id: string; full_name: string; email: string }>();
    if (!row) return c.json({ error: "mentorship enrolment not found" }, 404);
    await db
      .prepare("INSERT INTO mentors (id, full_name, email, kind, enrolment_id, user_id) VALUES (?,?,?,'student',?,?)")
      .bind(id, row.full_name, row.email, enrolmentId, row.user_id)
      .run();
    return c.json({ ok: true, id });
  }

  if (!fullName?.trim() || !email?.trim()) return c.json({ error: "name and email required" }, 400);
  await db
    .prepare("INSERT INTO mentors (id, full_name, email, kind) VALUES (?,?,?,'staff')")
    .bind(id, fullName.trim(), email.trim().toLowerCase())
    .run();
  return c.json({ ok: true, id });
});

admin.patch("/mentors/:id", async (c) => {
  const { fullName, email, active } = await c.req.json<{ fullName?: string; email?: string; active?: boolean }>();
  const sets: string[] = [];
  const binds: unknown[] = [];
  if (fullName?.trim()) { sets.push("full_name = ?"); binds.push(fullName.trim()); }
  if (email?.trim()) { sets.push("email = ?"); binds.push(email.trim().toLowerCase()); }
  if (typeof active === "boolean") { sets.push("active = ?"); binds.push(active ? 1 : 0); }
  if (!sets.length) return c.json({ error: "nothing to update" }, 400);
  binds.push(c.req.param("id"));
  await c.env.career_launch_db.prepare(`UPDATE mentors SET ${sets.join(", ")} WHERE id = ?`).bind(...binds).run();
  return c.json({ ok: true });
});

// Assign / unassign a mentor to an apprenticeship enrolment.
admin.post("/enrolments/:id/mentor", async (c) => {
  const id = c.req.param("id");
  const { mentorId, notify } = await c.req.json<{ mentorId: string | null; notify?: boolean }>();
  const db = c.env.career_launch_db;

  const enr = await db
    .prepare("SELECT e.programme, e.track, e.mentor_id, u.full_name, u.email FROM enrolments e JOIN users u ON u.id = e.user_id WHERE e.id = ?")
    .bind(id)
    .first<{ programme: string; track: string | null; mentor_id: string | null; full_name: string; email: string }>();
  if (!enr) return c.json({ error: "not found" }, 404);

  let mentor: { full_name: string; email: string } | null = null;
  if (mentorId) {
    mentor = await db.prepare("SELECT full_name, email FROM mentors WHERE id = ? AND active = 1").bind(mentorId).first();
    if (!mentor) return c.json({ error: "mentor not found or inactive" }, 404);
  }

  await db.batch([
    db.prepare("UPDATE enrolments SET mentor_id = ? WHERE id = ?").bind(mentorId, id),
    db.prepare("INSERT INTO notes (id, enrolment_id, body, visible_to_student) VALUES (?,?,?,0)")
      .bind(crypto.randomUUID(), id, mentor ? `Mentor assigned: ${mentor.full_name}` : "Mentor removed"),
  ]);

  if (notify && mentor) {
    const track = TRACK_LABEL[enr.track ?? ""] ?? "Undecided track";
    await Promise.all([
      sendEmail(c.env, {
        to: enr.email,
        subject: "Meet your mentor — Career Launch Platform",
        html: mentorAssignedEmail({ fullName: enr.full_name, mentorName: mentor.full_name, mentorEmail: mentor.email, programme: programmeLabel(enr.programme) }),
      }),
      sendEmail(c.env, {
        to: mentor.email,
        subject: `New apprentice: ${enr.full_name} — Career Launch Platform`,
        html: apprenticeAssignedEmail({ mentorName: mentor.full_name, apprenticeName: enr.full_name, apprenticeEmail: enr.email, track }),
      }),
    ]).catch((e) => console.error("mentor emails failed", e));
  }

  return c.json({ ok: true });
});

// ── Status change (any status, logged, optional email) ────────────────────
admin.post("/enrolments/:id/status", async (c) => {
  const id = c.req.param("id");
  const { status, reason, notify } = await c.req.json<{
    status: Status;
    reason?: string;
    notify?: boolean;
  }>();
  if (!STATUSES.includes(status)) return c.json({ error: "bad status" }, 400);

  const db = c.env.career_launch_db;
  const row = await db
    .prepare(
      "SELECT e.status, e.provider_subscription_id, e.programme, u.email, u.full_name FROM enrolments e JOIN users u ON u.id = e.user_id WHERE e.id = ?",
    )
    .bind(id)
    .first<{
      status: string;
      provider_subscription_id: string | null;
      programme: string;
      email: string;
      full_name: string;
    }>();
  if (!row) return c.json({ error: "not found" }, 404);
  if (row.status === status) return c.json({ ok: true, unchanged: true });

  // Stop PayPal charging when the enrolment ends.
  const ends = status === "rejected" || status === "cancelled" || status === "completed";
  let paypalCancelled = false;
  if (ends && row.provider_subscription_id) {
    try {
      const token = await paypalToken(c.env.PAYPAL_BASE, c.env.PAYPAL_CLIENT_ID, c.env.PAYPAL_CLIENT_SECRET);
      await cancelSubscription(c.env.PAYPAL_BASE, token, row.provider_subscription_id, `Enrolment ${status} by admin`);
      paypalCancelled = true;
    } catch (e) {
      console.error("paypal cancel failed", e); // already-cancelled subs throw; harmless
    }
  }

  await db.batch([
    db
      .prepare(
        "UPDATE enrolments SET status = ?, approved_at = CASE WHEN ? = 'approved' THEN datetime('now') ELSE approved_at END WHERE id = ?",
      )
      .bind(status, status, id),
    db
      .prepare("INSERT INTO status_log (id, enrolment_id, from_status, to_status, reason, actor) VALUES (?,?,?,?,?,'admin')")
      .bind(crypto.randomUUID(), id, row.status, status, reason ?? null),
  ]);

  if (notify) {
    await sendEmail(c.env, {
      to: row.email,
      subject: `${STATUS_LABEL[status]} — Career Launch Platform`,
      html: statusEmail({
        fullName: row.full_name,
        programme: programmeLabel(row.programme),
        status,
        message: reason,
      }),
    }).catch((e) => console.error("status email failed", e));
  }

  return c.json({ ok: true, paypalCancelled });
});

// ── Notes ─────────────────────────────────────────────────────────────────
admin.post("/enrolments/:id/notes", async (c) => {
  const id = c.req.param("id");
  const { body, visibleToStudent } = await c.req.json<{ body?: string; visibleToStudent?: boolean }>();
  if (!body?.trim()) return c.json({ error: "empty note" }, 400);
  const noteId = crypto.randomUUID();
  await c.env.career_launch_db
    .prepare("INSERT INTO notes (id, enrolment_id, body, visible_to_student) VALUES (?,?,?,?)")
    .bind(noteId, id, body.trim(), visibleToStudent ? 1 : 0)
    .run();
  return c.json({ ok: true, id: noteId });
});

admin.delete("/enrolments/:id/notes/:noteId", async (c) => {
  await c.env.career_launch_db
    .prepare("DELETE FROM notes WHERE id = ? AND enrolment_id = ?")
    .bind(c.req.param("noteId"), c.req.param("id"))
    .run();
  return c.json({ ok: true });
});

// ── Email a student ───────────────────────────────────────────────────────
admin.post("/enrolments/:id/email", async (c) => {
  const id = c.req.param("id");
  const { subject, message } = await c.req.json<{ subject?: string; message?: string }>();
  if (!subject?.trim() || !message?.trim()) return c.json({ error: "subject and message required" }, 400);

  const row = await c.env.career_launch_db
    .prepare("SELECT u.email, u.full_name FROM enrolments e JOIN users u ON u.id = e.user_id WHERE e.id = ?")
    .bind(id)
    .first<{ email: string; full_name: string }>();
  if (!row) return c.json({ error: "not found" }, 404);

  await sendEmail(c.env, {
    to: row.email,
    subject: subject.trim(),
    html: customEmail({ fullName: row.full_name, message: message.trim() }),
  });
  await c.env.career_launch_db
    .prepare("INSERT INTO emails_sent (id, enrolment_id, to_email, subject, body) VALUES (?,?,?,?,?)")
    .bind(crypto.randomUUID(), id, row.email, subject.trim(), message.trim())
    .run();
  return c.json({ ok: true });
});

// ── Edit student profile ──────────────────────────────────────────────────
admin.patch("/users/:id", async (c) => {
  const { fullName, institution, graduationYear } = await c.req.json<{
    fullName?: string;
    institution?: string;
    graduationYear?: number | null;
  }>();
  if (!fullName?.trim()) return c.json({ error: "name required" }, 400);
  await c.env.career_launch_db
    .prepare("UPDATE users SET full_name = ?, institution = ?, graduation_year = ? WHERE id = ?")
    .bind(fullName.trim(), institution?.trim() || null, graduationYear ?? null, c.req.param("id"))
    .run();
  return c.json({ ok: true });
});

// ── CSV export ────────────────────────────────────────────────────────────
admin.get("/export.csv", async (c) => {
  const rows = (
    await c.env.career_launch_db
      .prepare(
        `SELECT u.full_name, u.email, u.institution, u.graduation_year, e.programme, e.track, e.billing, e.status, e.created_at,
                (SELECT COALESCE(SUM(amount),0) FROM payments p WHERE p.enrolment_id = e.id) AS paid_cents
         FROM enrolments e JOIN users u ON u.id = e.user_id ORDER BY e.created_at DESC`,
      )
      .all<any>()
  ).results;
  const csv = [
    "name,email,institution,graduation_year,programme,track,billing,status,applied,paid_usd",
    ...rows.map((r: any) =>
      [r.full_name, r.email, r.institution, r.graduation_year, r.programme, r.track, r.billing, r.status, r.created_at, (r.paid_cents / 100).toFixed(2)]
        .map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`)
        .join(","),
    ),
  ].join("\n");
  return c.body(csv, 200, {
    "Content-Type": "text/csv",
    "Content-Disposition": "attachment; filename=applications.csv",
  });
});
