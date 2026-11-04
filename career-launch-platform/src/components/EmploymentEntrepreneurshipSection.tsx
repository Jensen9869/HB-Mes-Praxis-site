import React from 'react';
import { Briefcase, Lightbulb, CheckCircle2, ShieldAlert } from 'lucide-react';

export const EmploymentEntrepreneurshipSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-[#102a43] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
          <p className="text-xs sm:text-sm font-semibold tracking-wider text-[#38bdf8] uppercase mb-2">
            Future Horizons
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight mb-4 text-balance">
            Prepare for a career. Or start building your own.
          </h2>
          <p className="text-base text-slate-300 leading-relaxed">
            Whether your next move is a first job, a new professional direction, freelance work or a startup idea, practical skills and the ability to demonstrate your work can help you take more informed steps.
          </p>
        </div>

        {/* Two Paths Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-stretch">
          
          {/* Path 1: EMPLOYMENT */}
          <div className="bg-slate-800/60 rounded-2xl p-6 sm:p-8 border border-white/10 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#38bdf8]/10 text-[#38bdf8] flex items-center justify-center mb-6">
                <Briefcase className="w-6 h-6" aria-hidden="true" />
              </div>
              
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                Employment
              </h3>
              <p className="text-sm text-slate-300 mb-6">
                Equip yourself with practical execution capabilities to stand out to hiring managers and cross-functional teams.
              </p>

              <div className="space-y-3.5">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#38bdf8] shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-200">Develop role-relevant skills.</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#38bdf8] shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-200">Build practical work samples.</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#38bdf8] shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-200">Practise professional communication.</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#38bdf8] shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-200">Prepare to discuss your abilities with employers.</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-white/10 text-xs text-slate-400">
              Focus on workplace readiness, GitHub/portfolio showcases, and team collaboration.
            </div>
          </div>

          {/* Path 2: ENTREPRENEURSHIP */}
          <div className="bg-slate-800/60 rounded-2xl p-6 sm:p-8 border border-white/10 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-[#ea580c] flex items-center justify-center mb-6">
                <Lightbulb className="w-6 h-6" aria-hidden="true" />
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                Entrepreneurship
              </h3>
              <p className="text-sm text-slate-300 mb-6">
                Cultivate the builder mentality, product intuition, and resourcefulness needed to launch ideas from zero.
              </p>

              <div className="space-y-3.5">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#38bdf8] shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-200">Identify problems worth solving.</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#38bdf8] shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-200">Practise customer-focused thinking.</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#38bdf8] shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-200">Develop and test ideas.</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#38bdf8] shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-200">Build the skills to contribute to an early-stage venture.</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-white/10 text-xs text-slate-400">
              Focus on agile iteration, customer discovery, and MVP creation.
            </div>
          </div>

        </div>

        {/* Clear Legal Disclaimer as Mandated */}
        <div className="mt-12 bg-white/5 border border-white/10 rounded-xl p-4 sm:p-5 flex items-start gap-3 max-w-3xl mx-auto">
          <ShieldAlert className="w-5 h-5 text-[#38bdf8] shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            <strong className="text-white font-semibold">Important Transparency Notice: </strong>
            Our programmes support practical preparation and skill development but do not guarantee employment, job placements, business success, customer acquisition, or specific income levels.
          </p>
        </div>

      </div>
    </section>
  );
};
