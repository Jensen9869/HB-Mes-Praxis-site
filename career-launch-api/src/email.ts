export async function sendEmail(
  apiKey: string,
  opts: { to: string; subject: string; html: string },
) {
  const res = await fetch(
    "https://email.birthdaymessaging.io/api/v1/send/message",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Server-API-Key": apiKey,
      },
      body: JSON.stringify({
        to: [opts.to],
        from: "Career Launch Platform <noreply@careers.birthdaymessaging.io>",
        subject: opts.subject,
        html_body: opts.html,
      }),
    },
  );
  if (!res.ok) {
    throw new Error(`Postal ${res.status}: ${await res.text()}`);
  }
  return res.json();
}
