import React, { useState } from 'react';
import { Check, ArrowRight } from 'lucide-react';
import {
  PROGRAMMES_CONFIG,
  PRICING,
  usd,
  upfrontSaving,
  type Billing,
  type PlanKey,
} from '../config/platformConfig';

interface PathwaysSectionProps {
  onSelectPlan: (plan: {
    programmeId: string;
    planName: string;
    monthlyPrice: number;
    totalFee: number;
    durationMonths: number;
    billing: Billing;
  }) => void;
}

/** Monthly / Pay upfront switch used on both cards. */
const BillingToggle: React.FC<{
  value: Billing;
  onChange: (b: Billing) => void;
  accent: 'orange' | 'sky';
}> = ({ value, onChange, accent }) => {
  const active =
    accent === 'orange'
      ? 'bg-surface text-ink shadow-sm border border-orange-300'
      : 'bg-surface text-ink shadow-sm border border-sky-300';
  return (
    <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-lg text-xs font-semibold mb-4">
      <button
        type="button"
        onClick={() => onChange('monthly')}
        className={`py-2 rounded-md transition-all cursor-pointer ${value === 'monthly' ? active : 'text-slate-600 hover:text-ink'}`}
      >
        Pay monthly
      </button>
      <button
        type="button"
        onClick={() => onChange('upfront')}
        className={`py-2 rounded-md transition-all cursor-pointer ${value === 'upfront' ? active : 'text-slate-600 hover:text-ink'}`}
      >
        Pay upfront &amp; save
      </button>
    </div>
  );
};

/** Price box that switches between monthly and upfront for one plan. */
const PriceBox: React.FC<{ plan: PlanKey; billing: Billing }> = ({ plan, billing }) => {
  const p = PRICING[plan];
  if (billing === 'upfront') {
    return (
      <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-200 mb-6">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-3xl sm:text-4xl font-extrabold text-ink tabular-nums">
            {usd(p.upfront)}
          </span>
          <span className="text-sm font-semibold text-slate-600">one payment</span>
          <span className="ml-auto text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
            {p.upfrontBadge}
          </span>
        </div>
        <p className="text-xs font-medium text-slate-600 mt-1">
          Covers all {p.months} months. You save {usd(upfrontSaving(plan))} compared with{' '}
          {usd(p.total)} paid monthly. Prices in USD.
        </p>
      </div>
    );
  }
  return (
    <div className="bg-slate-50 rounded-xl p-5 border border-slate-200/80 mb-6">
      <div className="flex items-baseline gap-2">
        <span className="text-3xl sm:text-4xl font-extrabold text-ink tabular-nums">
          {usd(p.monthly)}
        </span>
        <span className="text-sm font-semibold text-slate-600">/ month</span>
      </div>
      <p className="text-xs font-medium text-slate-600 mt-1">
        {p.months}-month programme commitment. Total scheduled fees: {usd(p.total)}. Prices in USD.
      </p>
    </div>
  );
};

export const PathwaysSection: React.FC<PathwaysSectionProps> = ({ onSelectPlan }) => {
  const { apprenticeship, mentorship } = PROGRAMMES_CONFIG;
  const [mentorshipTier, setMentorshipTier] = useState<'mentorship-6mo' | 'mentorship-3mo'>('mentorship-6mo');
  const [apprBilling, setApprBilling] = useState<Billing>('monthly');
  const [mentBilling, setMentBilling] = useState<Billing>('monthly');

  const ment = PRICING[mentorshipTier];
  const six = PRICING['mentorship-6mo'];
  const three = PRICING['mentorship-3mo'];

  const select = (plan: PlanKey, programmeId: string, billing: Billing) =>
    onSelectPlan({
      programmeId,
      planName: PRICING[plan].name,
      monthlyPrice: PRICING[plan].monthly,
      totalFee: PRICING[plan].total,
      durationMonths: PRICING[plan].months,
      billing,
    });

  const ctaLabel = (plan: PlanKey, billing: Billing, verb: string) =>
    billing === 'upfront'
      ? `${verb} — ${usd(PRICING[plan].upfront)} upfront`
      : `${verb} — ${usd(PRICING[plan].monthly)}/mo`;

  return (
    <section id="programmes" className="py-16 sm:py-24 bg-soft scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
          <p className="text-xs sm:text-sm font-semibold tracking-wider text-accent-ink uppercase mb-2">
            Two Targeted Pathways
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-ink tracking-tight mb-4 text-balance">
            Choose the path that fits your next move.
          </h2>
          <p className="text-base text-body leading-relaxed">
            Whether you want an immersive 12-month project apprenticeship or direct mentorship to refine your goals and work, our transparently priced programmes give you structured support.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">

          {/* ================= CARD A: APPRENTICESHIP ================= */}
          <div
            id="apprenticeship"
            className="bg-surface rounded-2xl border-2 border-slate-200/90 shadow-sm p-6 sm:p-8 flex flex-col justify-between hover:border-slate-300 transition-all scroll-mt-24"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold tracking-wider text-accent-ink uppercase">
                  {apprenticeship.label}
                </span>
                <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                  12-Month Pathway
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-ink mb-3">
                {apprenticeship.headline}
              </h3>
              <p className="text-sm text-body leading-relaxed mb-6">
                {apprenticeship.description}
              </p>

              <BillingToggle value={apprBilling} onChange={setApprBilling} accent="orange" />
              <PriceBox plan="apprenticeship" billing={apprBilling} />

              <div className="space-y-3 mb-8">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  What is included:
                </p>
                {apprenticeship.benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-orange-100 text-accent-ink flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" aria-hidden="true" />
                    </span>
                    <span className="text-sm text-body leading-snug">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button
                onClick={() => select('apprenticeship', apprenticeship.id, apprBilling)}
                className="w-full py-3.5 px-6 font-semibold text-white bg-accent hover:bg-accent-hover active:bg-accent-active rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>{ctaLabel('apprenticeship', apprBilling, apprenticeship.ctaText)}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </button>
              <p className="text-xs text-center text-slate-500 mt-2.5">
                {apprenticeship.subCtaText}
              </p>
              <p className="text-[11px] text-slate-400 text-center mt-1 italic">
                * {apprenticeship.disclaimer}
              </p>
            </div>
          </div>

          {/* ================= CARD B: MENTORSHIP ================= */}
          <div
            id="mentorship"
            className="bg-surface rounded-2xl border-2 border-sky-200/90 shadow-sm p-6 sm:p-8 flex flex-col justify-between hover:border-sky-300 transition-all relative scroll-mt-24"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold tracking-wider text-sky-ink uppercase">
                  {mentorship.label}
                </span>
                <span className="text-xs font-semibold text-sky-ink-strong bg-sky-50 px-2.5 py-1 rounded-md border border-sky-100">
                  Flexible 3 or 6 Months
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-ink mb-3">
                {mentorship.headline}
              </h3>
              <p className="text-sm text-body leading-relaxed mb-6">
                {mentorship.description}
              </p>

              {/* Duration selector */}
              <div className="mb-4">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                  Select Mentorship Duration:
                </label>
                <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-100 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setMentorshipTier('mentorship-6mo')}
                    className={`relative p-3 rounded-lg text-left transition-all cursor-pointer ${
                      mentorshipTier === 'mentorship-6mo' ? 'bg-surface shadow-sm border border-sky-300' : 'hover:bg-slate-200/60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-bold text-ink">6 Months</span>
                      <span className="text-[10px] font-semibold text-sky-ink bg-sky-50 px-1.5 py-0.5 rounded">
                        Lower monthly rate
                      </span>
                    </div>
                    <div className="text-lg font-extrabold text-ink tabular-nums">
                      {usd(six.monthly)} <span className="text-xs font-normal text-slate-500">/ mo</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Total: {usd(six.total)} · Upfront: {usd(six.upfront)}
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMentorshipTier('mentorship-3mo')}
                    className={`p-3 rounded-lg text-left transition-all cursor-pointer ${
                      mentorshipTier === 'mentorship-3mo' ? 'bg-surface shadow-sm border border-sky-300' : 'hover:bg-slate-200/60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-bold text-ink">3 Months</span>
                    </div>
                    <div className="text-lg font-extrabold text-ink tabular-nums">
                      {usd(three.monthly)} <span className="text-xs font-normal text-slate-500">/ mo</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Total: {usd(three.total)} · Upfront: {usd(three.upfront)}
                    </p>
                  </button>
                </div>
              </div>

              <BillingToggle value={mentBilling} onChange={setMentBilling} accent="sky" />
              <PriceBox plan={mentorshipTier} billing={mentBilling} />

              <div className="space-y-3 mb-8">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  What is included:
                </p>
                {mentorship.benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-ink flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" aria-hidden="true" />
                    </span>
                    <span className="text-sm text-body leading-snug">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button
                onClick={() => select(mentorshipTier, mentorship.id, mentBilling)}
                className="w-full py-3.5 px-6 font-semibold text-white bg-navy-solid hover:bg-navy-solid-hover active:bg-navy-solid-active rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>
                  {ctaLabel(mentorshipTier, mentBilling, `Choose ${ment.months} Months`)}
                </span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </button>
              <p className="text-xs text-center text-slate-500 mt-2.5">
                {mentBilling === 'upfront'
                  ? `One payment of ${usd(ment.upfront)} covers all ${ment.months} months.`
                  : `Total scheduled fee: ${usd(ment.total)} across ${ment.months} months.`}
              </p>
              <p className="text-[11px] text-slate-400 text-center mt-1 italic">
                * {mentorship.disclaimer}
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
