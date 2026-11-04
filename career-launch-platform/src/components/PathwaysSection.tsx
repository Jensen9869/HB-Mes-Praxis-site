import React, { useState } from 'react';
import { Check, ArrowRight, Sparkles, HelpCircle } from 'lucide-react';
import { PROGRAMMES_CONFIG } from '../config/platformConfig';

interface PathwaysSectionProps {
  onSelectPlan: (plan: {
    programmeId: string;
    planName: string;
    monthlyPrice: number;
    totalFee: number;
    durationMonths: number;
  }) => void;
}

export const PathwaysSection: React.FC<PathwaysSectionProps> = ({ onSelectPlan }) => {
  const { apprenticeship, mentorship } = PROGRAMMES_CONFIG;
  const [mentorshipTier, setMentorshipTier] = useState<'6mo' | '3mo'>('6mo');

  const selectedMentorshipOption = mentorship.options.find(
    (opt) => (mentorshipTier === '6mo' ? opt.id === 'mentorship-6mo' : opt.id === 'mentorship-3mo')
  ) || mentorship.options[1];

  return (
    <section id="programmes" className="py-16 sm:py-24 bg-[#f8fafc] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
          <p className="text-xs sm:text-sm font-semibold tracking-wider text-[#ea580c] uppercase mb-2">
            Two Targeted Pathways
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#102a43] tracking-tight mb-4 text-balance">
            Choose the path that fits your next move.
          </h2>
          <p className="text-base text-[#334155] leading-relaxed">
            Whether you want an immersive 12-month project apprenticeship or direct mentorship to refine your goals and work, our transparently priced programmes give you structured support.
          </p>
        </div>

        {/* Two Pathway Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* ================= CARD A: APPRENTICESHIP PROGRAMME ================= */}
          <div 
            id="apprenticeship"
            className="bg-white rounded-2xl border-2 border-slate-200/90 shadow-sm p-6 sm:p-8 flex flex-col justify-between hover:border-slate-300 transition-all scroll-mt-24"
          >
            <div>
              {/* Top Label & Headline */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold tracking-wider text-[#ea580c] uppercase">
                  {apprenticeship.label}
                </span>
                <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                  12-Month Pathway
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#102a43] mb-3">
                {apprenticeship.headline}
              </h3>
              <p className="text-sm text-[#334155] leading-relaxed mb-6">
                {apprenticeship.description}
              </p>

              {/* Price Box */}
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200/80 mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-extrabold text-[#102a43] tabular-numbers">
                    ${apprenticeship.monthlyPrice}
                  </span>
                  <span className="text-sm font-semibold text-slate-600">/ month</span>
                </div>
                <p className="text-xs font-medium text-slate-600 mt-1">
                  {apprenticeship.billingNote}
                </p>
              </div>

              {/* Benefits List */}
              <div className="space-y-3 mb-8">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  What is included:
                </p>
                {apprenticeship.benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-orange-100 text-[#ea580c] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" aria-hidden="true" />
                    </span>
                    <span className="text-sm text-[#334155] leading-snug">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA & Configurable Note */}
            <div className="pt-4 border-t border-slate-100">
              <button
                onClick={() =>
                  onSelectPlan({
                    programmeId: apprenticeship.id,
                    planName: "Apprenticeship Programme",
                    monthlyPrice: apprenticeship.monthlyPrice,
                    totalFee: apprenticeship.totalScheduledFee,
                    durationMonths: apprenticeship.durationMonths
                  })
                }
                className="w-full py-3.5 px-6 font-semibold text-white bg-[#ea580c] hover:bg-[#c2410c] active:bg-[#9a3412] rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>{apprenticeship.ctaText}</span>
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

          {/* ================= CARD B: PROFESSIONAL MENTORSHIP ================= */}
          <div 
            id="mentorship"
            className="bg-white rounded-2xl border-2 border-sky-200/90 shadow-sm p-6 sm:p-8 flex flex-col justify-between hover:border-sky-300 transition-all relative scroll-mt-24"
          >
            <div>
              {/* Top Label & Headline */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold tracking-wider text-[#0284c7] uppercase">
                  {mentorship.label}
                </span>
                <span className="text-xs font-semibold text-[#0369a1] bg-sky-50 px-2.5 py-1 rounded-md border border-sky-100">
                  Flexible 3 or 6 Months
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#102a43] mb-3">
                {mentorship.headline}
              </h3>
              <p className="text-sm text-[#334155] leading-relaxed mb-6">
                {mentorship.description}
              </p>

              {/* Mentorship Duration Selector & Pricing Options */}
              <div className="mb-6">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                  Select Mentorship Duration:
                </label>
                <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-100 rounded-xl">
                  {/* Option 2: 6 Months (Highlighted as lower monthly rate) */}
                  <button
                    type="button"
                    onClick={() => setMentorshipTier('6mo')}
                    className={`relative p-3 rounded-lg text-left transition-all cursor-pointer ${
                      mentorshipTier === '6mo'
                        ? 'bg-white shadow-sm border border-sky-300'
                        : 'hover:bg-slate-200/60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-bold text-[#102a43]">6 Months</span>
                      <span className="text-[10px] font-semibold text-[#0284c7] bg-sky-50 px-1.5 py-0.5 rounded">
                        Lower monthly rate
                      </span>
                    </div>
                    <div className="text-lg font-extrabold text-[#102a43] tabular-numbers">
                      $197 <span className="text-xs font-normal text-slate-500">/ mo</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Total: $1,182
                    </p>
                  </button>

                  {/* Option 1: 3 Months */}
                  <button
                    type="button"
                    onClick={() => setMentorshipTier('3mo')}
                    className={`p-3 rounded-lg text-left transition-all cursor-pointer ${
                      mentorshipTier === '3mo'
                        ? 'bg-white shadow-sm border border-sky-300'
                        : 'hover:bg-slate-200/60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-bold text-[#102a43]">3 Months</span>
                    </div>
                    <div className="text-lg font-extrabold text-[#102a43] tabular-numbers">
                      $247 <span className="text-xs font-normal text-slate-500">/ mo</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Total: $741
                    </p>
                  </button>
                </div>
              </div>

              {/* Benefits List */}
              <div className="space-y-3 mb-8">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  What is included:
                </p>
                {mentorship.benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-sky-100 text-[#0284c7] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" aria-hidden="true" />
                    </span>
                    <span className="text-sm text-[#334155] leading-snug">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA & Selected Option Confirmation */}
            <div className="pt-4 border-t border-slate-100">
              <button
                onClick={() =>
                  onSelectPlan({
                    programmeId: mentorship.id,
                    planName: selectedMentorshipOption.title,
                    monthlyPrice: selectedMentorshipOption.monthlyPrice,
                    totalFee: selectedMentorshipOption.totalScheduledFee,
                    durationMonths: selectedMentorshipOption.durationMonths
                  })
                }
                className="w-full py-3.5 px-6 font-semibold text-white bg-[#102a43] hover:bg-[#1a365d] active:bg-[#0c1f33] rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>{selectedMentorshipOption.ctaText} — ${selectedMentorshipOption.monthlyPrice}/mo</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </button>
              <p className="text-xs text-center text-slate-500 mt-2.5">
                Total scheduled fee: ${selectedMentorshipOption.totalScheduledFee} across {selectedMentorshipOption.durationMonths} months.
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
