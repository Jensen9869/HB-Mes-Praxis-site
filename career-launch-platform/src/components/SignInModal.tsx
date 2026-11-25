import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, LogIn, Mail, CheckCircle2, AlertCircle } from "lucide-react";
import { api } from "../lib/api";
import { useWaitForSignIn } from "../lib/useWaitForSignIn";

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SignInModal: React.FC<SignInModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);
  const navigate = useNavigate();

  // Once the magic link is clicked (in any tab), this tab moves to the portal.
  const goToPortal = useCallback(() => {
    onClose();
    navigate("/portal");
  }, [navigate, onClose]);
  useWaitForSignIn(isOpen && isSent, goToPortal);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please provide a valid registered email address");
      return;
    }
    setError("");
    setIsSending(true);
    try {
      await api("/api/auth/magic-link", { method: "POST", json: { email } });
      setIsSent(true);
    } catch {
      setError("Could not send the link. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="signin-modal-title"
    >
      <div className="bg-surface rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-navy text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LogIn className="w-5 h-5 text-[#38bdf8]" />
            <h2 id="signin-modal-title" className="text-lg font-bold">Student &amp; Applicant Portal</h2>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10" aria-label="Close Sign In modal">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {!isSent ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-sm text-slate-600 leading-relaxed">
                Enter the email you applied with and we'll send you a one-time sign-in link.
              </p>
              <div>
                <label htmlFor="signin-email" className="block text-xs font-semibold text-slate-700 mb-1">Enrolled Email Address</label>
                <div className="relative">
                  <input
                    id="signin-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@university.edu"
                    className="w-full pl-9 pr-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:border-accent focus:ring-1 focus:ring-accent"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
                {error && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{error}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={isSending}
                className="w-full py-2.5 px-4 font-semibold text-white bg-accent hover:bg-accent-hover rounded-lg transition-colors text-sm shadow-xs cursor-pointer disabled:opacity-60"
              >
                {isSending ? "Sending…" : "Send Secure Magic Login Link"}
              </button>
            </form>
          ) : (
            <div className="text-center py-4 space-y-3">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-ink">Check your email</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                If <strong>{email}</strong> has an enrolment with us, a one-time sign-in link is on its way. Click it and this page will take you to your portal automatically.
              </p>
              <p className="text-xs text-slate-400 animate-pulse">Waiting for you to click the link…</p>
              <button type="button" onClick={onClose} className="mt-2 px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg">
                Close Window
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
