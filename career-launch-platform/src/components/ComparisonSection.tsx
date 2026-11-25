import React from 'react';
import { COMPARISON_TABLE, PROGRAMMES_CONFIG } from '../config/platformConfig';
import { ArrowRight, Check } from 'lucide-react';

interface ComparisonSectionProps {
  onSelectPlan: (plan: {
    programmeId: string;
    planName: string;
    monthlyPrice: number;
    totalFee: number;
    durationMonths: number;
  }) => void;
}

export const ComparisonSection: React.FC<ComparisonSectionProps> = ({ onSelectPlan }) => {
  return (
    <section className="py-16 sm:py-24 bg-surface border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
          <p className="text-xs sm:text-sm font-semibold tracking-wider text-accent-ink uppercase mb-2">
            Side-by-Side Evaluation
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-ink tracking-tight mb-4 text-balance">
            Which programme is right for you?
          </h2>
          <p className="text-base text-body leading-relaxed">
            Compare programme structures, fees, and learning goals to choose the right fit for your academic timetable and career ambitions.
          </p>
        </div>

        {/* Desktop Responsive Comparison Table */}
        <div className="hidden lg:block overflow-hidden border border-slate-200 rounded-2xl shadow-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="py-5 px-6 text-sm font-semibold text-slate-700 w-1/4">
                  Feature & Details
                </th>
                <th className="py-5 px-6 text-base font-bold text-ink w-[37.5%] bg-orange-50/40 border-l border-slate-200">
                  <div className="flex items-center justify-between">
                    <span>Apprenticeship Programme</span>
                    <span className="text-xs font-semibold text-accent-ink bg-orange-100 px-2 py-0.5 rounded">
                      12 Months
                    </span>
                  </div>
                </th>
                <th className="py-5 px-6 text-base font-bold text-ink w-[37.5%] bg-sky-50/40 border-l border-slate-200">
                  <div className="flex items-center justify-between">
                    <span>Professional Mentorship</span>
                    <span className="text-xs font-semibold text-sky-ink bg-sky-100 px-2 py-0.5 rounded">
                      3 or 6 Months
                    </span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {COMPARISON_TABLE.map((row, index) => (
                <tr 
                  key={index}
                  className={index % 2 === 0 ? 'bg-surface' : 'bg-slate-50/30'}
                >
                  <td className="py-4 px-6 font-semibold text-slate-800">
                    {row.feature}
                  </td>
                  <td className="py-4 px-6 text-slate-700 leading-relaxed border-l border-slate-200 bg-orange-50/10">
                    {row.apprenticeship}
                  </td>
                  <td className="py-4 px-6 text-slate-700 leading-relaxed border-l border-slate-200 bg-sky-50/10">
                    {row.mentorship}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-50 border-t border-slate-200">
                <td className="py-6 px-6 text-xs text-slate-500 font-medium">
                  Review terms & requirements before enrolling.
                </td>
                <td className="py-6 px-6 border-l border-slate-200 bg-orange-50/30">
                  <button
                    onClick={() =>
                      onSelectPlan({
                        programmeId: PROGRAMMES_CONFIG.apprenticeship.id,
                        planName: "Apprenticeship Programme",
                        monthlyPrice: PROGRAMMES_CONFIG.apprenticeship.monthlyPrice,
                        totalFee: PROGRAMMES_CONFIG.apprenticeship.totalScheduledFee,
                        durationMonths: PROGRAMMES_CONFIG.apprenticeship.durationMonths
                      })
                    }
                    className="w-full py-3 px-4 text-sm font-semibold text-white bg-accent hover:bg-accent-hover rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Start Apprenticeship — $97/mo</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </td>
                <td className="py-6 px-6 border-l border-slate-200 bg-sky-50/30">
                  <button
                    onClick={() =>
                      onSelectPlan({
                        programmeId: PROGRAMMES_CONFIG.mentorship.id,
                        planName: "6-Month Mentorship",
                        monthlyPrice: 197,
                        totalFee: 1182,
                        durationMonths: 6
                      })
                    }
                    className="w-full py-3 px-4 text-sm font-semibold text-white bg-navy-solid hover:bg-navy-solid-hover rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Explore Mentorship — from $197/mo</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Mobile Stacked Comparison Cards */}
        <div className="lg:hidden space-y-6">
          
          {/* Mobile Card: Apprenticeship */}
          <div className="bg-surface rounded-xl border-2 border-orange-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200">
              <h3 className="text-lg font-bold text-ink">Apprenticeship</h3>
              <span className="text-xs font-semibold text-accent-ink bg-orange-100 px-2 py-1 rounded">
                $97/mo (12 Mo)
              </span>
            </div>
            
            <dl className="space-y-3.5 text-xs">
              {COMPARISON_TABLE.map((row, idx) => (
                <div key={idx} className="pb-2 border-b border-slate-100 last:border-none">
                  <dt className="font-semibold text-slate-500 uppercase tracking-wider">{row.feature}</dt>
                  <dd className="font-medium text-slate-800 mt-0.5 text-sm">{row.apprenticeship}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <button
                onClick={() =>
                  onSelectPlan({
                    programmeId: PROGRAMMES_CONFIG.apprenticeship.id,
                    planName: "Apprenticeship Programme",
                    monthlyPrice: PROGRAMMES_CONFIG.apprenticeship.monthlyPrice,
                    totalFee: PROGRAMMES_CONFIG.apprenticeship.totalScheduledFee,
                    durationMonths: PROGRAMMES_CONFIG.apprenticeship.durationMonths
                  })
                }
                className="w-full py-3 px-4 font-semibold text-white bg-accent hover:bg-accent-hover rounded-xl shadow-xs text-sm"
              >
                Start Apprenticeship ($97/mo)
              </button>
            </div>
          </div>

          {/* Mobile Card: Mentorship */}
          <div className="bg-surface rounded-xl border-2 border-sky-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200">
              <h3 className="text-lg font-bold text-ink">Professional Mentorship</h3>
              <span className="text-xs font-semibold text-sky-ink bg-sky-100 px-2 py-1 rounded">
                from $197/mo
              </span>
            </div>
            
            <dl className="space-y-3.5 text-xs">
              {COMPARISON_TABLE.map((row, idx) => (
                <div key={idx} className="pb-2 border-b border-slate-100 last:border-none">
                  <dt className="font-semibold text-slate-500 uppercase tracking-wider">{row.feature}</dt>
                  <dd className="font-medium text-slate-800 mt-0.5 text-sm">{row.mentorship}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <button
                onClick={() =>
                  onSelectPlan({
                    programmeId: PROGRAMMES_CONFIG.mentorship.id,
                    planName: "6-Month Mentorship",
                    monthlyPrice: 197,
                    totalFee: 1182,
                    durationMonths: 6
                  })
                }
                className="w-full py-3 px-4 font-semibold text-white bg-navy-solid hover:bg-navy-solid-hover rounded-xl shadow-xs text-sm"
              >
                Choose Mentorship (from $197/mo)
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
