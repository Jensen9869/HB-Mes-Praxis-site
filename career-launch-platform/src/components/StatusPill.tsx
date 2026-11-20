import React from "react";
import { STATUS_LABEL, STATUS_STYLE, type Status } from "../lib/labels";

export const StatusPill: React.FC<{ status: string; className?: string }> = ({ status, className = "" }) => {
  const s = status as Status;
  const style = STATUS_STYLE[s] ?? "bg-slate-100 text-slate-600 border-slate-200";
  const label = STATUS_LABEL[s] ?? status;
  return (
    <span className={`inline-flex items-center whitespace-nowrap text-xs font-semibold px-2.5 py-1 rounded-full border ${style} ${className}`}>
      {label}
    </span>
  );
};
