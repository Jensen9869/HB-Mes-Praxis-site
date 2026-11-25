import React, { useState } from 'react';
import { SKILLS_CONFIG } from '../config/platformConfig';
import { Terminal, Users2, CheckCircle2, Award, Sparkles, BookOpen } from 'lucide-react';

export const SkillsSection: React.FC = () => {
  const [activeTechnicalTrack, setActiveTechnicalTrack] = useState<'swe' | 'hr'>('swe');

  const { technical, professional, disclaimer } = SKILLS_CONFIG;

  return (
    <section id="skills" className="py-16 sm:py-24 bg-soft scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
          <p className="text-xs sm:text-sm font-semibold tracking-wider text-accent-ink uppercase mb-2">
            Curriculum Architecture
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-ink tracking-tight mb-4 text-balance">
            Build the skills that travel with you.
          </h2>
          <p className="text-base text-body leading-relaxed">
            Gain hard craft competencies in your discipline paired with the essential professional and collaborative habits employers value across every industry.
          </p>
        </div>

        {/* Two-Column Grid: Technical Skills vs Professional Skills */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          
          {/* Column 1: Technical Skills */}
          <div className="bg-surface rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-accent-ink flex items-center justify-center">
                  <Terminal className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-ink">Technical Skills</h3>
                  <p className="text-xs text-slate-500">Discipline-specific pathways</p>
                </div>
              </div>
            </div>

            {/* Interactive Track Switcher */}
            <div className="flex items-center p-1 bg-slate-100 rounded-lg mb-6 text-xs sm:text-sm font-medium">
              <button
                type="button"
                onClick={() => setActiveTechnicalTrack('swe')}
                className={`flex-1 py-2 px-3 rounded-md transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTechnicalTrack === 'swe'
                    ? 'bg-surface text-ink shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-ink'
                }`}
              >
                <Terminal className="w-4 h-4 text-accent-ink" />
                <span>Software Engineering</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTechnicalTrack('hr')}
                className={`flex-1 py-2 px-3 rounded-md transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTechnicalTrack === 'hr'
                    ? 'bg-surface text-ink shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-ink'
                }`}
              >
                <Users2 className="w-4 h-4 text-sky-ink" />
                <span>Human Resources</span>
              </button>
            </div>

            {/* Track Content: Software Engineering */}
            {activeTechnicalTrack === 'swe' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  {technical.softwareEngineering.description}
                </p>
                <div className="space-y-2.5">
                  {technical.softwareEngineering.items.map((skill, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                      <CheckCircle2 className="w-4 h-4 text-accent-ink shrink-0 mt-0.5" />
                      <span className="text-sm font-medium text-slate-800">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Track Content: Human Resources */}
            {activeTechnicalTrack === 'hr' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  {technical.hr.description}
                </p>
                <div className="space-y-2.5">
                  {technical.hr.items.map((skill, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                      <CheckCircle2 className="w-4 h-4 text-sky-ink shrink-0 mt-0.5" />
                      <span className="text-sm font-medium text-slate-800">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Column 2: Professional Skills */}
          <div className="bg-surface rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-ink flex items-center justify-center">
                  <Award className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-ink">Professional Skills</h3>
                  <p className="text-xs text-slate-500">Universal workplace competencies</p>
                </div>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              Transversal strengths that distinguish dependable colleagues, effective communicators, and proactive team members.
            </p>

            <div className="space-y-2.5">
              {professional.map((skill, idx) => (
                <div key={idx} className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-sky-ink shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-slate-800">{skill}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Curriculum Disclaimer Note */}
        <div className="mt-8 text-center">
          <p className="text-xs text-slate-500 max-w-2xl mx-auto italic">
            * {disclaimer}
          </p>
        </div>

      </div>
    </section>
  );
};
