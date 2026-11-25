import React, { useState, useEffect } from 'react';
import { Shield } from 'lucide-react';

export const CookieBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has previously set consent
    const consent = localStorage.getItem('career_platform_cookie_consent');
    if (!consent) {
      // Delay showing slightly so it does not pop up aggressively on instant arrival
      const timer = setTimeout(() => setIsVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('career_platform_cookie_consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('career_platform_cookie_consent', 'essential_only');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div 
      role="region" 
      aria-label="Cookie and Privacy Consent"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-40 bg-surface/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200 p-4 sm:p-5 text-xs text-slate-700 animate-in slide-in-from-bottom-5 duration-300"
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-orange-50 text-accent-ink flex items-center justify-center shrink-0 mt-0.5">
          <Shield className="w-4 h-4" />
        </div>
        <div className="space-y-2">
          <p className="font-semibold text-sm text-ink">
            Privacy & Performance Choice
          </p>
          <p className="text-slate-600 leading-relaxed">
            We use essential session tokens and optional performance analytics to understand how students navigate programmes. No tracking scripts run without your consent.
          </p>
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={handleAccept}
              className="py-1.5 px-3 bg-accent hover:bg-accent-hover text-white rounded-lg font-semibold transition-colors cursor-pointer"
            >
              Accept Analytics
            </button>
            <button
              type="button"
              onClick={handleDecline}
              className="py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors cursor-pointer"
            >
              Essential Only
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
