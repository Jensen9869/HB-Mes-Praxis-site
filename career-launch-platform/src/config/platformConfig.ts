/**
 * Centralised Platform & Brand Configuration
 * Easily change brand names, pricing, curriculum tracks, and terms here.
 */

export interface PricingPlan {
  id: string;
  name: string;
  programmeType: "apprenticeship" | "mentorship";
  durationMonths: number;
  durationLabel: string;
  monthlyPriceUSD: number;
  totalScheduledFeeUSD: number;
  highlightBadge?: string;
  ctaText: string;
  description: string;
  benefits: string[];
  billingNote: string;
  disclaimer?: string;
}

export type Billing = "monthly" | "upfront";
export type PlanKey = "apprenticeship" | "mentorship-6mo" | "mentorship-3mo";

export const PRICING: Record<
  PlanKey,
  {
    name: string;
    months: number;
    monthly: number;
    total: number; // monthly × months
    upfront: number; // pay-in-full price  ← Alex to confirm rounding
    upfrontBadge: string; // short promo label shown next to the upfront price
  }
> = {
  apprenticeship: {
    name: "Apprenticeship Programme",
    months: 12,
    monthly: 97,
    total: 1164,
    upfront: 970,
    upfrontBadge: "Buy 10 months, get 2 free",
  },
  "mentorship-6mo": {
    name: "6-Month Professional Mentorship",
    months: 6,
    monthly: 197,
    total: 1182,
    upfront: 945.6,
    upfrontBadge: "20% off",
  },
  "mentorship-3mo": {
    name: "3-Month Professional Mentorship",
    months: 3,
    monthly: 247,
    total: 741,
    upfront: 592.8,
    upfrontBadge: "20% off",
  },
};

/** "$1,164" / "$945.60" — no decimals for whole dollars, two otherwise. */
export const usd = (n: number) =>
  "$" +
  n.toLocaleString("en-US", {
    minimumFractionDigits: Number.isInteger(n) ? 0 : 2,
    maximumFractionDigits: 2,
  });

/** Amount saved by paying upfront, e.g. 1164 − 970 = 194. */
export const upfrontSaving = (k: PlanKey) =>
  Math.round((PRICING[k].total - PRICING[k].upfront) * 100) / 100;

export const BRAND_CONFIG = {
  name: "Your Career Launch Platform",
  shortName: "CareerLaunch",
  tagline: "Don't just graduate. Get ready to do the work.",
  supportingTagline:
    "Build practical skills, develop professional confidence, work on meaningful projects and prepare for your next opportunity through structured apprenticeships and expert mentorship.",
  eyebrow: "YOUR NEXT CHAPTER STARTS HERE",
  heroHeadline: "Turn Your Potential Into Practical Skills.",
  heroSupportingText:
    "University gives you knowledge. We help you put it to work. Develop technical skills, build professional confidence and create a portfolio that shows employers—or your future customers—what you can do.",
  colors: {
    primaryTangerine: "#ea580c",
    secondarySkyBlue: "#38bdf8",
    darkNavy: "#102a43",
    white: "#ffffff",
    lightNeutralBg: "#f8fafc",
    bodyText: "#334155",
  },
};

export const ANNOUNCEMENT_CONFIG = {
  text: "Your future deserves more than a qualification. Build the skills to move forward.",
  ctaLabel: "Explore the programmes ↓",
  ctaTargetId: "programmes",
};

export const PROGRAMMES_CONFIG = {
  apprenticeship: {
    id: "prog-apprenticeship",
    label: "BUILD PRACTICAL EXPERIENCE",
    headline: "Learn. Practise. Build.",
    description:
      "A structured 12-month development pathway for students who want to strengthen their practical skills, work through guided projects and build evidence of what they can do.",
    monthlyPrice: PRICING.apprenticeship.monthly,
    durationMonths: PRICING.apprenticeship.months,
    totalScheduledFee: PRICING.apprenticeship.total,
    billingNote: `12-month programme commitment. Total scheduled programme fees: ${usd(PRICING.apprenticeship.total)}.`,
    ctaText: "Start Your Apprenticeship",
    subCtaText:
      "Explore the programme, requirements and terms before enrolling.",
    disclaimer:
      "Programme details, weekly workload, live session schedules, and specific project opportunities are configurable and subject to final programme catalogue confirmation.",
    benefits: [
      "Structured learning and practical assignments.",
      "HR and software engineering pathways.",
      "Project-based skill development.",
      "Professional communication and teamwork.",
      "Portfolio-building opportunities.",
      "Progress tracking and feedback.",
    ],
  },
  mentorship: {
    id: "prog-mentorship",
    label: "GROW WITH GUIDANCE",
    headline: "Get Guidance. Make Progress.",
    description:
      "Develop your skills and professional direction with a structured mentorship pathway focused on your goals, practical challenges and next steps.",
    benefits: [
      "Guided professional development.",
      "Feedback and accountability.",
      "Career and skill-development planning.",
      "Support with practical projects and problem-solving.",
      "Communication and leadership development.",
      "Preparation for employment or entrepreneurship.",
    ],
    disclaimer:
      "Session frequency, mentor availability, and included services are clearly set forth in programme terms. Does not imply unlimited individual sessions or guaranteed mentor match unless verified.",
    options: [
      {
        id: "mentorship-3mo",
        title: PRICING["mentorship-3mo"].name,
        monthlyPrice: PRICING["mentorship-3mo"].monthly,
        durationMonths: PRICING["mentorship-3mo"].months,
        totalScheduledFee: PRICING["mentorship-3mo"].total,
        ctaText: "Choose 3 Months",
        note: "Focused quarterly acceleration",
        isLowerRate: false,
      },
      {
        id: "mentorship-6mo",
        title: PRICING["mentorship-6mo"].name,
        monthlyPrice: PRICING["mentorship-6mo"].monthly,
        durationMonths: PRICING["mentorship-6mo"].months,
        totalScheduledFee: PRICING["mentorship-6mo"].total,
        ctaText: "Choose 6 Months",
        note: "Lower monthly rate",
        isLowerRate: true,
      },
    ],
  },
};

export const COMPARISON_TABLE = [
  {
    feature: "Primary purpose",
    apprenticeship:
      "Structured practical development and extensive portfolio creation",
    mentorship:
      "Targeted professional direction, expert feedback, and ongoing accountability",
  },
  {
    feature: "Duration",
    apprenticeship: "12 months",
    mentorship: "3 months or 6 months",
  },
  {
    feature: "Monthly fee",
    apprenticeship: "$97 / month for 12 months",
    mentorship: "$247 / month (3-mo) or $197 / month (6-mo)",
  },
  {
    feature: "Total if paid monthly",
    apprenticeship: "$1,164",
    mentorship: "$741 (3-mo) or $1,182 (6-mo)",
  },
  {
    feature: "Pay upfront and save",
    apprenticeship: "$970 — buy 10 months, get 2 free",
    mentorship: "$592.80 (3-mo) or $945.60 (6-mo) — 20% off",
  },
  {
    feature: "Learning structure",
    apprenticeship:
      "Project-driven modules with graded milestones and team collaboration",
    mentorship: "Goal-oriented 1-on-1 and small group advisory sprints",
  },
  {
    feature: "Mentorship emphasis",
    apprenticeship:
      "Milestone code / assignment review and progress checkpoints",
    mentorship:
      "Strategic career advice, problem-solving, and personalized roadmap coaching",
  },
  {
    feature: "Practical projects",
    apprenticeship:
      "Comprehensive real-world case builds across the full 12-month curriculum",
    mentorship:
      "Guidance on student's own workplace, academic, or startup projects",
  },
  {
    feature: "Career-development focus",
    apprenticeship:
      "Building tangible work evidence, GitHub/portfolio showcases, and team readiness",
    mentorship:
      "Refining direction, interviewing narrative, and high-impact decision making",
  },
  {
    feature: "Best suited for",
    apprenticeship:
      "Students wanting deep hands-on skills and a substantial demonstrable portfolio",
    mentorship:
      "Students and graduates seeking active guidance, feedback, and career clarity",
  },
  {
    feature: "Weekly commitment",
    apprenticeship: "Estimated 6–10 hours/week (configurable to be confirmed)",
    mentorship: "Estimated 3–5 hours/week (configurable to be confirmed)",
  },
];

export const SKILLS_CONFIG = {
  technical: {
    hr: {
      title: "Human Resources",
      description:
        "Equipping candidates with modern talent operations, candidate sourcing, and workplace compliance skills.",
      items: [
        "Recruitment and candidate screening.",
        "HR operations and onboarding.",
        "People analytics and reporting.",
        "HR systems and process improvement.",
        "Workplace policies and professional documentation.",
      ],
    },
    softwareEngineering: {
      title: "Software Engineering",
      description:
        "Developing production-grade software abilities from modern frontend architecture to cloud-connected databases.",
      items: [
        "Programming and problem-solving.",
        "Front-end and back-end development.",
        "APIs and databases.",
        "Version control and collaborative development.",
        "Testing, debugging and documentation.",
      ],
    },
  },
  professional: [
    "Written and verbal communication.",
    "Teamwork and collaboration.",
    "Critical thinking.",
    "Time management and reliability.",
    "Receiving and applying feedback.",
    "Leadership and initiative.",
    "Customer awareness and commercial thinking.",
    "Entrepreneurial problem-solving.",
  ],
  disclaimer:
    "Available modules, project activities, and tool stacks depend on your selected track and published programme curriculum.",
};

export const HOW_IT_WORKS_STEPS = [
  {
    number: "01",
    title: "Choose your pathway",
    description: "Select Apprenticeship or Mentorship based on your goals.",
  },
  {
    number: "02",
    title: "Set your goals",
    description:
      "Identify the skills you want to develop and the outcomes you want to work towards.",
  },
  {
    number: "03",
    title: "Learn, practise and improve",
    description:
      "Work through structured activities, practical assignments and feedback opportunities.",
  },
  {
    number: "04",
    title: "Build your next step",
    description:
      "Organise your work into a portfolio and use your progress to prepare for relevant opportunities.",
  },
];

export const AUDIENCE_CARDS = [
  {
    id: "university-students",
    title: "University Students",
    description:
      "Gain hands-on project experience to complement theoretical coursework and stand out in graduate job markets.",
  },
  {
    id: "college-students",
    title: "College Students",
    description:
      "Translate applied diploma or associate degree learning into structured real-world technical and business workflows.",
  },
  {
    id: "recent-graduates",
    title: "Recent Graduates",
    description:
      "Bridge the gap between graduation and first employment by building an active portfolio of demonstrable work.",
  },
  {
    id: "aspiring-founders",
    title: "Aspiring Founders",
    description:
      "Develop the practical technical, hiring, and problem-solving competencies needed to launch or contribute to an early venture.",
  },
];

export const FAQS = [
  {
    question: "Am I a good fit to apply?",
    answer:
      "We welcome motivated learners, career-switchers, recent graduates and professionals looking to level up their skills. As long as you bring curiosity, a willingness to learn and a commitment to completing hands-on work, you're encouraged to apply — no prior industry experience is required for our foundational tracks.",
  },
  {
    question:
      "How do I know whether the Apprenticeship or Mentorship track is right for me?",
    answer:
      "The Apprenticeship is a structured, hands-on programme designed to give you real-world project experience, a defined curriculum and portfolio-ready work. Mentorship offers flexible, personalised 1-on-1 guidance tailored to your career goals, current projects or workplace challenges. If you want end-to-end training and structure, choose the Apprenticeship; if you want targeted advice and accountability, choose Mentorship.",
  },
  {
    question: "What's the investment for the Apprenticeship Programme?",
    answer:
      "$97 per month for 12 months ($1,164 in total), or a single upfront payment of $970 — 12 months for the price of 10. All prices are in US dollars.",
  },
  {
    question: "How much does the Mentorship programme cost?",
    answer:
      "3 months at $247 per month ($741 in total) or 6 months at $197 per month ($1,182 in total). Pay upfront and save 20%: $592.80 for 3 months or $945.60 for 6 months. All prices are in US dollars.",
  },
  {
    question:
      "Can I specialise in a specific track, like HR or software engineering?",
    answer:
      "Yes. When you apply you choose your focus area — Human Resources or Software Engineering — or select 'Undecided' and confirm after onboarding. Your projects, resources and mentor pairing are tailored to the path you choose.",
  },
  {
    question: "What do my job prospects look like once I graduate?",
    answer:
      "We cannot guarantee job placement, but the programmes are built to make you competitive in today's hiring market. You graduate with practical project experience, a polished portfolio, resume and interview coaching, and clearer direction on how to position your skills to employers.",
  },
  {
    question:
      "I'm thinking about launching my own startup — will this programme help me prepare?",
    answer:
      "Definitely. Many participants use the programme to build foundational skills, validate ideas and learn operational best practice — whether that's building a minimum viable product in software engineering or setting up compliant people-operations processes in HR.",
  },
  {
    question: "Will I earn a certificate when I finish?",
    answer:
      "Yes. On successfully completing all programme milestones and project requirements you receive an official Certificate of Completion from the Career Launch Platform that you can showcase on your LinkedIn profile and resume.",
  },
  {
    question: "How often can I meet with my mentor — are sessions unlimited?",
    answer:
      "Mentorship includes weekly sessions along with asynchronous messaging support between calls. Live video sessions are scheduled within your plan's allocation to ensure quality time with your mentor; you can always reach out with quick questions as you work.",
  },
  {
    question: "What happens if my plans change?",
    answer:
      "Monthly plans can be stopped at any time and no further instalments are taken; instalments already paid are not refunded. Upfront payments are not refunded once the programme has started. You keep your 14-day statutory cancellation right. Full details are in our Refund and Cancellation Policy linked in the footer.",
  },
  {
    question: "I'm outside the country — can I still join?",
    answer:
      "Yes. The programmes are 100% remote and open to participants worldwide. Sessions are scheduled across flexible time zones and all materials are online. Fees are charged in US dollars; your bank may apply a conversion rate. Participants are responsible for complying with any local study or work regulations.",
  },
  {
    question: "I'm ready to jump in! How do I get started?",
    answer:
      "Click 'Choose Your Path' at the top of the page, pick your programme and track, and fill in the short application form. Once submitted, you complete your first payment to reserve your place and our team reviews your application and reaches out with next steps.",
  },
];

/**
 * Deliverable: Short list of unresolved business decisions
 * that must be confirmed before accepting live payments.
 */
export const UNRESOLVED_BUSINESS_DECISIONS = [
  {
    area: "Legal Entity & Merchant Account",
    decision:
      "Incorporate primary legal entity, establish merchant registration (Stripe/Paddle/Adyen), and define regional VAT/sales-tax obligations.",
  },
  {
    area: "Refund & Cancellation Terms",
    decision:
      "Formulate statutory consumer cancellation windows (e.g., 14-day EU/UK right of withdrawal, pro-rated month termination policy, early exit conditions for 12-month commitments).",
  },
  {
    area: "Live Mentorship Ratios & SLA",
    decision:
      "Confirm exact hours of 1-on-1 contact per month, mentor response SLA (e.g., 24h turn-around for code review), and maximum student-to-mentor allocation.",
  },
  {
    area: "International Payment & Currency Handling",
    decision:
      "Determine whether fees will be billed strictly in USD or localized into GBP, EUR, CAD, AUD, etc., and confirm supported countries and payment rails.",
  },
  {
    area: "Accreditation & Completion Credentials",
    decision:
      "Formalize digital verifiable credential standard (e.g. Open Badges, verifiable cryptographic certificates, partner co-signatures) without misleading university accreditation claims.",
  },
];
