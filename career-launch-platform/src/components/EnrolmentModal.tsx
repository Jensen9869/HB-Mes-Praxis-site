import React, { useState, useEffect } from "react";
import { X, Check, AlertCircle, ArrowRight } from "lucide-react";
import {
  PRICING,
  usd,
  upfrontSaving,
  type Billing,
  type PlanKey,
} from "../config/platformConfig";

export interface SelectedPlanState {
  programmeId: string;
  planName: string;
  monthlyPrice: number;
  totalFee: number;
  durationMonths: number;
  billing?: Billing;
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
  const [selectedPlanId, setSelectedPlanId] =
    useState<PlanKey>("apprenticeship");
  const [billing, setBilling] = useState<Billing>("monthly");
  const [selectedTrack, setSelectedTrack] = useState<
    "swe" | "hr" | "undecided"
  >("swe");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [institution, setInstitution] = useState("");
  const [gradYear, setGradYear] = useState(String(new Date().getFullYear()));
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [payUrl, setPayUrl] = useState("");

  // Sync plan + billing from whichever button opened the modal
  useEffect(() => {
    if (!initialPlan) return;
    if (initialPlan.programmeId === "prog-apprenticeship") {
      setSelectedPlanId("apprenticeship");
    } else if (initialPlan.planName.includes("3-Month")) {
      setSelectedPlanId("mentorship-3mo");
    } else {
      setSelectedPlanId("mentorship-6mo");
    }
    setBilling(initialPlan.billing ?? "monthly");
  }, [initialPlan]);

  if (!isOpen) return null;

  const plan = PRICING[selectedPlanId];
  const isUpfront = billing === "upfront";

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!fullName.trim()) newErrors.fullName = "Please enter your full name";
    if (!email.trim()) {
      newErrors.email = "Please enter your email address";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email =
        "Please enter a valid email address (e.g. name@university.edu)";
    }
    if (!institution.trim())
      newErrors.institution = "Please specify your university or college";
    if (!acceptedTerms)
      newErrors.terms = "Please review and accept the commitment terms";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/enrolment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          institution,
          graduationYear: gradYear === "Other" ? null : Number(gradYear),
          programme: selectedPlanId,
          track: selectedTrack,
          billing,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Request failed (${res.status})`);
      }
      const data = await res.json();
      setAlreadyApplied(Boolean(data.existing));
      setPayUrl(data.payUrl ?? "");
      setIsSubmitted(true);
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Something went wrong, please try again",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    onClose();
  };

  const planButton = (
    key: PlanKey,
    color: "orange" | "sky",
    badge?: string,
  ) => {
    const p = PRICING[key];
    const active =
      color === "orange"
        ? "border-[#ea580c] bg-orange-50/50 ring-2 ring-[#ea580c]/20"
        : "border-[#0284c7] bg-sky-50/50 ring-2 ring-[#0284c7]/20";
    const label = color === "orange" ? "text-[#ea580c]" : "text-[#0284c7]";
    return (
      <button
        type="button"
        onClick={() => setSelectedPlanId(key)}
        className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
          selectedPlanId === key
            ? active
            : "border-slate-200 hover:border-slate-300"
        }`}
      >
        <div
          className={`text-xs font-bold ${label} flex items-center justify-between`}
        >
          <span>
            {key === "apprenticeship" ? "Apprenticeship" : "Mentorship"}
          </span>
          {badge && (
            <span className="text-[10px] bg-sky-100 text-[#0369a1] px-1 rounded">
              {badge}
            </span>
          )}
        </div>
        <div className="text-lg font-extrabold text-[#102a43] mt-0.5">
          {usd(p.monthly)}{" "}
          <span className="text-xs font-normal text-slate-500">/ mo</span>
        </div>
        <div className="text-[11px] text-slate-600 mt-1">
          {p.months} Mo · Total {usd(p.total)}
        </div>
      </button>
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
        {/* Header */}
        <div className="bg-[#102a43] text-white px-6 py-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold tracking-wider text-[#38bdf8] uppercase">
              Application &amp; Enrolment Portal
            </span>
            <h2
              id="modal-title"
              className="text-xl font-bold text-white mt-0.5"
            >
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

        {/* Body */}
        <div className="p-6 sm:p-8 max-h-[80vh] overflow-y-auto">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Programme */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#102a43] mb-2">
                  1. Select Your Programme &amp; Duration
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {planButton("apprenticeship", "orange")}
                  {planButton("mentorship-6mo", "sky", "Lower Rate")}
                  {planButton("mentorship-3mo", "sky")}
                </div>
              </div>

              {/* Step 2: Payment plan */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#102a43] mb-2">
                  2. Choose How You Pay
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setBilling("monthly")}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      !isUpfront
                        ? "border-[#102a43] bg-slate-50 ring-2 ring-[#102a43]/15"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="text-xs font-bold text-[#102a43]">
                      Pay monthly
                    </div>
                    <div className="text-lg font-extrabold text-[#102a43] mt-0.5">
                      {usd(plan.monthly)}{" "}
                      <span className="text-xs font-normal text-slate-500">
                        / mo × {plan.months}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600 mt-1">
                      {usd(plan.total)} in total · stops automatically after{" "}
                      {plan.months} payments
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBilling("upfront")}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isUpfront
                        ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500/20"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="text-xs font-bold text-emerald-700 flex items-center justify-between">
                      <span>Pay upfront</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1 rounded">
                        {plan.upfrontBadge}
                      </span>
                    </div>
                    <div className="text-lg font-extrabold text-[#102a43] mt-0.5">
                      {usd(plan.upfront)}{" "}
                      <span className="text-xs font-normal text-slate-500">
                        once
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600 mt-1">
                      Save {usd(upfrontSaving(selectedPlanId))} · covers all{" "}
                      {plan.months} months
                    </div>
                  </button>
                </div>
              </div>

              {/* Step 3: Track */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#102a43] mb-2">
                  3. Select Desired Specialisation Track
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {(
                    [
                      ["swe", "Software Engineering"],
                      ["hr", "Human Resources"],
                      ["undecided", "General / Undecided"],
                    ] as const
                  ).map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedTrack(key)}
                      className={`py-2.5 px-3 rounded-lg border text-sm font-medium transition-all cursor-pointer ${
                        selectedTrack === key
                          ? "border-[#102a43] bg-slate-900 text-white font-semibold"
                          : "border-slate-200 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 4: Details */}
              <div className="space-y-4 pt-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#102a43]">
                  4. Student &amp; Applicant Information
                </label>

                <div>
                  <label
                    htmlFor="modal-name"
                    className="block text-xs font-medium text-slate-700 mb-1"
                  >
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
                    <label
                      htmlFor="modal-email"
                      className="block text-xs font-medium text-slate-700 mb-1"
                    >
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
                    <label
                      htmlFor="modal-institution"
                      className="block text-xs font-medium text-slate-700 mb-1"
                    >
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
                  <label
                    htmlFor="modal-grad"
                    className="block text-xs font-medium text-slate-700 mb-1"
                  >
                    Expected Year of Graduation
                  </label>
                  <select
                    id="modal-grad"
                    value={gradYear}
                    onChange={(e) => setGradYear(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg bg-white"
                  >
                    {[0, 1, 2, 3].map((i) => {
                      const y = new Date().getFullYear() + i;
                      return (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      );
                    })}
                    <option value="Other">Other / Lifelong Learner</option>
                  </select>
                </div>
              </div>

              {/* Fee summary */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-700">
                    Selected Pathway:
                  </span>
                  <span className="font-bold text-[#102a43]">{plan.name}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Payment plan:</span>
                  <span className="text-slate-900">
                    {isUpfront
                      ? "One upfront payment"
                      : `${plan.months} monthly instalments`}
                  </span>
                </div>
                {!isUpfront && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">
                      Monthly Scheduled Rate:
                    </span>
                    <span className="font-semibold text-slate-900">
                      {usd(plan.monthly)} / month
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Duration Commitment:</span>
                  <span className="text-slate-900">{plan.months} months</span>
                </div>
                <div className="flex items-center justify-between text-sm pt-2 border-t border-slate-200 font-bold">
                  <span className="text-[#102a43]">
                    Total Programme Fee (USD):
                  </span>
                  <span className="text-lg text-[#ea580c] tabular-nums">
                    {usd(isUpfront ? plan.upfront : plan.total)}
                    {isUpfront && (
                      <span className="ml-2 text-xs font-normal text-slate-400 line-through">
                        {usd(plan.total)}
                      </span>
                    )}
                  </span>
                </div>
              </div>

              {/* Terms */}
              <div>
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600 leading-snug">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="mt-0.5 rounded text-[#ea580c] focus:ring-[#ea580c]"
                  />
                  <span>
                    I understand that this programme focuses on practical skill
                    building and portfolio development. I acknowledge the{" "}
                    {isUpfront
                      ? `one-off payment of ${usd(plan.upfront)} for the ${plan.months}-month programme`
                      : `${plan.months}-month commitment of ${usd(plan.monthly)}/month (total ${usd(plan.total)})`}
                    , charged in US dollars, and that employment or startup
                    success is not guaranteed. I have read the{" "}
                    <a
                      href="/legal/terms.html"
                      target="_blank"
                      rel="noopener"
                      className="underline text-[#ea580c]"
                    >
                      Terms
                    </a>{" "}
                    and{" "}
                    <a
                      href="/legal/refunds.html"
                      target="_blank"
                      rel="noopener"
                      className="underline text-[#ea580c]"
                    >
                      Refund Policy
                    </a>
                    .
                  </span>
                </label>
                {errors.terms && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.terms}
                  </p>
                )}
              </div>

              {submitError && (
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {submitError}
                </p>
              )}

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:flex-1 py-3 px-6 text-sm font-semibold text-white bg-[#ea580c] hover:bg-[#c2410c] rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  <span>
                    {isSubmitting
                      ? "Submitting..."
                      : "Submit Application Review"}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          ) : (
            /* Confirmation */
            <div className="text-center py-8 space-y-5 animate-in fade-in duration-300">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
                <Check className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-[#102a43]">
                  {alreadyApplied
                    ? "We already have your application"
                    : "Application Received for Review"}
                </h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  {alreadyApplied ? (
                    <>
                      Your earlier application for the{" "}
                      <strong className="text-slate-900">{plan.name}</strong> is
                      still waiting for payment. We've also resent the payment
                      link to{" "}
                      <strong className="text-slate-900">{email}</strong>.
                    </>
                  ) : (
                    <>
                      Thanks,{" "}
                      <strong className="text-slate-900">{fullName}</strong>. To
                      secure your place in the{" "}
                      <strong className="text-slate-900">{plan.name}</strong>,
                      complete your {isUpfront ? "payment" : "first instalment"}{" "}
                      below. We've also emailed this link to{" "}
                      <strong className="text-slate-900">{email}</strong>.
                    </>
                  )}
                </p>

                {payUrl && (
                  <a
                    href={payUrl}
                    className="inline-flex items-center justify-center gap-2 px-8 py-3.5 font-semibold text-white bg-[#ea580c] hover:bg-[#c2410c] rounded-xl shadow-sm transition-colors"
                  >
                    {isUpfront
                      ? `Pay ${usd(plan.upfront)} with PayPal`
                      : `Pay now with PayPal — ${usd(plan.monthly)}/mo`}
                    <ArrowRight className="w-4 h-4" />
                  </a>
                )}
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left max-w-md mx-auto text-xs space-y-2 text-slate-600">
                <p>
                  <strong>Applicant:</strong> {fullName} ({email})
                </p>
                <p>
                  <strong>Institution:</strong> {institution}
                </p>
                <p>
                  <strong>Plan:</strong>{" "}
                  {isUpfront
                    ? `${usd(plan.upfront)} upfront for ${plan.months} months`
                    : `${usd(plan.monthly)}/mo for ${plan.months} months (Total: ${usd(plan.total)})`}
                </p>
                <p>
                  <strong>Status:</strong> Awaiting{" "}
                  {isUpfront ? "payment" : "first payment"} · your place is
                  confirmed once payment clears.
                </p>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-2.5 text-sm font-semibold text-white bg-[#102a43] hover:bg-slate-800 rounded-xl transition-colors"
                >
                  Close &amp; Return to Page
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
