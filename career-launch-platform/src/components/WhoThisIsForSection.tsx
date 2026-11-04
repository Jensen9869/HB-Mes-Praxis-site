import React from 'react';
import { AUDIENCE_CARDS } from '../config/platformConfig';
import { GraduationCap, School, Sparkles, Rocket, Info } from 'lucide-react';

const AUDIENCE_ICONS: Record<string, React.FC<{ className?: string }>> = {
  'university-students': GraduationCap,
  'college-students': School,
  'recent-graduates': Sparkles,
  'aspiring-founders': Rocket,
};

export const WhoThisIsForSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
          <p className="text-xs sm:text-sm font-semibold tracking-wider text-[#ea580c] uppercase mb-2">
            Target Audience
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#102a43] tracking-tight mb-4 text-balance">
            Built for people ready to take the next step.
          </h2>
          <p className="text-base text-[#334155] leading-relaxed">
            Whether you are currently in school, recently graduated, or gearing up to launch a project, our programmes meet you where you are.
          </p>
        </div>

        {/* 4 Audience Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {AUDIENCE_CARDS.map((item) => {
            const Icon = AUDIENCE_ICONS[item.id] || GraduationCap;

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs hover:shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#ea580c] flex items-center justify-center mb-5">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-[#102a43] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#334155] leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <span>Structured pathway</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Gentle Qualification Notice */}
        <div className="mt-10 max-w-2xl mx-auto bg-white rounded-xl p-4 border border-slate-200/90 flex items-start gap-3">
          <Info className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-xs text-slate-600 leading-relaxed">
            <strong className="font-semibold text-slate-800">Please note: </strong>
            Your progress depends on your participation, practice and the requirements of your selected programme.
          </p>
        </div>

      </div>
    </section>
  );
};
