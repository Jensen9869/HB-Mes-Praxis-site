import React from "react";
import { Compass } from "lucide-react";
import { BRAND_CONFIG } from "../config/platformConfig";

interface FooterSectionProps {
  onNavigateSection: (sectionId: string) => void;
  onOpenContact: () => void;
}

export const FooterSection: React.FC<FooterSectionProps> = ({
  onNavigateSection,
  onOpenContact,
}) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#102a43] text-slate-300 border-t border-white/10 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-white/10">
          {/* Col 1 & 2: Brand wordmark & short description */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5 text-white">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#38bdf8] to-[#ea580c] flex items-center justify-center text-white shadow-xs">
                <Compass className="w-4 h-4 text-white" aria-hidden="true" />
              </span>
              <span className="font-bold text-lg text-white tracking-tight">
                {BRAND_CONFIG.name}
              </span>
            </div>

            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Equipping ambitious university and college students with practical
              skills, mentor feedback, and tangible project portfolios to
              prepare for employment or entrepreneurship.
            </p>
          </div>

          {/* Col 3: Pathways & Curriculum */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-[#38bdf8]">
              Programmes
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigateSection("apprenticeship")}
                  className="hover:text-white transition-colors text-left"
                >
                  Apprenticeship ($97/mo)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection("mentorship")}
                  className="hover:text-white transition-colors text-left"
                >
                  Mentorship (3 or 6 Mo)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection("skills")}
                  className="hover:text-white transition-colors text-left"
                >
                  HR Pathway
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection("skills")}
                  className="hover:text-white transition-colors text-left"
                >
                  Software Engineering Pathway
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-[#38bdf8]">
              Platform
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigateSection("how-it-works")}
                  className="hover:text-white transition-colors text-left"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection("faq")}
                  className="hover:text-white transition-colors text-left"
                >
                  FAQ
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenContact}
                  className="hover:text-white transition-colors text-left"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Governance & Policies */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-[#38bdf8]">
              Terms & Policies
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/legal/privacy.html"
                  target="_blank"
                  rel="noopener"
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/legal/terms.html"
                  target="_blank"
                  rel="noopener"
                  className="hover:text-white transition-colors"
                >
                  Terms and Conditions
                </a>
              </li>
              <li>
                <a
                  href="/legal/refunds.html"
                  target="_blank"
                  rel="noopener"
                  className="hover:text-white transition-colors"
                >
                  Refund &amp; Cancellation Policy
                </a>
              </li>
              <li>
                <a
                  href="/legal/accessibility.html"
                  target="_blank"
                  rel="noopener"
                  className="hover:text-white transition-colors"
                >
                  Accessibility Statement
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright notice with dynamic year */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            © {currentYear} {BRAND_CONFIG.name}. All rights reserved.
          </p>
          <p className="text-slate-500 text-center sm:text-right">
            Transparent pricing in USD: Apprenticeship from $97/mo or $970
            upfront · Mentorship from $197/mo.
          </p>
        </div>
      </div>
    </footer>
  );
};
