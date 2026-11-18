// Renders sample emails to ./email-preview/*.html and checks them for obvious defects.
// Run: node --experimental-strip-types scripts/preview-emails.ts
import { mkdirSync, writeFileSync } from "node:fs";
import { LOGO_PNG_BASE64 } from "../src/email-logo.ts";
import * as t from "../src/email-templates.ts";

const user = { fullName: "Ada <Obi>" };
const programme = "Apprenticeship";
const payLink = "https://example.com/pay";

const samples: Record<string, string> = {
  application: t.applicationEmail({ ...user, programme, payLink, resend: false }),
  "application-resend": t.applicationEmail({ ...user, programme, payLink, resend: true }),
  "magic-link": t.magicLinkEmail({ ...user, link: "https://example.com/verify" }),
  welcome: t.welcomeEmail({ ...user, programme }),
  "payment-failed": t.paymentFailedEmail(user),
  "payment-receipt": t.paymentReceiptEmail({ ...user, programme, amount: "$250.00", paidOn: "15 November 2026" }),
};

const checks: [RegExp, string][] = [
  [/undefined|\[object|\$\{/, "unrendered variable"],
  [/href=""/, "empty href"],
  [/<script/i, "script tag"],
  [/Ada <Obi>/, "unescaped name"],
];

mkdirSync("email-preview", { recursive: true });
let failed = false;
for (const [name, html] of Object.entries(samples)) {
  // Inline the logo so the preview works before the worker route is deployed.
  const preview = html.replaceAll(t.LOGO_URL, `data:image/png;base64,${LOGO_PNG_BASE64}`);
  writeFileSync(`email-preview/${name}.html`, preview);
  const problems = checks.filter(([re]) => re.test(html)).map(([, msg]) => msg);
  failed ||= problems.length > 0;
  console.log(problems.length ? `FAIL ${name}: ${problems}` : `ok   ${name}`);
}
process.exit(failed ? 1 : 0);
