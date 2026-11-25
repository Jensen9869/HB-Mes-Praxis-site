import React from 'react';
import { ANNOUNCEMENT_CONFIG } from '../config/platformConfig';

interface AnnouncementBarProps {
  onExploreClick: () => void;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ onExploreClick }) => {
  return (
    <aside 
      aria-label="Announcement"
      className="bg-navy text-white text-xs sm:text-sm py-2.5 px-4 border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-4 text-center">
        <span className="text-slate-200 font-medium">
          {ANNOUNCEMENT_CONFIG.text}
        </span>
        <button
          onClick={onExploreClick}
          className="text-[#38bdf8] hover:text-white font-semibold underline underline-offset-4 cursor-pointer transition-colors whitespace-nowrap focus-visible:outline-white"
        >
          {ANNOUNCEMENT_CONFIG.ctaLabel}
        </button>
      </div>
    </aside>
  );
};
