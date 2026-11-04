import React from 'react';
import { X, CheckSquare2, AlertTriangle, ShieldCheck, HelpCircle } from 'lucide-react';
import { UNRESOLVED_BUSINESS_DECISIONS } from '../config/platformConfig';

interface BusinessDecisionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BusinessDecisionsModal: React.FC<BusinessDecisionsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="business-decisions-title"
    >
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
        
        {/* Header */}
        <div className="bg-[#102a43] text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <div>
              <span className="text-xs font-semibold tracking-wider text-amber-300 uppercase">
                Pre-Launch Commercial Governance
              </span>
              <h2 id="business-decisions-title" className="text-lg font-bold text-white">
                Unresolved Business Decisions Before Live Payments
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-5 max-h-[75vh] overflow-y-auto">
          <p className="text-sm text-slate-600 leading-relaxed">
            As mandated by conversion and compliance standards, the landing page accurately communicates pricing ($97/mo apprenticeship; $247/mo for 3mo or $197/mo for 6mo mentorship) without making fabricated partner or outcome claims. The following commercial decisions must be formally ratified before enabling real-time credit card charges:
          </p>

          <div className="space-y-4">
            {UNRESOLVED_BUSINESS_DECISIONS.map((item, idx) => (
              <div 
                key={idx}
                className="p-4 rounded-xl border border-amber-200/80 bg-amber-50/40 text-slate-800 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#102a43] flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-amber-200/80 text-amber-900 flex items-center justify-center text-[10px] font-mono">
                      {idx + 1}
                    </span>
                    {item.area}
                  </span>
                  <span className="text-[10px] font-semibold bg-amber-100 text-amber-800 px-2 py-0.5 rounded uppercase">
                    Pending Ratification
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed pl-6.5">
                  {item.decision}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-600 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p>
              Once these decisions are ratified, update <code className="bg-slate-200 px-1 py-0.5 rounded font-mono">src/config/platformConfig.ts</code> and configure your live Stripe webhook keys in <code className="bg-slate-200 px-1 py-0.5 rounded font-mono">.env</code>.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 text-right">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-[#102a43] hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            Acknowledge & Close
          </button>
        </div>

      </div>
    </div>
  );
};
