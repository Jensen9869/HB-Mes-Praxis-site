import React from "react";
import { X, Check, AlertCircle } from "lucide-react";

interface Props {
  result: "success" | "cancelled" | null;
  onClose: () => void;
}

export const PaymentResultModal: React.FC<Props> = ({ result, onClose }) => {
  if (!result) return null;
  const ok = result === "success";

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-[#102a43] text-white px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">
            {ok ? "Payment received" : "Payment cancelled"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 text-center space-y-4">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto ${ok ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"}`}
          >
            {ok ? (
              <Check className="w-7 h-7" />
            ) : (
              <AlertCircle className="w-7 h-7" />
            )}
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            {ok
              ? "Thank you! Your first instalment has been received and your place is being confirmed. A confirmation email is on its way."
              : "No payment was taken. Your application is saved — you can complete payment any time using the link in your email."}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-semibold text-white bg-[#ea580c] hover:bg-[#c2410c] rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
