import React, { useState } from "react";
import { X, Headphones, Mail, Copy, Check, ArrowUpRight, ShieldCheck } from "lucide-react";

const SUPPORT_EMAIL = "support@birthdaymessaging.io"; // confirm with Alex

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(SUPPORT_EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked — user can still select the text */
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
    >
      <div className="bg-navy text-white rounded-2xl max-w-lg w-full shadow-2xl border border-white/10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-xl bg-orange-500/15 text-accent-ink flex items-center justify-center">
              <Headphones className="w-6 h-6" aria-hidden="true" />
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
              aria-label="Close contact panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-bold tracking-wider text-accent-ink uppercase">
              Official Communication Channel
            </p>
            <h2 id="contact-modal-title" className="text-2xl font-bold text-white">
              Direct access to our team.
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Reach our dedicated support address with questions about programmes, enrolment or payments. We reply by email.
            </p>
          </div>

          <div className="bg-navy-deep border border-white/10 rounded-xl p-5 space-y-4">
            <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase flex items-center gap-2">
              <Mail className="w-4 h-4 text-accent-ink" aria-hidden="true" />
              Customer Support Email
            </p>
            <p className="text-lg font-bold text-white select-all">{SUPPORT_EMAIL}</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={`mailto:${SUPPORT_EMAIL}?subject=Career%20Launch%20Platform%20enquiry`}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 font-semibold text-white bg-accent hover:bg-accent-hover rounded-lg transition-colors"
              >
                <Mail className="w-4 h-4" aria-hidden="true" />
                Email Our Team
                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </a>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 font-semibold text-white bg-white/5 hover:bg-white/10 border border-white/15 rounded-lg transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" aria-hidden="true" /> : <Copy className="w-4 h-4" aria-hidden="true" />}
                {copied ? "Copied" : "Copy Email"}
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" aria-hidden="true" />
            Official Career Launch Platform customer communication channel.
          </div>
        </div>
      </div>
    </div>
  );
};