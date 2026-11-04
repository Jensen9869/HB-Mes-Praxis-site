# Your Career Launch Platform – Student Apprenticeship & Mentorship Landing Page

A high-converting, mobile-first, conversion-focused landing page for an international edtech platform helping university and college students develop technical, professional, and entrepreneurial skills through structured apprenticeships and expert mentorship.

---

## 1. Quick Start & Local Development

This application is built with **React 19**, **TypeScript**, **Tailwind CSS v4**, and **Vite**.

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build for production
npm run build
```

---

## 2. Brand Direction & Palette

The platform adheres to clean, anti-slop visual hierarchy, zero-pill metadata discipline, and high-contrast typography.

- **Primary Deep Tangerine**: `#ea580c` (Primary CTAs, key accent highlights)
- **Secondary Sky Blue**: `#38bdf8` (Supporting highlights, feature indicators)
- **Dark Navy**: `#102a43` (Hero headings, navigation, contrast banner)
- **Light Neutral Background**: `#f8fafc`
- **Body Text**: `#334155`

---

## 3. How to Customise Brand Name & Copy

All brand names, taglines, hero copy, and metadata are centralized in `src/config/platformConfig.ts`:

```typescript
export const BRAND_CONFIG = {
  name: "Your Career Launch Platform", // Change to your confirmed brand name here
  shortName: "CareerLaunch",
  tagline: "Don't just graduate. Get ready to do the work.",
  // ...
};
```

When you update `name` in `BRAND_CONFIG`, also update:
1. `/metadata.json` (`"name": "..."`)
2. `/index.html` (`<title>`, `<meta property="og:title">`, Schema.org name)

---

## 4. How to Edit Programme Pricing & Duration

The landing page features two primary launch pathways with exact, transparent pricing:

1. **Apprenticeship Programme**: $97 / month for 12 months (Total: $1,164)
2. **Professional Mentorship Programme**:
   - 3-Month Option: $247 / month (Total: $741)
   - 6-Month Option: $197 / month (Total: $1,182) — highlighted as the lower monthly rate

To change rates, billing intervals, or total scheduled commitments, modify `PROGRAMMES_CONFIG` in `src/config/platformConfig.ts`:

```typescript
export const PROGRAMMES_CONFIG = {
  apprenticeship: {
    monthlyPrice: 97,
    durationMonths: 12,
    totalScheduledFee: 1164,
    // ...
  },
  mentorship: {
    options: [
      { id: "mentorship-3mo", monthlyPrice: 247, durationMonths: 3, totalScheduledFee: 741 },
      { id: "mentorship-6mo", monthlyPrice: 197, durationMonths: 6, totalScheduledFee: 1182 }
    ]
  }
};
```
The comparison table (`COMPARISON_TABLE`), modal calculations, and FAQ automatically reflect the centralized values.

---

## 5. How to Connect a Backend (Payments, Auth, CRM)

The application includes an **Enrolment & Review Modal** with a dedicated **Backend & Payment Spec** viewer that exposes clean integration payloads.

### A. Stripe Billing Integration
To convert the simulated checkout into live Stripe billing:
1. In your backend API (e.g. Node/Express, Cloud Functions, or Next.js API route):
   ```typescript
   // POST /api/enrolment/create-checkout-session
   const session = await stripe.checkout.sessions.create({
     customer_email: req.body.applicant.email,
     payment_method_types: ['card'],
     mode: 'subscription',
     line_items: [{
       price_data: {
         currency: 'usd',
         product_data: { name: req.body.programme.name },
         unit_amount: req.body.programme.monthlyPriceUSD * 100,
         recurring: { interval: 'month' },
       },
       quantity: 1,
     }],
     metadata: {
       programmeId: req.body.programme.id,
       track: req.body.programme.track,
       institution: req.body.applicant.institution,
     },
     success_url: `${APP_URL}/enrolment/success?session_id={CHECKOUT_SESSION_ID}`,
     cancel_url: `${APP_URL}/enrolment/cancelled`,
   });
   ```
2. Set up a Stripe webhook listener for `checkout.session.completed` and `customer.subscription.deleted` to grant or revoke portal access.

### B. Student Identity & LMS Authentication
- The navigation "Sign In" button opens the `SignInModal` component.
- Connect this to Firebase Auth, Supabase Auth, or Auth0 passwordless magic links (`sendSignInLinkToEmail`).

---

## 6. Unresolved Business Decisions (Before Accepting Live Payments)

Before collecting live credit cards from students, the following operational and legal matters must be formally confirmed:

1. **Legal Entity & Merchant Account**: Formalize corporate registration and regional tax compliance (sales tax / VAT handling via Stripe Tax or Merchant of Record like Paddle).
2. **Refund & Cancellation Policy**: Establish statutory consumer cancellation terms (e.g. EU 14-day cooling-off period, pro-rated monthly termination rules, early exit terms for the 12-month commitment).
3. **Mentorship SLA & Delivery Ratio**: Finalize the exact monthly 1-on-1 hours, mentor review response turnaround (e.g. 24–48 hours for code/HR milestone reviews), and student-to-mentor allocation caps.
4. **International Currency & Localisation**: Determine whether fees will remain USD-denominated or dynamically convert to GBP, EUR, CAD, AUD, etc.
5. **Verifiable Completion Records**: Define digital credential standards (e.g., Open Badges, verifiable cryptographic certificates) without misleading university accreditation claims.

These decisions can also be reviewed in-app via the **"Launch Checklist & Terms"** link in the platform footer.
