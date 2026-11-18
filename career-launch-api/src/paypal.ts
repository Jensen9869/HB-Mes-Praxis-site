// PayPal REST helpers.
// `base` comes from env.PAYPAL_BASE:
//   sandbox: https://api-m.sandbox.paypal.com   (.dev.vars, local dev)
//   live:    https://api-m.paypal.com           (wrangler.jsonc, production)

export async function paypalToken(
  base: string,
  clientId: string,
  secret: string,
) {
  const res = await fetch(`${base}/v1/oauth2/token`, {
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
  base: string,
  token: string,
  path: string,
  init: RequestInit = {},
) {
  const res = await fetch(`${base}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(`PayPal ${res.status} ${path}: ${text}`);
  }
  return text ? JSON.parse(text) : null;
}

// One-off: creates the Product and the three Plans in whichever
// environment `base` points at. Run once per environment, then
// copy the returned P-… ids into wrangler.jsonc.
export async function createProductAndPlans(
  base: string,
  token: string,
  currency: string,
) {
  const product = await paypalFetch(base, token, "/v1/catalogs/products", {
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
    const plan = await paypalFetch(base, token, "/v1/billing/plans", {
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
            total_cycles: p.cycles, // stops automatically after this many charges
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
  base: string,
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
  const sub = await paypalFetch(base, token, "/v1/billing/subscriptions", {
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

export async function cancelSubscription(
  base: string,
  token: string,
  subscriptionId: string,
  reason = "Cancelled by Career Launch admin",
) {
  await paypalFetch(
    base,
    token,
    `/v1/billing/subscriptions/${subscriptionId}/cancel`,
    {
      method: "POST",
      body: JSON.stringify({ reason }),
    },
  );
}

export async function verifyWebhook(
  base: string,
  token: string,
  webhookId: string,
  headers: Headers,
  rawBody: string,
) {
  const result = await paypalFetch(
    base,
    token,
    "/v1/notifications/verify-webhook-signature",
    {
      method: "POST",
      body: JSON.stringify({
        auth_algo: headers.get("paypal-auth-algo"),
        cert_url: headers.get("paypal-cert-url"),
        transmission_id: headers.get("paypal-transmission-id"),
        transmission_sig: headers.get("paypal-transmission-sig"),
        transmission_time: headers.get("paypal-transmission-time"),
        webhook_id: webhookId,
        webhook_event: JSON.parse(rawBody),
      }),
    },
  );
  return result.verification_status === "SUCCESS";
}