import React from 'react';
import { HOW_IT_WORKS_STEPS } from '../config/platformConfig';
import { Compass, Target, Hammer, BriefcaseBusiness } from 'lucide-react';

const STEP_ICONS = [Compass, Target, Hammer, BriefcaseBusiness];

export const HowItWorksSection: React.FC = () => {
  return (
    <section id="how-it-works" className="py-16 sm:py-24 bg-white border-y border-slate-200/80 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
          <p className="text-xs sm:text-sm font-semibold tracking-wider text-[#ea580c] uppercase mb-2">
            The Journey
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#102a43] tracking-tight mb-4 text-balance">
            A clear path from ambition to action.
          </h2>
          <p className="text-base text-[#334155] leading-relaxed">
            Our step-by-step framework takes you from classroom theory to proven capability with clarity and dedicated structure.
          </p>
        </div>

        {/* Four Numbered Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 relative">
          
          {HOW_IT_WORKS_STEPS.map((step, index) => {
            const IconComponent = STEP_ICONS[index] || Compass;

            return (
              <div 
                key={step.number}
                className="bg-[#f8fafc] rounded-2xl p-6 sm:p-7 border border-slate-200/80 hover:border-slate-300 transition-all flex flex-col justify-between relative group"
              >
                <div>
                  {/* Step Top Bar: Editorial Number & Icon */}
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-2xl font-black text-[#102a43] font-mono tabular-nums">
                      {step.number}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/80 text-[#ea580c] flex items-center justify-center shadow-2xs group-hover:bg-[#ea580c] group-hover:text-white transition-colors">
                      <IconComponent className="w-5 h-5" aria-hidden="true" />
                    </div>
                  </div>

                  {/* Step Title & Description */}
                  <h3 className="text-lg font-bold text-[#102a43] mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-[#334155] leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Subtitle indicator */}
                <div className="pt-4 mt-6 border-t border-slate-200/60 text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                  Step {index + 1} of 4
                </div>
              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
};
