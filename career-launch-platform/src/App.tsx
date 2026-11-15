/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { AnnouncementBar } from "./components/AnnouncementBar";
import { Navbar } from "./components/Navbar";
import { HeroSection } from "./components/HeroSection";
import { ProblemOpportunitySection } from "./components/ProblemOpportunitySection";
import { PathwaysSection } from "./components/PathwaysSection";
import { ComparisonSection } from "./components/ComparisonSection";
import { SkillsSection } from "./components/SkillsSection";
import { HowItWorksSection } from "./components/HowItWorksSection";
import { WhoThisIsForSection } from "./components/WhoThisIsForSection";
import { EmploymentEntrepreneurshipSection } from "./components/EmploymentEntrepreneurshipSection";
import { FaqSection } from "./components/FaqSection";
import { FinalCtaSection } from "./components/FinalCtaSection";
import { FooterSection } from "./components/FooterSection";
import { EnrolmentModal, SelectedPlanState } from "./components/EnrolmentModal";
import { SignInModal } from "./components/SignInModal";
import { PolicyModal } from "./components/PolicyModal";
import { BusinessDecisionsModal } from "./components/BusinessDecisionsModal";
import { CookieBanner } from "./components/CookieBanner";
import { PROGRAMMES_CONFIG } from "./config/platformConfig";
import { PaymentResultModal } from "./components/PaymentResultModal";

export default function App() {
  // Modal states
  const [enrolmentModalOpen, setEnrolmentModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SelectedPlanState | null>(
    null,
  );
  const [signInModalOpen, setSignInModalOpen] = useState(false);
  const [businessDecisionsModalOpen, setBusinessDecisionsModalOpen] =
    useState(false);
  const [policyModal, setPolicyModal] = useState<{
    isOpen: boolean;
    title: string;
    content: string;
  }>({
    isOpen: false,
    title: "",
    content: "",
  });

  const [paymentResult, setPaymentResult] = useState<
    "success" | "cancelled" | null
  >(null);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get("payment");
    if (p === "success" || p === "cancelled") {
      setPaymentResult(p);
      // 把 ?payment=... 从地址栏清掉，刷新不会再弹
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  // Navigation smoothly scroll helper
  const handleNavigateSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Plan trigger handlers
  const handleSelectApprenticeship = () => {
    const appConfig = PROGRAMMES_CONFIG.apprenticeship;
    setSelectedPlan({
      programmeId: appConfig.id,
      planName: "Apprenticeship Programme",
      monthlyPrice: appConfig.monthlyPrice,
      totalFee: appConfig.totalScheduledFee,
      durationMonths: appConfig.durationMonths,
    });
    setEnrolmentModalOpen(true);
  };

  const handleSelectMentorship = (tier: "3mo" | "6mo" = "6mo") => {
    const mentOption =
      tier === "3mo"
        ? PROGRAMMES_CONFIG.mentorship.options[0]
        : PROGRAMMES_CONFIG.mentorship.options[1];

    setSelectedPlan({
      programmeId: PROGRAMMES_CONFIG.mentorship.id,
      planName: mentOption.title,
      monthlyPrice: mentOption.monthlyPrice,
      totalFee: mentOption.totalScheduledFee,
      durationMonths: mentOption.durationMonths,
    });
    setEnrolmentModalOpen(true);
  };

  const handleCustomPlanSelect = (plan: SelectedPlanState) => {
    setSelectedPlan(plan);
    setEnrolmentModalOpen(true);
  };

  const handleOpenPolicy = (title: string, content: string) => {
    setPolicyModal({
      isOpen: true,
      title,
      content,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-[#334155] font-sans selection:bg-[#ea580c]/15 selection:text-[#ea580c]">
      {/* SECTION 1 — Announcement bar */}
      <AnnouncementBar
        onExploreClick={() => handleNavigateSection("programmes")}
      />

      {/* SECTION 2 — Navigation */}
      <Navbar
        onChoosePath={() => handleNavigateSection("programmes")}
        onOpenSignIn={() => setSignInModalOpen(true)}
        onNavigateSection={handleNavigateSection}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* SECTION 3 — Hero section */}
        <HeroSection
          onSelectApprenticeship={handleSelectApprenticeship}
          onSelectMentorship={() => handleSelectMentorship("6mo")}
        />

        {/* SECTION 4 — The problem and opportunity */}
        <ProblemOpportunitySection />

        {/* SECTION 5 — Introduce the two pathways */}
        <PathwaysSection onSelectPlan={handleCustomPlanSelect} />

        {/* SECTION 6 — Compare the programmes */}
        <ComparisonSection onSelectPlan={handleCustomPlanSelect} />

        {/* SECTION 7 — Skills for the real world */}
        <SkillsSection />

        {/* SECTION 8 — How it works */}
        <HowItWorksSection />

        {/* SECTION 9 — Who this is for */}
        <WhoThisIsForSection />

        {/* SECTION 10 — Employment and entrepreneurship */}
        <EmploymentEntrepreneurshipSection />

        {/* SECTION 11 — Frequently asked questions */}
        <FaqSection />

        {/* SECTION 12 — Final call to action */}
        <FinalCtaSection
          onSelectApprenticeship={handleSelectApprenticeship}
          onSelectMentorship={() => handleSelectMentorship("6mo")}
        />
      </main>

      {/* SECTION 13 — Footer */}
      <FooterSection
        onNavigateSection={handleNavigateSection}
        onOpenPolicy={handleOpenPolicy}
        onOpenBusinessDecisions={() => setBusinessDecisionsModalOpen(true)}
      />

      {/* Interactive Enrolment & Review Modal */}
      <EnrolmentModal
        isOpen={enrolmentModalOpen}
        onClose={() => setEnrolmentModalOpen(false)}
        initialPlan={selectedPlan}
      />

      {/* Student & Applicant Portal Login Modal */}
      <SignInModal
        isOpen={signInModalOpen}
        onClose={() => setSignInModalOpen(false)}
      />

      {/* Legal & Terms Policy Modal */}
      <PolicyModal
        isOpen={policyModal.isOpen}
        title={policyModal.title}
        content={policyModal.content}
        onClose={() => setPolicyModal({ ...policyModal, isOpen: false })}
      />

      {/* Business Decisions Governance Checklist Modal (Deliverable Item 7) */}
      <BusinessDecisionsModal
        isOpen={businessDecisionsModalOpen}
        onClose={() => setBusinessDecisionsModalOpen(false)}
      />

      <PaymentResultModal result={paymentResult} onClose={() => setPaymentResult(null)} />

      {/* Consent-Aware Analytics Placeholder */}
      <CookieBanner />
    </div>
  );
}
