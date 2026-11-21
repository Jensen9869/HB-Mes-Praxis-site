import { Hono } from "hono";
import { cors } from "hono/cors";
import { sendEmail } from "./email";
import { LOGO_PNG_BASE64 } from "./email-logo";
import {
  applicationEmail,
  magicLinkEmail,
  welcomeEmail,
  paymentFailedEmail,
  paymentReceiptEmail,
} from "./email-templates";
import { randomToken, createSession } from "./auth";
import { paypalToken, createSubscription, verifyWebhook } from "./paypal";
import { programmeLabel } from "./labels";
import { me } from "./me";
import { admin } from "./admin";
import { setCookie, deleteCookie } from "hono/cookie";

type Billing = "monthly" | "upfront";

function planIdFor(env: Env, programme: string, billing: Billing) {
  const plans: Record<Billing, Record<string, string | undefined>> = {
    monthly: {
      apprenticeship: env.PAYPAL_PLAN_APPRENTICESHIP,
      "mentorship-6mo": env.PAYPAL_PLAN_MENTORSHIP_6MO,
      "mentorship-3mo": env.PAYPAL_PLAN_MENTORSHIP_3MO,
    },
    upfront: {
      apprenticeship: env.PAYPAL_PLAN_APPRENTICESHIP_UPFRONT,
      "mentorship-6mo": env.PAYPAL_PLAN_MENTORSHIP_6MO_UPFRONT,
      "mentorship-3mo": env.PAYPAL_PLAN_MENTORSHIP_3MO_UPFRONT,
    },
  };
  return plans[billing]?.[programme];
}

const findEnrollee = (db: D1Database, enrolmentId: string) =>
  db
    .prepare(
      "SELECT u.email, u.full_name, e.programme FROM enrolments e JOIN users u ON u.id = e.user_id WHERE e.id = ?",
    )
    .bind(enrolmentId)
    .first<{ email: string; full_name: string; programme: string }>();

/** Record a status change made by PayPal / the system (admin changes are logged in admin.ts). */
const logStatus = (
  db: D1Database,
  enrolmentId: string,
  toStatus: string,
  actor: string,
  reason?: string,
) =>
  db
    .prepare(
      "INSERT INTO status_log (id, enrolment_id, from_status, to_status, reason, actor) SELECT ?, id, status, ?, ?, ? FROM enrolments WHERE id = ? AND status != ?",
    )
    .bind(crypto.randomUUID(), toStatus, reason ?? null, actor, enrolmentId, toStatus)
    .run();

const app = new Hono<{ Bindings: Env }>();

const APP_URL = "https://api.praxis.birthdaymessaging.io";
const SITE_URL = "https://praxis.birthdaymessaging.io";

const logoPng = Uint8Array.from(atob(LOGO_PNG_BASE64), (ch) => ch.charCodeAt(0));
app.get(
  "/email/logo.png",
  () =>
    new Response(logoPng, {
      headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=86400" },
    }),
);

app.use(
  "/api/*",
  cors({
    origin: ["http://localhost:3000", SITE_URL],
    credentials: true, // portal/admin send the session cookie
  }),
);

const rateLimited = async (c: any, next: any) => {
  const ip = c.req.header("cf-connecting-ip") ?? "unknown";
  const { success } = await c.env.FORM_LIMITER.limit({ key: ip });
  if (!success) {
    return c.json({ error: "Too many requests. Please wait a minute and try again." }, 429);
  }
  await next();
};

app.use("/api/enrolment", rateLimited);
app.use("/api/auth/magic-link", rateLimited);
app.use("/api/admin/login", rateLimited);

app.get("/api/health", (c) => c.json({ ok: true }));
app.get("/api/payments/paypal/return", (c) => c.redirect(`${SITE_URL}/?payment=success`));
app.get("/api/payments/paypal/cancel", (c) => c.redirect(`${SITE_URL}/?payment=cancelled`));

// Old server-rendered pages → new React pages
app.get("/portal", (c) => c.redirect(`${SITE_URL}/portal`));
app.get("/admin", (c) => c.redirect(`${SITE_URL}/admin`));
app.get("/admin/login", (c) => c.redirect(`${SITE_URL}/admin`));

app.post("/api/enrolment", async (c) => {
  const b = await c.req.json<{
    fullName: string;
    email: string;
    institution?: string;
    graduationYear?: number;
    programme: string;
    track?: string;
    billing?: Billing;
  }>();

  if (!b.fullName || !b.email || !b.programme) {
    return c.json({ error: "fullName, email, and programme are required" }, 400);
  }

  const billing: Billing = b.billing === "upfront" ? "upfront" : "monthly";
  const db = c.env.career_launch_db;
  const payLink = (id: string) => `${APP_URL}/api/payments/paypal/start?enrolment=${id}`;

  const sendApplicationEmail = async (enrolmentId: string, resend = false) => {
    await sendEmail(c.env, {
      to: b.email,
      subject: resend
        ? "Your payment link — Career Launch Platform"
        : "We received your application — Career Launch Platform",
      html: applicationEmail({
        fullName: b.fullName,
        programme: programmeLabel(b.programme),
        payLink: payLink(enrolmentId),
        resend,
        upfront: billing === "upfront",
      }),
    }).catch((err) => console.error("application email failed", err));
  };

  let user = await db.prepare("SELECT id FROM users WHERE email= ?").bind(b.email).first<{ id: string }>();

  if (!user) {
    user = { id: crypto.randomUUID() };
    await db
      .prepare("INSERT INTO users (id, email, full_name, institution, graduation_year) VALUES (?, ?, ?, ?, ?)")
      .bind(user.id, b.email, b.fullName, b.institution ?? null, b.graduationYear ?? null)
      .run();
  }

  const existing = await db
    .prepare(
      "SELECT id, status FROM enrolments WHERE user_id = ? AND programme = ? AND status IN ('awaiting_payment', 'active', 'approved', 'payment_failed') ORDER BY created_at DESC LIMIT 1",
    )
    .bind(user.id, b.programme)
    .first<{ id: string; status: string }>();

  if (existing) {
    if (existing.status === "awaiting_payment") {
      await db.prepare("UPDATE enrolments SET billing = ? WHERE id = ?").bind(billing, existing.id).run();
      await sendApplicationEmail(existing.id, true);
      return c.json({ enrolmentId: existing.id, existing: true, payUrl: payLink(existing.id) }, 200);
    }
    return c.json(
      { error: "You are already enrolled in this programme. Sign in to view your enrolment." },
      409,
    );
  }

  const enrolmentId = crypto.randomUUID();
  await db
    .prepare("INSERT INTO enrolments (id, user_id, programme, track, billing) VALUES (?,?,?,?,?)")
    .bind(enrolmentId, user.id, b.programme, b.track ?? null, billing)
    .run();

  await sendApplicationEmail(enrolmentId);
  return c.json({ enrolmentId, payUrl: payLink(enrolmentId) }, 201);
});

app.post("/api/auth/magic-link", async (c) => {
  const { email } = await c.req.json<{ email: string }>();
  if (!email) return c.json({ error: "email required" }, 400);

  const db = c.env.career_launch_db;
  const user = await db
    .prepare("SELECT id, full_name FROM users WHERE email = ?")
    .bind(email)
    .first<{ id: string; full_name: string }>();

  if (user) {
    const token = randomToken();
    const expires = new Date(Date.now() + 15 * 60 * 1000).toISOString();
    await db
      .prepare("INSERT INTO login_tokens (token, user_id, expires_at) VALUES (?, ?, ?)")
      .bind(token, user.id, expires)
      .run();

    const link = `${APP_URL}/api/auth/verify?token=${token}`;
    try {
      await sendEmail(c.env, {
        to: email,
        subject: "Your sign-in link — Career Launch Platform",
        html: magicLinkEmail({ fullName: user.full_name, link }),
      });
    } catch (err) {
      console.error("magic link email failed", err);
    }
  }
  return c.json({ ok: true });
});

// user clicks link in email
app.get("/api/auth/verify", async (c) => {
  const token = c.req.query("token");
  if (!token) return c.text("Missing token", 400);

  const db = c.env.career_launch_db;
  const row = await db
    .prepare("SELECT user_id, expires_at, used FROM login_tokens WHERE token = ?")
    .bind(token)
    .first<{ user_id: string; expires_at: string; used: number }>();

  if (!row || row.used || new Date(row.expires_at) < new Date()) {
    return c.redirect(`${SITE_URL}/portal?error=expired`);
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
    deleteCookie(c, "admin_session", { path: "/api/admin", secure: true, sameSite: "Lax" }); // drop any admin session
  return c.redirect(`${SITE_URL}/portal`);
});

app.route("/api/me", me);
app.route("/api/admin", admin);

app.get("/api/payments/paypal/start", async (c) => {
  const enrolmentId = c.req.query("enrolment");
  if (!enrolmentId) return c.text("Missing enrolment", 400);

  const db = c.env.career_launch_db;
  const row = await db
    .prepare(
      "SELECT e.id, e.programme, e.status, e.billing, u.email, u.full_name FROM enrolments e JOIN users u ON u.id = e.user_id WHERE e.id = ?",
    )
    .bind(enrolmentId)
    .first<{ id: string; programme: string; status: string; billing: Billing; email: string; full_name: string }>();

  if (!row) return c.text("Application not found", 404);

  if (row.status !== "awaiting_payment") {
    return c.redirect(`${SITE_URL}/portal`);
  }

  const planId = planIdFor(c.env, row.programme, row.billing);
  if (!planId) return c.text("No plan for this programme", 500);

  const token = await paypalToken(c.env.PAYPAL_BASE, c.env.PAYPAL_CLIENT_ID, c.env.PAYPAL_CLIENT_SECRET);
  const { subscriptionId, approveUrl } = await createSubscription(c.env.PAYPAL_BASE, token, {
    planId,
    enrolmentId: row.id,
    fullName: row.full_name,
    email: row.email,
    returnUrl: `${APP_URL}/api/payments/paypal/return?enrolment=${row.id}`,
    cancelUrl: `${APP_URL}/api/payments/paypal/cancel?enrolment=${row.id}`,
  });

  await db
    .prepare("UPDATE enrolments SET provider = 'paypal', provider_subscription_id= ? WHERE id = ?")
    .bind(subscriptionId, row.id)
    .run();

  return c.redirect(approveUrl);
});

app.post("/api/webhooks/paypal", async (c) => {
  const rawBody = await c.req.text();
  const token = await paypalToken(c.env.PAYPAL_BASE, c.env.PAYPAL_CLIENT_ID, c.env.PAYPAL_CLIENT_SECRET);

  const ok = await verifyWebhook(c.env.PAYPAL_BASE, token, c.env.PAYPAL_WEBHOOK_ID, c.req.raw.headers, rawBody);
  if (!ok) {
    console.error("paypal webhook: bad signature");
    return c.text("bad signature", 400);
  }

  const event = JSON.parse(rawBody) as { id: string; event_type: string; resource: Record<string, any> };
  const db = c.env.career_launch_db;
  const r = event.resource;

  console.log("paypal_webhook", event.event_type, r.id);

  switch (event.event_type) {
    case "BILLING.SUBSCRIPTION.ACTIVATED": {
      const enrolmentId = r.custom_id as string;
      await logStatus(db, enrolmentId, "active", "paypal", "Subscription activated");
      await db
        .prepare(
          "UPDATE enrolments SET status = 'active', provider_subscription_id = ? WHERE id = ? AND status = 'awaiting_payment' ",
        )
        .bind(r.id, enrolmentId)
        .run();

      const row = await findEnrollee(db, enrolmentId);
      if (row) {
        await sendEmail(c.env, {
          to: row.email,
          subject: "Welcome to Career Launch — your place is active",
          html: welcomeEmail({ fullName: row.full_name, programme: programmeLabel(row.programme) }),
        }).catch((e) => console.error("activation email failed", e));
      }
      break;
    }

    case "PAYMENT.SALE.COMPLETED": {
      // Monthly charge succeeded. Sale id is the primary key, so PayPal re-deliveries are ignored.
      const subId = r.billing_agreement_id as string | undefined;
      if (!subId) break;
      const enr = await db
        .prepare("SELECT id FROM enrolments WHERE provider_subscription_id = ?")
        .bind(subId)
        .first<{ id: string }>();
      if (!enr) break;

      const amount = Math.round(parseFloat(r.amount.total) * 100);
      const inserted = await db
        .prepare(
          "INSERT OR IGNORE INTO payments (id, enrolment_id, provider_invoice_id, amount, currency, status, paid_at) VALUES (?,?,?,?,?,?,?)",
        )
        .bind(r.id, enr.id, r.id, amount, r.amount.currency, "paid", r.create_time)
        .run();
      if (!inserted.meta.changes) break;

      const row = await findEnrollee(db, enr.id);
      if (row) {
        await sendEmail(c.env, {
          to: row.email,
          subject: "Payment received — Career Launch Platform",
          html: paymentReceiptEmail({
            fullName: row.full_name,
            programme: programmeLabel(row.programme),
            amount: new Intl.NumberFormat("en", { style: "currency", currency: r.amount.currency }).format(amount / 100),
            paidOn: new Date(r.create_time).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }),
          }),
        }).catch((e) => console.error("receipt email failed", e));
      }
      break;
    }

    case "BILLING.SUBSCRIPTION.PAYMENT.FAILED": {
      const enr = await db
        .prepare("SELECT id FROM enrolments WHERE provider_subscription_id = ? AND status = 'active'")
        .bind(r.id)
        .first<{ id: string }>();
      if (!enr) break;
      await logStatus(db, enr.id, "payment_failed", "paypal", "Instalment failed");
      await db.prepare("UPDATE enrolments SET status = 'payment_failed' WHERE id = ?").bind(enr.id).run();

      const row = await findEnrollee(db, enr.id);
      if (row) {
        await sendEmail(c.env, {
          to: row.email,
          subject: "Payment failed — action needed",
          html: paymentFailedEmail({ fullName: row.full_name }),
        }).catch((e) => console.error("failure email failed", e));
      }
      break;
    }

    case "BILLING.SUBSCRIPTION.CANCELLED":
    case "BILLING.SUBSCRIPTION.SUSPENDED": {
      const enr = await db
        .prepare("SELECT id FROM enrolments WHERE provider_subscription_id = ? AND status IN ('active', 'payment_failed')")
        .bind(r.id)
        .first<{ id: string }>();
      if (!enr) break;
      await logStatus(db, enr.id, "cancelled", "paypal", event.event_type);
      await db.prepare("UPDATE enrolments SET status = 'cancelled' WHERE id = ?").bind(enr.id).run();
      break;
    }
  }

  return c.json({ received: true });
});

export default app;
