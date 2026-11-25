import React from "react";
import { Link } from "react-router-dom";

export const AdminTabs: React.FC<{ current: "applications" | "mentors" }> = ({ current }) => {
  const tab = (key: typeof current, to: string, label: string) => (
    <Link
      to={to}
      className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
        current === key ? "bg-navy-solid text-white" : "text-slate-600 hover:text-ink hover:bg-surface"
      }`}
    >
      {label}
    </Link>
  );
  return (
    <nav className="inline-flex gap-1 p-1 bg-slate-100 rounded-xl mb-5">
      {tab("applications", "/admin", "Applications")}
      {tab("mentors", "/admin/mentors", "Mentors")}
    </nav>
  );
};
