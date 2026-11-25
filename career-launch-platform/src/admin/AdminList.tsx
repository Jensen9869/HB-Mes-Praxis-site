import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Download, LogOut, ChevronRight } from "lucide-react";
import { api, apiUrl } from "../lib/api";
import { PortalShell, Card, Btn, inputCls, Spinner, ErrorBox } from "../components/PortalShell";
import { StatusPill } from "../components/StatusPill";
import { STATUSES, STATUS_LABEL, programmeLabel, trackLabel, fmtDate, money, type Status } from "../lib/labels";
import { AdminTabs } from "./AdminTabs";

type Row = {
  id: string; programme: string; track: string | null; status: Status; billing: string; created_at: string;
  full_name: string; email: string; institution: string | null; paid_count: number; paid_total: number;
};
type ListResponse = { rows: Row[]; counts: { status: string; n: number }[] };

export default function AdminList({ onSignOut }: { onSignOut: () => void }) {
  const [status, setStatus] = useState<string>("");
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [data, setData] = useState<ListResponse | null>(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q.trim()), 300);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    setErr("");
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (debouncedQ) params.set("q", debouncedQ);
    api<ListResponse>(`/api/admin/enrolments?${params}`)
      .then(setData)
      .catch((e) => setErr(e instanceof Error ? e.message : "Failed to load"));
  }, [status, debouncedQ]);

  const signOut = async () => {
    await api("/api/admin/logout", { method: "POST" });
    onSignOut();
  };

  const countOf = (s: string) => data?.counts.find((c) => c.status === s)?.n ?? 0;
  const total = data?.counts.reduce((a, c) => a + c.n, 0) ?? 0;

  return (
    <PortalShell
      area="Admin"
      wide
      right={
        <>
          <a href={apiUrl("/api/admin/export.csv")} className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white">
            <Download className="w-4 h-4" /> <span className="hidden sm:inline">Export CSV</span>
          </a>
          <Btn variant="ghost" size="sm" onClick={signOut}><LogOut className="w-3.5 h-3.5" /> Sign out</Btn>
        </>
      }
    >
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <p className="text-xs font-bold tracking-wider text-accent-ink uppercase mb-1">Career Launch</p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">Applications</h1>
        </div>
        <div className="relative w-full sm:w-80">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, email, institution…" className={`${inputCls} pl-9`} />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      <AdminTabs current="applications" />

      {/* Status filter chips */}
      <div className="flex flex-wrap gap-2 mb-5">
        <Chip active={status === ""} onClick={() => setStatus("")}>All <b>{total}</b></Chip>
        {STATUSES.map((s) => (
          <Chip key={s} active={status === s} onClick={() => setStatus(s)}>
            {STATUS_LABEL[s]} <b>{countOf(s)}</b>
          </Chip>
        ))}
      </div>

      {err && <ErrorBox>{err}</ErrorBox>}
      {!data && !err && <Spinner />}

      {data && (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto -mx-5 sm:-mx-6 -my-5">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-slate-500 bg-slate-50 border-b border-slate-200">
                  <th className="px-5 py-3 font-semibold">Applicant</th>
                  <th className="px-3 py-3 font-semibold">Institution</th>
                  <th className="px-3 py-3 font-semibold">Programme</th>
                  <th className="px-3 py-3 font-semibold">Status</th>
                  <th className="px-3 py-3 font-semibold text-right">Paid</th>
                  <th className="px-3 py-3 font-semibold">Applied</th>
                  <th className="px-3 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.rows.length === 0 && (
                  <tr><td colSpan={7} className="px-5 py-10 text-center text-slate-500">No applications match.</td></tr>
                )}
                {data.rows.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="px-5 py-3">
                      <Link to={`/admin/enrolments/${r.id}`} className="font-semibold text-ink hover:text-accent-ink">{r.full_name}</Link>
                      <div className="text-xs text-slate-500">{r.email}</div>
                    </td>
                    <td className="px-3 py-3 text-slate-600">{r.institution || "—"}</td>
                    <td className="px-3 py-3">
                      <div className="text-slate-800">{programmeLabel(r.programme)}</div>
                      <div className="text-xs text-slate-500">{trackLabel(r.track)} · {r.billing === "upfront" ? "Upfront" : "Monthly"}</div>
                    </td>
                    <td className="px-3 py-3"><StatusPill status={r.status} /></td>
                    <td className="px-3 py-3 text-right tabular-nums whitespace-nowrap">
                      <div className="font-semibold text-ink">{money(r.paid_total)}</div>
                      <div className="text-xs text-slate-500">{r.paid_count} payment{r.paid_count === 1 ? "" : "s"}</div>
                    </td>
                    <td className="px-3 py-3 text-slate-600 whitespace-nowrap">{fmtDate(r.created_at)}</td>
                    <td className="px-3 py-3 text-right">
                      <Link to={`/admin/enrolments/${r.id}`} className="inline-flex items-center text-accent-ink font-semibold text-xs">
                        Open <ChevronRight className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </PortalShell>
  );
}

const Chip: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
      active ? "bg-navy-solid text-white border-navy-solid" : "bg-surface text-slate-600 border-slate-200 hover:border-slate-400"
    } [&>b]:ml-1 [&>b]:font-bold`}
  >
    {children}
  </button>
);
