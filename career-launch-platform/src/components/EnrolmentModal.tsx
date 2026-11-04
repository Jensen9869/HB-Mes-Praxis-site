import React, { useState, useEffect } from 'react';
import { X, Check, ShieldCheck, AlertCircle, Code, ExternalLink, ArrowRight } from 'lucide-react';
import { PROGRAMMES_CONFIG } from '../config/platformConfig';

export interface SelectedPlanState {
  programmeId: string;
  planName: string;
  monthlyPrice: number;
  totalFee: number;
  durationMonths: number;
}

interface EnrolmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPlan: SelectedPlanState | null;
}

export const EnrolmentModal: React.FC<EnrolmentModalProps> = ({
  isOpen,
  onClose,
  initialPlan,
}) => {
  const [selectedPlanId, setSelectedPlanId] = useState<string>('apprenticeship');
  const [selectedTrack, setSelectedTrack] = useState<'swe' | 'hr' | 'undecided'>('swe');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [institution, setInstitution] = useState('');
  const [gradYear, setGradYear] = useState('2026');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showIntegrationSpec, setShowIntegrationSpec] = useState(false);

  // Sync initial plan if passed
  useEffect(() => {
    if (initialPlan) {
      if (initialPlan.programmeId === 'prog-apprenticeship') {
        setSelectedPlanId('apprenticeship');
      } else if (initialPlan.planName.includes('3-Month')) {
        setSelectedPlanId('mentorship-3mo');
      } else {
        setSelectedPlanId('mentorship-6mo');
      }
    }
  }, [initialPlan]);

  if (!isOpen) return null;

  // Plan metadata helper
  const getCurrentPlanDetails = () => {
    if (selectedPlanId === 'apprenticeship') {
      return {
        name: "Apprenticeship Programme",
        monthly: 97,
        months: 12,
        total: 1164,
        commitment: "12-month programme commitment"
      };
    }
    if (selectedPlanId === 'mentorship-3mo') {
      return {
        name: "3-Month Professional Mentorship",
        monthly: 247,
        months: 3,
        total: 741,
        commitment: "3-month quarterly sprint"
      };
    }
    return {
      name: "6-Month Professional Mentorship",
      monthly: 197,
      months: 6,
      total: 1182,
      commitment: "6-month extended mentorship (lower monthly rate)"
    };
  };

  const plan = getCurrentPlanDetails();

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!fullName.trim()) newErrors.fullName = "Please enter your full name";
    if (!email.trim()) {
      newErrors.email = "Please enter your email address";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address (e.g. name@university.edu)";
    }
    if (!institution.trim()) newErrors.institution = "Please specify your university or college";
    if (!acceptedTerms) newErrors.terms = "Please review and accept the transparent commitment terms";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitted(true);
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
        
        {/* Modal Header */}
        <div className="bg-[#102a43] text-white px-6 py-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold tracking-wider text-[#38bdf8] uppercase">
              Application & Enrolment Portal
            </span>
            <h2 id="modal-title" className="text-xl font-bold text-white mt-0.5">
              Begin Your Pathway
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Close enrolment modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[80vh] overflow-y-auto">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Step 1: Confirm Programme Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#102a43] mb-2">
                  1. Select Your Programme & Duration
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  
                  {/* Apprenticeship 12mo */}
                  <button
                    type="button"
                    onClick={() => setSelectedPlanId('apprenticeship')}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedPlanId === 'apprenticeship'
                        ? 'border-[#ea580c] bg-orange-50/50 ring-2 ring-[#ea580c]/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-xs font-bold text-[#ea580c]">Apprenticeship</div>
                    <div className="text-lg font-extrabold text-[#102a43] mt-0.5">$97 <span className="text-xs font-normal text-slate-500">/ mo</span></div>
                    <div className="text-[11px] text-slate-600 mt-1">12 Mo · Total $1,164</div>
                  </button>

                  {/* Mentorship 6mo */}
                  <button
                    type="button"
                    onClick={() => setSelectedPlanId('mentorship-6mo')}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedPlanId === 'mentorship-6mo'
                        ? 'border-[#0284c7] bg-sky-50/50 ring-2 ring-[#0284c7]/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-xs font-bold text-[#0284c7] flex items-center justify-between">
                      <span>Mentorship</span>
                      <span className="text-[10px] bg-sky-100 text-[#0369a1] px-1 rounded">Lower Rate</span>
                    </div>
                    <div className="text-lg font-extrabold text-[#102a43] mt-0.5">$197 <span className="text-xs font-normal text-slate-500">/ mo</span></div>
                    <div className="text-[11px] text-slate-600 mt-1">6 Mo · Total $1,182</div>
                  </button>

                  {/* Mentorship 3mo */}
                  <button
                    type="button"
                    onClick={() => setSelectedPlanId('mentorship-3mo')}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedPlanId === 'mentorship-3mo'
                        ? 'border-[#0284c7] bg-sky-50/50 ring-2 ring-[#0284c7]/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-xs font-bold text-[#0284c7]">Mentorship</div>
                    <div className="text-lg font-extrabold text-[#102a43] mt-0.5">$247 <span className="text-xs font-normal text-slate-500">/ mo</span></div>
                    <div className="text-[11px] text-slate-600 mt-1">3 Mo · Total $741</div>
                  </button>

                </div>
              </div>

              {/* Step 2: Track Preference */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#102a43] mb-2">
                  2. Select Desired Specialisation Track
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedTrack('swe')}
                    className={`py-2.5 px-3 rounded-lg border text-sm font-medium transition-all cursor-pointer ${
                      selectedTrack === 'swe'
                        ? 'border-[#102a43] bg-slate-900 text-white font-semibold'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    Software Engineering
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedTrack('hr')}
                    className={`py-2.5 px-3 rounded-lg border text-sm font-medium transition-all cursor-pointer ${
                      selectedTrack === 'hr'
                        ? 'border-[#102a43] bg-slate-900 text-white font-semibold'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    Human Resources
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedTrack('undecided')}
                    className={`py-2.5 px-3 rounded-lg border text-sm font-medium transition-all cursor-pointer ${
                      selectedTrack === 'undecided'
                        ? 'border-[#102a43] bg-slate-900 text-white font-semibold'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    General / Undecided
                  </button>
                </div>
              </div>

              {/* Step 3: Applicant Details */}
              <div className="space-y-4 pt-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#102a43]">
                  3. Student & Applicant Information
                </label>

                <div>
                  <label htmlFor="modal-name" className="block text-xs font-medium text-slate-700 mb-1">
                    Full Legal Name *
                  </label>
                  <input
                    id="modal-name"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Alex Chen"
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c]"
                  />
                  {errors.fullName && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="modal-email" className="block text-xs font-medium text-slate-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      id="modal-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex@university.edu"
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c]"
                    />
                    {errors.email && (
                      <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="modal-institution" className="block text-xs font-medium text-slate-700 mb-1">
                      University / College / School *
                    </label>
                    <input
                      id="modal-institution"
                      type="text"
                      value={institution}
                      onChange={(e) => setInstitution(e.target.value)}
                      placeholder="e.g. University of Edinburgh"
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c]"
                    />
                    {errors.institution && (
                      <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.institution}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="modal-grad" className="block text-xs font-medium text-slate-700 mb-1">
                    Expected Year of Graduation
                  </label>
                  <select
                    id="modal-grad"
                    value={gradYear}
                    onChange={(e) => setGradYear(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="2025">2025 (Recent Graduate)</option>
                    <option value="2026">2026 (Final Year)</option>
                    <option value="2027">2027 (Penultimate Year)</option>
                    <option value="2028">2028+</option>
                    <option value="Other">Other / Lifelong Learner</option>
                  </select>
                </div>
              </div>

              {/* Transparent Fee & Commitment Disclosure */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-700">Selected Pathway:</span>
                  <span className="font-bold text-[#102a43]">{plan.name}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Monthly Scheduled Rate:</span>
                  <span className="font-semibold text-slate-900">${plan.monthly} / month</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Duration Commitment:</span>
                  <span className="text-slate-900">{plan.months} months</span>
                </div>
                <div className="flex items-center justify-between text-sm pt-2 border-t border-slate-200 font-bold">
                  <span className="text-[#102a43]">Total Scheduled Programme Fee:</span>
                  <span className="text-lg text-[#ea580c] tabular-numbers">${plan.total}</span>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div>
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600 leading-snug">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="mt-0.5 rounded text-[#ea580c] focus:ring-[#ea580c]"
                  />
                  <span>
                    I understand that this programme focuses on practical skill building and portfolio development. I acknowledge the {plan.months}-month commitment of ${plan.monthly}/month (total ${plan.total}) and acknowledge that employment or startup success is not guaranteed.
                  </span>
                </label>
                {errors.terms && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.terms}
                  </p>
                )}
              </div>

              {/* Security & Demonstration Note */}
              <div className="bg-sky-50 border border-sky-100 rounded-lg p-3 flex items-start gap-2 text-xs text-sky-800">
                <ShieldCheck className="w-4 h-4 shrink-0 text-[#0284c7] mt-0.5" />
                <p>
                  <strong>Notice:</strong> This is an interactive application review flow. No live credit card is charged at this time. Live payment webhooks and student portal authentication hook points are wired below.
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="w-full sm:flex-1 py-3 px-6 text-sm font-semibold text-white bg-[#ea580c] hover:bg-[#c2410c] rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Submit Application Review</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setShowIntegrationSpec(!showIntegrationSpec)}
                  className="w-full sm:w-auto py-3 px-4 text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Code className="w-3.5 h-3.5 text-slate-500" />
                  <span>{showIntegrationSpec ? "Hide Developer Spec" : "View Backend & Payment Spec"}</span>
                </button>
              </div>

              {/* Developer / Commercial Integration Spec Drawer */}
              {showIntegrationSpec && (
                <div className="mt-4 p-4 bg-slate-900 text-slate-200 rounded-xl text-xs font-mono space-y-3 overflow-x-auto">
                  <div className="text-amber-400 font-bold flex items-center gap-1.5 font-sans">
                    <span>Developer Integration Contract (Ready for Stripe & CRM)</span>
                  </div>
                  <pre className="text-[11px] leading-relaxed text-slate-300">
{`// Payload prepared for backend endpoint /api/enrolment/create-checkout
{
  "applicant": {
    "name": "${fullName || 'Alex Chen'}",
    "email": "${email || 'alex@university.edu'}",
    "institution": "${institution || 'University of Edinburgh'}",
    "graduationYear": "${gradYear}"
  },
  "programme": {
    "id": "${selectedPlanId}",
    "track": "${selectedTrack}",
    "monthlyPriceUSD": ${plan.monthly},
    "durationMonths": ${plan.months},
    "totalScheduledFeeUSD": ${plan.total}
  },
  "stripeConfig": {
    "billingMode": "subscription",
    "interval": "month",
    "installments": ${plan.months},
    "currency": "usd"
  }
}`}
                  </pre>
                  <p className="font-sans text-[11px] text-slate-400">
                    When live, this payload initiates a Stripe Customer Checkout Session with webhooks configured to dispatch enrolment credentials.
                  </p>
                </div>
              )}

            </form>
          ) : (
            /* Successful Simulation Confirmation State */
            <div className="text-center py-8 space-y-5 animate-in fade-in duration-300">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
                <Check className="w-8 h-8" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-[#102a43]">
                  Application Received for Review
                </h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  Thank you, <strong className="text-slate-900">{fullName}</strong>. Your enrolment interest for the <strong className="text-slate-900">{plan.name}</strong> ({selectedTrack.toUpperCase()} track) has been recorded in the platform pipeline.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left max-w-md mx-auto text-xs space-y-2 text-slate-600">
                <p><strong>Applicant:</strong> {fullName} ({email})</p>
                <p><strong>Institution:</strong> {institution}</p>
                <p><strong>Scheduled Plan:</strong> ${plan.monthly}/mo for {plan.months} months (Total: ${plan.total})</p>
                <p><strong>Status:</strong> Pre-enrolment review queue · Notice of placement within 2 business days.</p>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-2.5 text-sm font-semibold text-white bg-[#102a43] hover:bg-slate-800 rounded-xl transition-colors"
                >
                  Close & Return to Page
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
