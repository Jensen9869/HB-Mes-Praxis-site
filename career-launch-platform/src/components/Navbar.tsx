import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  ArrowUpRight,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import { BRAND_CONFIG } from "../config/platformConfig";
import { useSession } from "../lib/useSession";
import { ThemeToggle } from "./ThemeToggle";
import { Logo } from "./Logo";

interface NavbarProps {
  onChoosePath: () => void;
  onOpenSignIn: () => void;
  onNavigateSection: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onChoosePath,
  onOpenSignIn,
  onNavigateSection,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { signedIn, signOut } = useSession();
  const navigate = useNavigate();

  const handleNavClick = (id: string) => {
    onNavigateSection(id);
    setMobileMenuOpen(false);
  };

  // Signed in → go straight to the portal (same tab). Signed out → magic-link modal.
  const handleSignIn = () => {
    setMobileMenuOpen(false);
    if (signedIn) navigate("/portal");
    else onOpenSignIn();
  };

  const handleSignOut = async () => {
    setMobileMenuOpen(false);
    await signOut();
  };

  return (
    <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-8">
          {/* Zone 1: Brand */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex items-center gap-2.5 text-ink hover:text-accent-ink transition-colors whitespace-nowrap shrink-0 group focus-visible:outline-accent"
          >
            <Logo className="w-9 h-9 sm:w-12 sm:h-12 transition-transform group-hover:scale-105" />
            <span className="font-bold text-lg sm:text-xl tracking-tight text-ink">
              {BRAND_CONFIG.name}
            </span>
          </a>

          {/* Zone 2: Desktop nav */}
          <nav
            aria-label="Main Navigation"
            className="hidden md:flex items-center gap-7 text-sm font-medium text-body"
          >
            <button
              onClick={() => handleNavClick("how-it-works")}
              className="hover:text-accent-ink transition-colors whitespace-nowrap cursor-pointer py-1"
            >
              How It Works
            </button>
            <button
              onClick={() => handleNavClick("apprenticeship")}
              className="hover:text-accent-ink transition-colors whitespace-nowrap cursor-pointer py-1"
            >
              Apprenticeship
            </button>
            <button
              onClick={() => handleNavClick("mentorship")}
              className="hover:text-accent-ink transition-colors whitespace-nowrap cursor-pointer py-1"
            >
              Mentorship
            </button>
            <button
              onClick={() => handleNavClick("faq")}
              className="hover:text-accent-ink transition-colors whitespace-nowrap cursor-pointer py-1"
            >
              FAQ
            </button>

            {signedIn ? (
              <>
                <Link
                  to="/portal"
                  className="text-ink hover:text-accent-ink transition-colors whitespace-nowrap py-1 flex items-center gap-1.5 font-semibold"
                >
                  <LayoutDashboard className="w-4 h-4" aria-hidden="true" /> My
                  Portal
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-slate-500 hover:text-ink transition-colors whitespace-nowrap cursor-pointer py-1 flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" aria-hidden="true" /> Sign out
                </button>
              </>
            ) : (
              <button
                onClick={handleSignIn}
                className="text-slate-600 hover:text-ink transition-colors whitespace-nowrap cursor-pointer py-1 flex items-center gap-1 font-medium"
              >
                Sign In
                <ArrowUpRight
                  className="w-3.5 h-3.5 opacity-60"
                  aria-hidden="true"
                />
              </button>
            )}
          </nav>

          {/* Zone 3: CTA */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <ThemeToggle />
            <button
              onClick={onChoosePath}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-accent hover:bg-accent-hover active:bg-accent-active rounded-lg shadow-sm hover:shadow transition-all whitespace-nowrap cursor-pointer"
            >
              Choose Your Path
            </button>
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:text-ink hover:bg-slate-100 focus-visible:outline-accent"
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" aria-hidden="true" />
              ) : (
                <Menu className="w-6 h-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-surface border-b border-slate-200 px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-3 text-base font-medium text-slate-800">
            <button
              onClick={() => handleNavClick("how-it-works")}
              className="text-left py-2 px-3 rounded-md hover:bg-slate-50 transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => handleNavClick("apprenticeship")}
              className="text-left py-2 px-3 rounded-md hover:bg-slate-50 transition-colors"
            >
              Apprenticeship ($97/mo)
            </button>
            <button
              onClick={() => handleNavClick("mentorship")}
              className="text-left py-2 px-3 rounded-md hover:bg-slate-50 transition-colors"
            >
              Mentorship (from $197/mo)
            </button>
            <button
              onClick={() => handleNavClick("skills")}
              className="text-left py-2 px-3 rounded-md hover:bg-slate-50 transition-colors"
            >
              Skills & Tracks
            </button>
            <button
              onClick={() => handleNavClick("faq")}
              className="text-left py-2 px-3 rounded-md hover:bg-slate-50 transition-colors"
            >
              FAQ
            </button>

            {signedIn ? (
              <>
                <Link
                  to="/portal"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-left py-2 px-3 rounded-md text-ink font-semibold hover:bg-slate-50 transition-colors flex items-center justify-between"
                >
                  <span>My Portal</span>
                  <LayoutDashboard className="w-4 h-4" />
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-left py-2 px-3 rounded-md text-slate-500 hover:bg-slate-50 transition-colors flex items-center justify-between"
                >
                  <span>Sign out</span>
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <button
                onClick={handleSignIn}
                className="text-left py-2 px-3 rounded-md text-slate-600 hover:bg-slate-50 transition-colors flex items-center justify-between"
              >
                <span>Applicant & Student Portal</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            )}

            {/* Light / dark mode (the phone header bar has no room for the button) */}
            <div className="flex items-center justify-between py-1 pl-3 pr-1 text-slate-600">
              <span>Dark mode</span>
              <ThemeToggle />
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onChoosePath();
                }}
                className="w-full py-3 text-center font-semibold text-white bg-accent hover:bg-accent-hover rounded-lg shadow-sm"
              >
                Choose Your Path
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
