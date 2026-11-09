import { Hono } from "hono";
import { cors } from "hono/cors";
import { sendEmail } from "./email";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";
import { randomToken, createSession, readSession } from "./auth";

const PROGRAMME_LABELS: Record<string, string> = {
  apprenticeship: "Apprenticeship Programme (12 months)",
  "mentorship-6mo": "Professional Mentorship (6 months)",
  "mentorship-3mo": "Professional Mentorship (3 months)",
};

const app = new Hono<{ Bindings: Env }>();

// change when go live
const APP_URL = "https://career-launch-api.white-glade-ab2c.workers.dev";

app.use(
  "/api/*",
  cors({
    origin: [
      "http://localhost:3000",
      "https://career-launch-platform.white-glade-ab2c.workers.dev",
    ],
  }),
);

app.get("/api/health", (c) => c.json({ ok: true }));

app.post("/api/enrolment", async (c) => {
  const b = await c.req.json<{
    fullName: string;
    email: string;
    institution?: string;
    graduationYear?: number;
    programme: string;
    track?: string;
  }>();

  if (!b.fullName || !b.email || !b.programme) {
    return c.json(
      { error: "fullName, email, and programme are required" },
      400,
    );
  }

  const db = c.env.career_launch_db;

  let user = await db
    .prepare("SELECT id FROM users WHERE email = ?")
    .bind(b.email)
    .first<{ id: string }>();

  if (!user) {
    user = { id: crypto.randomUUID() };
    await db
      .prepare(
        "INSERT INTO users (id, email, full_name, institution, graduation_year) VALUES (?, ?, ?, ?, ?)",
      )
      .bind(
        user.id,
        b.email,
        b.fullName,
        b.institution ?? null,
        b.graduationYear ?? null,
      )
      .run();
  }

  const existing = await db
    .prepare(
      "SELECT id FROM enrolments WHERE user_id = ? AND programme = ? AND status = 'awaiting_payment' ",
    )
    .bind(user.id, b.programme)
    .first<{ id: string }>();

  if (existing) {
    return c.json({ enrolmentId: existing.id, existing: true }, 200);
  }

  const enrolmentId = crypto.randomUUID();
  await db
    .prepare(
      "INSERT INTO enrolments (id, user_id, programme, track) VALUES (?,?,?,?)",
    )
    .bind(enrolmentId, user.id, b.programme, b.track ?? null)
    .run();

  try {
    await sendEmail(c.env.POSTAL_API_KEY, {
      to: b.email,
      subject: "We received your application — Career Launch Platform",
      html: `
        <p>Hi ${b.fullName},</p>
        <p>Thanks for applying to the <strong>${PROGRAMME_LABELS[b.programme] ?? b.programme}</strong> programme. We have your application and will be in touch by email.</p>
        <p>— Career Launch Platform</p>
      `,
    });
  } catch (err) {
    console.error("Confirmation email failed", err);
  }
  return c.json({ enrolmentId }, 201);
});

app.post("/api/auth/magic-link", async (c) => {
  const { email } = await c.req.json<{ email: string }>();
  if (!email) {
    return c.json({ error: "email required" }, 400);
  }

  const db = c.env.career_launch_db;
  const user = await db
    .prepare("SELECT id, full_name FROM users WHERE email = ?")
    .bind(email)
    .first<{ id: string; full_name: string }>();

  if (user) {
    const token = randomToken();
    const expires = new Date(Date.now() + 15 * 60 * 1000).toISOString();
    await db
      .prepare(
        "INSERT INTO login_tokens (token, user_id, expires_at) VALUES (?, ?, ?)",
      )
      .bind(token, user.id, expires)
      .run();

    const link = `${APP_URL}/api/auth/verify?token=${token}`;
    try {
      await sendEmail(c.env.POSTAL_API_KEY, {
        to: email,
        subject: "Your sign-in link — Career Launch Platform",
        html: `<p>Hi ${user.full_name},</p>
               <p><a href="${link}">Click here to sign in</a>. This link works once and expires in 15 minutes.</p>
               <p>If you did not request this, you can ignore this email.</p>`,
      });
    } catch (err) {
      console.error("magic link email failed", err);
    }
  }
  return c.json({ ok: true });
});

// user click link
app.get("/api/auth/verify", async (c) => {
  const token = c.req.query("token");
  if (!token) return c.text("Missing token", 400);

  const db = c.env.career_launch_db;
  const row = await db.prepare(
    "SELECT user_id, expires_at, used FROM login_tokens WHERE token = ?"
  ).bind(token).first<{user_id: string; expires_at: string; used: number}>();

  if (!row || row.used || new Date(row.expires_at) < new Date()){
    return c.text("This link is invalid or has expired. Please request a new one.", 400);
  }

  await db.prepare("UPDATE login_tokens SET used = 1 WHERE token = ?").bind(token).run();

  const session = await createSession(c.env.SESSION_SECRET, row.user_id);
  setCookie(c, "session", session, {
    httpOnly: true,
    secure: true,
    sameSite: "Lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  // change when panel done
  return c.redirect("/portal");
});

// use cookie get data
app.get("/api/me", async (c) => {
  const userId = await readSession(c.env.SESSION_SECRET, getCookie(c, "session"));
  if (!userId) return c.json({error: "not signed in"}, 401);

  const db = c.env.career_launch_db;
  const user = await db.prepare(
    "SELECT id, email, full_name, institution, graduation_year FROM users WHERE id = ?"
  ).bind(userId).first();

  const enrolments = await db.prepare(
    "SELECT id, programme, track, status, created_at FROM enrolments WHERE user_id = ? ORDER BY created_at DESC"
  ).bind(userId).all();

  return c.json({user, enrolments: enrolments.results});
})

//temp page
app.get("/portal", async (c) => {
  const userId = await readSession(c.env.SESSION_SECRET, getCookie(c, 'session'));
  if (!userId){
    return c.text("Not signed in", 401);
  }
  return c.html(`<h1>Signed in</h1><p>User panel coming soon.</p><p><a href="/api/me">See my data</a></p>`);
})

//temp logout
app.post("/api/auth/logout", (c) => {
  deleteCookie(c, "session", {path: "/"});
  return c.json({ok: true});
})

export default app;
