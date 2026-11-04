import React from 'react';
import { CheckCircle2, ArrowRight, Code2, Users, Briefcase } from 'lucide-react';
import { BRAND_CONFIG } from '../config/platformConfig';
import heroImage from '../assets/images/hero_students_collaborating_1792558765828.jpg';

interface HeroSectionProps {
  onSelectApprenticeship: () => void;
  onSelectMentorship: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSelectApprenticeship,
  onSelectMentorship,
}) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-16 lg:pb-24 bg-gradient-to-b from-white via-[#f8fafc] to-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Core Value Proposition & CTAs */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left">
            
            {/* Clean unboxed eyebrow */}
            <p className="text-xs sm:text-sm font-bold tracking-wider text-[#ea580c] uppercase mb-3">
              {BRAND_CONFIG.eyebrow}
            </p>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-extrabold text-[#102a43] tracking-tight leading-[1.15] text-balance mb-6">
              {BRAND_CONFIG.heroHeadline}
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-[#334155] leading-relaxed max-w-2xl mb-8">
              {BRAND_CONFIG.heroSupportingText}
            </p>

            {/* CTA Button Cluster */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-8">
              <button
                onClick={onSelectApprenticeship}
                className="px-6 py-3.5 text-base font-semibold text-white bg-[#ea580c] hover:bg-[#c2410c] active:bg-[#9a3412] rounded-lg shadow-sm hover:shadow transition-all text-center flex items-center justify-center gap-2 group cursor-pointer whitespace-nowrap"
              >
                <span>Explore Apprenticeship — $97/mo</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </button>
              
              <button
                onClick={onSelectMentorship}
                className="px-6 py-3.5 text-base font-semibold text-[#102a43] bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-xs hover:border-slate-400 transition-all text-center cursor-pointer whitespace-nowrap"
              >
                Explore Mentorship
              </button>
            </div>

            {/* Three Concise Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-slate-200/80 text-sm text-[#334155]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#ea580c] shrink-0" aria-hidden="true" />
                <span className="font-medium text-slate-800">Learn by doing.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#ea580c] shrink-0" aria-hidden="true" />
                <span className="font-medium text-slate-800">Build demonstrable skills.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#ea580c] shrink-0" aria-hidden="true" />
                <span className="font-medium text-slate-800">Prepare for work or entrepreneurship.</span>
              </div>
            </div>

          </div>

          {/* Right Column: Authentic Image with 3 Tasteful Feature Overlays */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-white">
              
              <img
                src={heroImage}
                alt="Diverse university students and early-career learners collaborating on a software engineering project around a worktable"
                className="w-full h-auto object-cover aspect-[4/3] block"
                referrerPolicy="no-referrer"
              />

              {/* Scrim for bottom overlay legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#102a43]/50 via-transparent to-transparent pointer-events-none" />

              {/* Three Tasteful Visual Feature Cards (Programme Features, Not Verified Outcomes) */}
              
              {/* Card 1: Practical Projects (Top Right) */}
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-md border border-slate-200/90 flex items-center gap-2.5 transform transition-transform hover:scale-102">
                <div className="w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center text-[#ea580c]">
                  <Code2 className="w-4 h-4" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#102a43] leading-tight">Practical projects</p>
                  <p className="text-[10px] text-slate-500">Curriculum-aligned work</p>
                </div>
              </div>

              {/* Card 2: Mentor Feedback (Bottom Left) */}
              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-md border border-slate-200/90 flex items-center gap-2.5 transform transition-transform hover:scale-102">
                <div className="w-7 h-7 rounded-lg bg-sky-100 flex items-center justify-center text-[#0284c7]">
                  <Users className="w-4 h-4" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#102a43] leading-tight">Mentor feedback</p>
                  <p className="text-[10px] text-slate-500">Structured reviews</p>
                </div>
              </div>

              {/* Card 3: Career-Ready Skills (Bottom Right) */}
              <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-md border border-slate-200/90 flex items-center gap-2.5 transform transition-transform hover:scale-102">
                <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-[#102a43]">
                  <Briefcase className="w-4 h-4" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#102a43] leading-tight">Career-ready skills</p>
                  <p className="text-[10px] text-slate-500">Evidence for your CV</p>
                </div>
              </div>

            </div>

            {/* Quiet caption underneath respecting anti-slop rules */}
            <p className="text-xs text-center text-slate-500 mt-2.5">
              Features represented above correspond to planned programme curriculum components.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};
