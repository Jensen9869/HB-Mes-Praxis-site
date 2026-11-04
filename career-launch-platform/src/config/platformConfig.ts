/**
 * Centralised Platform & Brand Configuration
 * Easily change brand names, pricing, curriculum tracks, and terms here.
 */

export interface PricingPlan {
  id: string;
  name: string;
  programmeType: 'apprenticeship' | 'mentorship';
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

export const BRAND_CONFIG = {
  name: "Your Career Launch Platform",
  shortName: "CareerLaunch",
  tagline: "Don't just graduate. Get ready to do the work.",
  supportingTagline: "Build practical skills, develop professional confidence, work on meaningful projects and prepare for your next opportunity through structured apprenticeships and expert mentorship.",
  eyebrow: "YOUR NEXT CHAPTER STARTS HERE",
  heroHeadline: "Turn Your Potential Into Practical Skills.",
  heroSupportingText: "University gives you knowledge. We help you put it to work. Develop technical skills, build professional confidence and create a portfolio that shows employers—or your future customers—what you can do.",
  colors: {
    primaryTangerine: "#ea580c",
    secondarySkyBlue: "#38bdf8",
    darkNavy: "#102a43",
    white: "#ffffff",
    lightNeutralBg: "#f8fafc",
    bodyText: "#334155"
  }
};

export const ANNOUNCEMENT_CONFIG = {
  text: "Your future deserves more than a qualification. Build the skills to move forward.",
  ctaLabel: "Explore the programmes ↓",
  ctaTargetId: "programmes"
};

export const PROGRAMMES_CONFIG = {
  apprenticeship: {
    id: "prog-apprenticeship",
    label: "BUILD PRACTICAL EXPERIENCE",
    headline: "Learn. Practise. Build.",
    description: "A structured 12-month development pathway for students who want to strengthen their practical skills, work through guided projects and build evidence of what they can do.",
    monthlyPrice: 97,
    durationMonths: 12,
    totalScheduledFee: 1164,
    billingNote: "12-month programme commitment. Total scheduled programme fees: $1,164.",
    ctaText: "Start Your Apprenticeship",
    subCtaText: "Explore the programme, requirements and terms before enrolling.",
    disclaimer: "Programme details, weekly workload, live session schedules, and specific project opportunities are configurable and subject to final programme catalogue confirmation.",
    benefits: [
      "Structured learning and practical assignments.",
      "HR and software engineering pathways.",
      "Project-based skill development.",
      "Professional communication and teamwork.",
      "Portfolio-building opportunities.",
      "Progress tracking and feedback."
    ]
  },
  mentorship: {
    id: "prog-mentorship",
    label: "GROW WITH GUIDANCE",
    headline: "Get Guidance. Make Progress.",
    description: "Develop your skills and professional direction with a structured mentorship pathway focused on your goals, practical challenges and next steps.",
    benefits: [
      "Guided professional development.",
      "Feedback and accountability.",
      "Career and skill-development planning.",
      "Support with practical projects and problem-solving.",
      "Communication and leadership development.",
      "Preparation for employment or entrepreneurship."
    ],
    disclaimer: "Session frequency, mentor availability, and included services are clearly set forth in programme terms. Does not imply unlimited individual sessions or guaranteed mentor match unless verified.",
    options: [
      {
        id: "mentorship-3mo",
        title: "3-Month Mentorship",
        monthlyPrice: 247,
        durationMonths: 3,
        totalScheduledFee: 741,
        ctaText: "Choose 3 Months",
        note: "Focused quarterly acceleration",
        isLowerRate: false
      },
      {
        id: "mentorship-6mo",
        title: "6-Month Mentorship",
        monthlyPrice: 197,
        durationMonths: 6,
        totalScheduledFee: 1182,
        ctaText: "Choose 6 Months",
        note: "Lower monthly rate",
        isLowerRate: true
      }
    ]
  }
};

export const COMPARISON_TABLE = [
  {
    feature: "Primary purpose",
    apprenticeship: "Structured practical development and extensive portfolio creation",
    mentorship: "Targeted professional direction, expert feedback, and ongoing accountability"
  },
  {
    feature: "Duration",
    apprenticeship: "12 months",
    mentorship: "3 months or 6 months"
  },
  {
    feature: "Monthly fee",
    apprenticeship: "$97 / month",
    mentorship: "$247 / month (3-mo) or $197 / month (6-mo)"
  },
  {
    feature: "Total scheduled fee",
    apprenticeship: "$1,164",
    mentorship: "$741 (3-mo) or $1,182 (6-mo)"
  },
  {
    feature: "Learning structure",
    apprenticeship: "Project-driven modules with graded milestones and team collaboration",
    mentorship: "Goal-oriented 1-on-1 and small group advisory sprints"
  },
  {
    feature: "Mentorship emphasis",
    apprenticeship: "Milestone code / assignment review and progress checkpoints",
    mentorship: "Strategic career advice, problem-solving, and personalized roadmap coaching"
  },
  {
    feature: "Practical projects",
    apprenticeship: "Comprehensive real-world case builds across the full 12-month curriculum",
    mentorship: "Guidance on student's own workplace, academic, or startup projects"
  },
  {
    feature: "Career-development focus",
    apprenticeship: "Building tangible work evidence, GitHub/portfolio showcases, and team readiness",
    mentorship: "Refining direction, interviewing narrative, and high-impact decision making"
  },
  {
    feature: "Best suited for",
    apprenticeship: "Students wanting deep hands-on skills and a substantial demonstrable portfolio",
    mentorship: "Students and graduates seeking active guidance, feedback, and career clarity"
  },
  {
    feature: "Weekly commitment",
    apprenticeship: "Estimated 6–10 hours/week (configurable to be confirmed)",
    mentorship: "Estimated 3–5 hours/week (configurable to be confirmed)"
  }
];

export const SKILLS_CONFIG = {
  technical: {
    hr: {
      title: "Human Resources",
      description: "Equipping candidates with modern talent operations, candidate sourcing, and workplace compliance skills.",
      items: [
        "Recruitment and candidate screening.",
        "HR operations and onboarding.",
        "People analytics and reporting.",
        "HR systems and process improvement.",
        "Workplace policies and professional documentation."
      ]
    },
    softwareEngineering: {
      title: "Software Engineering",
      description: "Developing production-grade software abilities from modern frontend architecture to cloud-connected databases.",
      items: [
        "Programming and problem-solving.",
        "Front-end and back-end development.",
        "APIs and databases.",
        "Version control and collaborative development.",
        "Testing, debugging and documentation."
      ]
    }
  },
  professional: [
    "Written and verbal communication.",
    "Teamwork and collaboration.",
    "Critical thinking.",
    "Time management and reliability.",
    "Receiving and applying feedback.",
    "Leadership and initiative.",
    "Customer awareness and commercial thinking.",
    "Entrepreneurial problem-solving."
  ],
  disclaimer: "Available modules, project activities, and tool stacks depend on your selected track and published programme curriculum."
};

export const HOW_IT_WORKS_STEPS = [
  {
    number: "01",
    title: "Choose your pathway",
    description: "Select Apprenticeship or Mentorship based on your goals."
  },
  {
    number: "02",
    title: "Set your goals",
    description: "Identify the skills you want to develop and the outcomes you want to work towards."
  },
  {
    number: "03",
    title: "Learn, practise and improve",
    description: "Work through structured activities, practical assignments and feedback opportunities."
  },
  {
    number: "04",
    title: "Build your next step",
    description: "Organise your work into a portfolio and use your progress to prepare for relevant opportunities."
  }
];

export const AUDIENCE_CARDS = [
  {
    id: "university-students",
    title: "University Students",
    description: "Gain hands-on project experience to complement theoretical coursework and stand out in graduate job markets."
  },
  {
    id: "college-students",
    title: "College Students",
    description: "Translate applied diploma or associate degree learning into structured real-world technical and business workflows."
  },
  {
    id: "recent-graduates",
    title: "Recent Graduates",
    description: "Bridge the gap between graduation and first employment by building an active portfolio of demonstrable work."
  },
  {
    id: "aspiring-founders",
    title: "Aspiring Founders",
    description: "Develop the practical technical, hiring, and problem-solving competencies needed to launch or contribute to an early venture."
  }
];

export const FAQS = [
  {
    question: "Who can apply?",
    answer: "University students, college students and recent graduates who want to develop practical and professional skills. Final eligibility requirements will be published with each programme."
  },
  {
    question: "What is the difference between Apprenticeship and Mentorship?",
    answer: "Apprenticeship is the longer-term structured pathway focused on practical development. Mentorship is a guided programme focused on feedback, direction, skill development and accountability."
  },
  {
    question: "How much does the Apprenticeship Programme cost?",
    answer: "The programme costs $97 per month for 12 months, for total scheduled fees of $1,164."
  },
  {
    question: "How much does Mentorship cost?",
    answer: "Choose 3 months at $247 per month, totalling $741, or 6 months at $197 per month, totalling $1,182."
  },
  {
    question: "Can I choose HR or software engineering?",
    answer: "Yes. HR and software engineering are the two planned launch pathways. Display availability accurately based on the published programme catalogue."
  },
  {
    question: "Will I get a job after completing the programme?",
    answer: "The programme is designed to help you develop skills and prepare for opportunities. Employment depends on your capabilities, market conditions and employer requirements. A job is not guaranteed."
  },
  {
    question: "Can I use the programme to prepare for a startup?",
    answer: "Yes. Professional skills, practical projects, customer awareness and entrepreneurial thinking can help you prepare to contribute to or develop a startup."
  },
  {
    question: "Will I receive a certificate?",
    answer: "Display the actual completion-record or certificate policy once confirmed. Do not claim accreditation or professional certification unless formally established."
  },
  {
    question: "Are mentorship sessions unlimited?",
    answer: "Session frequency, mentor availability and included services will be clearly stated in the applicable programme terms."
  },
  {
    question: "What is the refund or cancellation policy?",
    answer: "Link to the published terms before payment. Do not invent a refund policy."
  },
  {
    question: "Can international students enrol?",
    answer: "The platform is designed for a global audience. Availability of paid enrolment, payment methods and programme terms will depend on supported locations."
  },
  {
    question: "How do I get started?",
    answer: "Choose your programme, review the requirements and terms, and complete the application or enrolment process."
  }
];

/**
 * Deliverable: Short list of unresolved business decisions
 * that must be confirmed before accepting live payments.
 */
export const UNRESOLVED_BUSINESS_DECISIONS = [
  {
    area: "Legal Entity & Merchant Account",
    decision: "Incorporate primary legal entity, establish merchant registration (Stripe/Paddle/Adyen), and define regional VAT/sales-tax obligations."
  },
  {
    area: "Refund & Cancellation Terms",
    decision: "Formulate statutory consumer cancellation windows (e.g., 14-day EU/UK right of withdrawal, pro-rated month termination policy, early exit conditions for 12-month commitments)."
  },
  {
    area: "Live Mentorship Ratios & SLA",
    decision: "Confirm exact hours of 1-on-1 contact per month, mentor response SLA (e.g., 24h turn-around for code review), and maximum student-to-mentor allocation."
  },
  {
    area: "International Payment & Currency Handling",
    decision: "Determine whether fees will be billed strictly in USD or localized into GBP, EUR, CAD, AUD, etc., and confirm supported countries and payment rails."
  },
  {
    area: "Accreditation & Completion Credentials",
    decision: "Formalize digital verifiable credential standard (e.g. Open Badges, verifiable cryptographic certificates, partner co-signatures) without misleading university accreditation claims."
  }
];
