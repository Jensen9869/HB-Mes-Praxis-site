import { Hono } from "hono";
import { cors } from "hono/cors";

type Bindings = { career_launch_db: D1Database };
const app = new Hono<{ Bindings: Bindings }>();

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

  if (!user){
    user = {id: crypto.randomUUID()}
    await db.prepare(
      'INSERT INTO users (id, email, full_name, institution, graduation_year) VALUES (?, ?, ?, ?, ?)'
    ).bind(user.id, b.email, b.fullName, b.institution ?? null, b.graduationYear ?? null).run()
  }


  const existing = await db
    .prepare(
      "SELECT id FROM enrolments WHERE user_id = ? AND programme = ? AND status = 'awaiting_payment' "
    )
    .bind(user.id, b.programme)
    .first<{id: string}>();

  if (existing){
    return c.json({enrolmentId: existing.id, existing: true}, 200);
  }

  const enrolmentId = crypto.randomUUID()
  await db.prepare(
    'INSERT INTO enrolments (id, user_id, programme, track) VALUES (?,?,?,?)'
  ).bind(enrolmentId, user.id, b.programme, b.track ?? null).run()
  return c.json({enrolmentId}, 201)
});

export default app;
