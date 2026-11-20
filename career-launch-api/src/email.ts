import { WorkerMailer } from "worker-mailer";

type Mail = { to: string; subject: string; html: string };

const FROM_NAME = "Career Launch Platform";

/** Switch provider with env.MAIL_PROVIDER = "postal" | "smtp". */
export async function sendEmail(env: Env, mail: Mail) {
  if (env.MAIL_PROVIDER === "smtp") return sendViaSmtp(env, mail);
  return sendViaPostal(env, mail);
}

// ── Postal (HTTP API) ─────────────────────────────────────────
async function sendViaPostal(env: Env, m: Mail) {
  const res = await fetch("https://email.birthdaymessaging.io/api/v1/send/message", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Server-API-Key": env.POSTAL_API_KEY },
    body: JSON.stringify({
      to: [m.to],
      from: `${FROM_NAME} <noreply@careers.birthdaymessaging.io>`,
      subject: m.subject,
      html_body: m.html,
    }),
  });
  if (!res.ok) throw new Error(`Postal ${res.status}: ${await res.text()}`);
}

// ── Plain SMTP mailbox (temporary while Postal is down) ───────
async function sendViaSmtp(env: Env, m: Mail) {
  const port = Number(env.SMTP_PORT ?? 465);
  const mailer = await WorkerMailer.connect({
    host: env.SMTP_HOST,
    port,
    secure: port === 465,      // 465 = implicit TLS
    startTls: port !== 465,    // 587 = STARTTLS
    authType: "plain",         // if login fails, try "login"
    credentials: { username: env.SMTP_USER, password: env.SMTP_PASS },
  });
  try {
    await mailer.send({
      from: { name: FROM_NAME, email: env.MAIL_FROM },
      to: { email: m.to },
      subject: m.subject,
      html: m.html,
    });
  } finally {
    await mailer.close();
  }
}