
// change when go live version
const PAYPAL_BASE = "https://api-m.sandbox.paypal.com";

export async function paypalToken(clientId: string, secret: string) {
  const res = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: "Basic " + btoa(`${clientId}:${secret}`),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) {
    throw new Error(`PayPal auth ${res.status}: ${await res.text()}`);
  }

  const data = await res.json<{ access_token: string }>();
  return data.access_token;
}

export async function paypalFetch(
  token: string,
  path: string,
  init: RequestInit = {},
) {
  const res = await fetch(`${PAYPAL_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Paypal ${res.status} ${path}: ${text}`);
  }
  return text ? JSON.parse(text) : null;
}

export async function createProductAndPlans(token: string, currency: string) {
  const product = await paypalFetch(token, "/v1/catalogs/products", {
    method: "POST",
    body: JSON.stringify({
      name: "Career Launch Programmes",
      type: "SERVICE",
      category: "EDUCATIONAL_AND_TEXTBOOKS",
    }),
  });

  const plans = [
    {
      key: "apprenticeship",
      name: "Apprenticeship Programme — 12 months",
      price: "97",
      cycles: 12,
    },
    {
      key: "mentorship-6mo",
      name: "Professional Mentorship — 6 months",
      price: "197",
      cycles: 6,
    },
    {
      key: "mentorship-3mo",
      name: "Professional Mentorship — 3 months",
      price: "247",
      cycles: 3,
    },
  ];

  const result: Record<string, string> = { product_id: product.id };

  for (const p of plans) {
    const plan = await paypalFetch(token, "/v1/billing/plans", {
      method: "POST",
      body: JSON.stringify({
        product_id: product.id,
        name: p.name,
        status: "ACTIVE",
        billing_cycles: [
          {
            frequency: { interval_unit: "MONTH", interval_count: 1 },
            tenure_type: "REGULAR",
            sequence: 1,
            total_cycles: p.cycles, // 扣满这么多期自动停
            pricing_scheme: {
              fixed_price: { value: p.price, currency_code: currency },
            },
          },
        ],
        payment_preferences: {
          auto_bill_outstanding: true,
          payment_failure_threshold: 3,
        },
      }),
    });
    result[p.key] = plan.id;
  }
  return result;
}

export async function createSubscription(
  token: string,
  opts: {
    planId: string;
    enrolmentId: string;
    email: string;
    fullName: string;
    returnUrl: string;
    cancelUrl: string;
  },
) {
  const sub = await paypalFetch(token, "/v1/billing/subscriptions", {
    method: "POST",
    body: JSON.stringify({
      plan_id: opts.planId,
      custom_id: opts.enrolmentId,
      subscriber: {
        email_address: opts.email,
        name: { given_name: opts.fullName },
      },
      application_context: {
        brand_name: "Career Launch Platform",
        user_action: "SUBSCRIBE_NOW",
        return_url: opts.returnUrl,
        cancel_url: opts.cancelUrl,
      },
    }),
  });
  const approve = (sub.links as { rel: string; href: string }[]).find(
    (l) => l.rel === "approve",
  );
  return {
    subscriptionId: sub.id as string,
    approveUrl: approve?.href as string,
  };
}
