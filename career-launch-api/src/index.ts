import { Hono } from "hono";
import { cors } from "hono/cors";
import { sendEmail } from "./email";

const app = new Hono<{ Bindings: Env }>();

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

const PROGRAMME_LABELS: Record<string, string> = {
  "apprenticeship": "Apprenticeship Programme (12 months)",
  "mentorship-6mo": "Professional Mentorship (6 months)",
  "mentorship-3mo": "Professional Mentorship (3 months)",
};

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

  try{
    await sendEmail(c.env.POSTAL_API_KEY, {
      to: b.email,
      subject: "We received your application — Career Launch Platform",
      html: `
        <p>Hi ${b.fullName},</p>
        <p>Thanks for applying to the <strong>${PROGRAMME_LABELS[b.programme] ?? b.programme}</strong> programme. We have your application and will be in touch by email.</p>
        <p>— Career Launch Platform</p>
      `,
    })
  }catch(err){
    console.error("Confirmation email failed", err);
  }
  return c.json({enrolmentId}, 201)
});

export default app;
