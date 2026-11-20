// Branded email layout. Tables + inline styles for email-client compatibility.
// Colours mirror career-launch-platform/src/index.css.
const BRAND = "Career Launch Platform";
const SUPPORT = "support@careers.birthdaymessaging.io"; // ← confirm with Alex (hr@birthdaymessaging.io?)
export const LOGO_URL = "https://api.praxis.birthdaymessaging.io/email/logo.png";

const PRIMARY = "#ea580c";
const NAVY = "#102a43";
const FONT =
  "'Plus Jakarta Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
const TABLE = 'role="presentation" cellpadding="0" cellspacing="0" border="0"';
const FOOTER_STYLE = `margin:0 0 6px;font-family:${FONT};font-size:13px;line-height:20px;color:#64748b;`;

export const esc = (s: string) =>
  s.replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);

const p = (html: string) =>
  `<p style="margin:0 0 16px;font-family:${FONT};font-size:16px;line-height:26px;color:#334155;">${html}</p>`;

const strong = (text: string) =>
  `<strong style="color:${NAVY};">${esc(text)}</strong>`;

const button = (href: string, label: string) => `
<table ${TABLE} style="margin:8px 0 24px;"><tr>
  <td bgcolor="${PRIMARY}" style="border-radius:999px;">
    <a href="${href}" style="display:inline-block;padding:14px 28px;font-family:${FONT};font-size:16px;font-weight:700;color:#ffffff;text-decoration:none;">${label}</a>
  </td>
</tr></table>`;

function layout(preheader: string, reason: string, ...body: string[]) {
  return `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${BRAND}</title>
</head>
<body style="margin:0;padding:0;background:#f8fafc;">
<div style="display:none;max-height:0;overflow:hidden;">${preheader}</div>
<table ${TABLE} width="100%"><tr><td align="center" style="padding:24px 12px;">
  <table ${TABLE} width="100%" style="max-width:600px;">
    <tr><td align="center" bgcolor="${NAVY}" style="padding:24px;border-radius:16px 16px 0 0;">
      <table ${TABLE}><tr>
        <td style="padding-right:10px;"><img src="${LOGO_URL}" alt="" width="36" height="36" style="display:block;border-radius:10px;"></td>
        <td style="font-family:${FONT};font-size:20px;font-weight:800;letter-spacing:-0.02em;color:#ffffff;">${BRAND}</td>
      </tr></table>
    </td></tr>
    <tr><td bgcolor="#ffffff" style="padding:32px 28px 16px;border:1px solid #e2e8f0;border-top:0;">
      ${body.join("")}
    </td></tr>
    <tr><td bgcolor="#ffffff" style="padding:20px 28px;border:1px solid #e2e8f0;border-top:0;border-radius:0 0 16px 16px;">
      <p style="${FOOTER_STYLE}">${reason}</p>
      <p style="${FOOTER_STYLE}">Questions? Contact <a href="mailto:${SUPPORT}" style="color:${PRIMARY};">${SUPPORT}</a></p>
    </td></tr>
  </table>
</td></tr></table>
</body></html>`;
}

export const applicationEmail = (a: {
  fullName: string;
  programme: string;
  payLink: string;
  resend: boolean;
  upfront?: boolean;
}) =>
  layout(
    a.resend ? "Your payment link" : "We received your application",
    `You received this because you applied to the ${BRAND}.`,
    p(`Hi ${esc(a.fullName)},`),
    p(
      `${a.resend ? "Here is your payment link again for" : "Thanks for applying to"} the ${strong(a.programme)}.`,
    ),
    p(
      a.upfront
        ? "To secure your place, complete your payment here:"
        : "To secure your place, complete your first instalment here:",
    ),
    button(a.payLink, "Pay now with PayPal"),
    p(`— ${BRAND}`),
  );

export const magicLinkEmail = (a: { fullName: string; link: string }) =>
  layout(
    "Your one-time sign-in link",
    "You received this because a sign-in link was requested for your account.",
    p(`Hi ${esc(a.fullName)},`),
    button(a.link, "Click here to sign in"),
    p("This link works once and expires in 15 minutes."),
    p("If you did not request this, you can ignore this email."),
  );

export const welcomeEmail = (a: { fullName: string; programme: string }) =>
  layout(
    "Your place is active",
    `You received this because you enrolled in the ${BRAND}.`,
    p(`Hi ${esc(a.fullName)},`),
    p(
      `Welcome aboard! Your place in the ${strong(a.programme)} is now active. We will be in touch with next steps.`,
    ),
  );

export const paymentFailedEmail = (a: { fullName: string }) =>
  layout(
    "Action needed on your payment",
    "You received this because a payment on your enrolment failed.",
    p(`Hi ${esc(a.fullName)},`),
    p(
      "Your latest instalment could not be processed. Please update your payment method in your PayPal account. PayPal will retry automatically.",
    ),
  );

export const paymentReceiptEmail = (a: {
  fullName: string;
  programme: string;
  amount: string;
  paidOn: string;
}) =>
  layout(
    "Payment received",
    `You received this because a payment was made for the ${BRAND}.`,
    p(`Hi ${esc(a.fullName)},`),
    p(
      `Thank you. We received your payment of ${strong(a.amount)} for the ${strong(a.programme)} on ${esc(a.paidOn)}.`,
    ),
    p("No action is needed. Keep this email as your receipt."),
  );

/** Sent when an admin changes an enrolment status. */
export const statusEmail = (a: {
  fullName: string;
  programme: string;
  status: string;
  message?: string;
}) => {
  const copy: Record<string, { pre: string; body: string }> = {
    approved: {
      pre: "You're in",
      body: `Your application for the ${strong(a.programme)} has been approved. We will be in touch shortly with your onboarding details.`,
    },
    rejected: {
      pre: "Update on your application",
      body: `Unfortunately we are unable to offer you a place in the ${strong(a.programme)} at this time.`,
    },
    cancelled: {
      pre: "Your enrolment has been cancelled",
      body: `Your enrolment in the ${strong(a.programme)} has been cancelled and no further instalments will be charged.`,
    },
    completed: {
      pre: "Congratulations",
      body: `You have completed the ${strong(a.programme)}. Well done — we hope it has set you up for your next step.`,
    },
  };
  const c = copy[a.status] ?? {
    pre: "Update on your enrolment",
    body: `The status of your enrolment in the ${strong(a.programme)} has been updated.`,
  };
  return layout(
    c.pre,
    `You received this because you have an enrolment with the ${BRAND}.`,
    p(`Hi ${esc(a.fullName)},`),
    p(c.body),
    ...(a.message ? [p(esc(a.message).replace(/\n/g, "<br>"))] : []),
  );
};

/** Free-form message written by an admin in the portal. */
export const customEmail = (a: { fullName: string; message: string }) =>
  layout(
    "A message from the Career Launch team",
    `You received this because you have an enrolment with the ${BRAND}.`,
    p(`Hi ${esc(a.fullName)},`),
    p(esc(a.message).replace(/\n/g, "<br>")),
    p(`— ${BRAND} team`),
  );

/** Sent to the apprentice when a mentor is assigned. */
export const mentorAssignedEmail = (a: { fullName: string; mentorName: string; mentorEmail: string; programme: string }) =>
  layout(
    "Meet your mentor",
    `You received this because you are enrolled in the ${BRAND}.`,
    p(`Hi ${esc(a.fullName)},`),
    p(`Good news — ${strong(a.mentorName)} will be your mentor for the ${strong(a.programme)}.`),
    p(`You can reach them at <a href="mailto:${esc(a.mentorEmail)}" style="color:${PRIMARY};">${esc(a.mentorEmail)}</a>. They will be in touch to arrange your first session.`),
  );

/** Sent to the mentor when an apprentice is assigned to them. */
export const apprenticeAssignedEmail = (a: { mentorName: string; apprenticeName: string; apprenticeEmail: string; track: string }) =>
  layout(
    "A new apprentice has been assigned to you",
    `You received this because you are a mentor on the ${BRAND}.`,
    p(`Hi ${esc(a.mentorName)},`),
    p(`${strong(a.apprenticeName)} (${esc(a.track)}) has been assigned to you as an apprentice.`),
    p(`Their email is <a href="mailto:${esc(a.apprenticeEmail)}" style="color:${PRIMARY};">${esc(a.apprenticeEmail)}</a>. Please reach out within the next few days to arrange your first session.`),
  );
