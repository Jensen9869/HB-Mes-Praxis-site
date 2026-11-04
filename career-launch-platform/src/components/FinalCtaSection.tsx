import React from 'react';
import { ArrowRight, Compass } from 'lucide-react';
import { BRAND_CONFIG, PROGRAMMES_CONFIG } from '../config/platformConfig';

interface FinalCtaSectionProps {
  onSelectApprenticeship: () => void;
  onSelectMentorship: () => void;
}

export const FinalCtaSection: React.FC<FinalCtaSectionProps> = ({
  onSelectApprenticeship,
  onSelectMentorship,
}) => {
  return (
    <section className="py-20 sm:py-28 bg-white relative overflow-hidden">
      {/* Subtle Sky Blue & Tangerine background ambient tints */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#38bdf8]/10 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#ea580c]/8 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        
        {/* Simple Brand Emblem */}
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#102a43] to-[#ea580c] text-white flex items-center justify-center mx-auto mb-6 shadow-sm">
          <Compass className="w-6 h-6" aria-hidden="true" />
        </div>

        {/* Section Headline */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#102a43] tracking-tight mb-4 text-balance">
          Your future is worth building.
        </h2>

        {/* Supporting text */}
        <p className="text-base sm:text-lg text-[#334155] max-w-2xl mx-auto mb-8 leading-relaxed">
          Start developing the skills, experience and confidence to take your next step.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
          <button
            onClick={onSelectApprenticeship}
            className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-white bg-[#ea580c] hover:bg-[#c2410c] active:bg-[#9a3412] rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>Start Your Apprenticeship — $97/mo</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </button>
          
          <button
            onClick={onSelectMentorship}
            className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-[#102a43] bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-2xs hover:border-slate-400 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Explore Mentorship</span>
          </button>
        </div>

        {/* Concise Disclosure Note */}
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Review programme details, duration, total fees and terms before enrolling.
        </p>

      </div>
    </section>
  );
};
