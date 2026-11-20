import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LogOut, UserPlus, GraduationCap, Briefcase, ChevronDown, ChevronUp } from "lucide-react";
import { api } from "../lib/api";
import { PortalShell, Card, Btn, Field, inputCls, Spinner, ErrorBox } from "../components/PortalShell";
import { StatusPill } from "../components/StatusPill";
import { AdminTabs } from "./AdminTabs";
import { programmeLabel, trackLabel, type Status } from "../lib/labels";

type Mentor = { id: string; full_name: string; email: string; kind: "staff" | "student"; enrolment_id: string | null; active: number; apprentice_count: number };
type Apprentice = { id: string; mentor_id: string; programme: string; track: string | null; status: Status; full_name: string; email: string };
type Candidate = { enrolment_id: string; programme: string; status: Status; full_name: string; email: string };
type Data = { mentors: Mentor[]; apprentices: Apprentice[]; candidates: Candidate[] };

export default function AdminMentors({ onSignOut }: { onSignOut: () => void }) {
  const [data, setData] = useState<Data | null>(null);
  const [err, setErr] = useState("");
  const [open, setOpen] = useState<string | null>(null);

  const load = () =>
    api<Data>("/api/admin/mentors").then(setData).catch((e) => setErr(e instanceof Error ? e.message : "Failed to load"));
  useEffect(() => {
    load();
  }, []);

  const signOut = async () => {
    await api("/api/admin/logout", { method: "POST" });
    onSignOut();
  };

  const toggleActive = async (m: Mentor) => {
    await api(`/api/admin/mentors/${m.id}`, { method: "PATCH", json: { active: !m.active } });
    load();
  };

  return (
    <PortalShell area="Admin" wide right={<Btn variant="ghost" size="sm" onClick={signOut}><LogOut className="w-3.5 h-3.5" /> Sign out</Btn>}>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <p className="text-xs font-bold tracking-wider text-[#ea580c] uppercase mb-1">Career Launch</p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#102a43] tracking-tight">Mentors</h1>
        </div>
      </div>
      <AdminTabs current="mentors" />

      {err && <ErrorBox>{err}</ErrorBox>}
      {!data && !err && <Spinner />}

      {data && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <div className="-mx-5 sm:-mx-6 -my-5">
                {data.mentors.length === 0 ? (
                  <p className="px-5 py-10 text-center text-sm text-slate-500">No mentors yet. Add one on the right.</p>
                ) : (
                  <ul className="divide-y divide-slate-100">
                    {data.mentors.map((m) => {
                      const kids = data.apprentices.filter((a) => a.mentor_id === m.id);
                      const isOpen = open === m.id;
                      return (
                        <li key={m.id} className={m.active ? "" : "opacity-60"}>
                          <div className="px-5 py-3.5 flex items-center gap-3">
                            <span className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${m.kind === "student" ? "bg-sky-50 text-[#0284c7]" : "bg-orange-50 text-[#ea580c]"}`}>
                              {m.kind === "student" ? <GraduationCap className="w-4 h-4" /> : <Briefcase className="w-4 h-4" />}
                            </span>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-[#102a43] truncate">
                                {m.full_name}
                                {!m.active && <span className="ml-2 text-[10px] uppercase tracking-wider text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">inactive</span>}
                              </div>
                              <div className="text-xs text-slate-500 truncate">
                                {m.email} · {m.kind === "student" ? "Mentorship student" : "Staff"}
                                {m.enrolment_id && <> · <Link to={`/admin/enrolments/${m.enrolment_id}`} className="text-[#ea580c]">view enrolment</Link></>}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => setOpen(isOpen ? null : m.id)}
                              className="inline-flex items-center gap-1 text-sm font-semibold text-[#102a43] cursor-pointer whitespace-nowrap"
                            >
                              {m.apprentice_count} apprentice{m.apprentice_count === 1 ? "" : "s"}
                              {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                            <Btn size="sm" variant="ghost" onClick={() => toggleActive(m)}>{m.active ? "Deactivate" : "Reactivate"}</Btn>
                          </div>
                          {isOpen && (
                            <div className="px-5 pb-4 pl-[4.25rem]">
                              {kids.length === 0 ? (
                                <p className="text-sm text-slate-500">No apprentices assigned. Assign from an apprentice's detail page.</p>
                              ) : (
                                <ul className="space-y-2">
                                  {kids.map((a) => (
                                    <li key={a.id} className="flex items-center justify-between gap-3 text-sm">
                                      <div className="min-w-0">
                                        <Link to={`/admin/enrolments/${a.id}`} className="font-medium text-[#102a43] hover:text-[#ea580c]">{a.full_name}</Link>
                                        <span className="text-xs text-slate-500"> · {trackLabel(a.track)} · {programmeLabel(a.programme)}</span>
                                      </div>
                                      <StatusPill status={a.status} />
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <AddStaff onAdded={load} />
            <AddFromStudents candidates={data.candidates} onAdded={load} />
          </div>
        </div>
      )}
    </PortalShell>
  );
}

function AddStaff({ onAdded }: { onAdded: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const add = async () => {
    setBusy(true);
    setErr("");
    try {
      await api("/api/admin/mentors", { method: "POST", json: { fullName: name, email } });
      setName("");
      setEmail("");
      onAdded();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusy(false);
    }
  };
  return (
    <Card title="Add staff mentor">
      <div className="space-y-3">
        <Field label="Full name"><input value={name} onChange={(e) => setName(e.target.value)} className={inputCls} /></Field>
        <Field label="Email"><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} /></Field>
        {err && <p className="text-xs text-rose-600">{err}</p>}
        <Btn size="sm" variant="secondary" onClick={add} disabled={busy || !name.trim() || !email.trim()}><UserPlus className="w-3.5 h-3.5" /> Add</Btn>
      </div>
    </Card>
  );
}

function AddFromStudents({ candidates, onAdded }: { candidates: Candidate[]; onAdded: () => void }) {
  const [sel, setSel] = useState("");
  const [busy, setBusy] = useState(false);
  const add = async () => {
    if (!sel) return;
    setBusy(true);
    try {
      await api("/api/admin/mentors", { method: "POST", json: { enrolmentId: sel } });
      setSel("");
      onAdded();
    } finally {
      setBusy(false);
    }
  };
  return (
    <Card title="Add from Mentorship students">
      {candidates.length === 0 ? (
        <p className="text-sm text-slate-500">Every active Mentorship student is already a mentor.</p>
      ) : (
        <div className="space-y-3">
          <select value={sel} onChange={(e) => setSel(e.target.value)} className={inputCls}>
            <option value="">Choose a student…</option>
            {candidates.map((c) => (
              <option key={c.enrolment_id} value={c.enrolment_id}>{c.full_name} — {programmeLabel(c.programme)}</option>
            ))}
          </select>
          <Btn size="sm" variant="secondary" onClick={add} disabled={busy || !sel}><UserPlus className="w-3.5 h-3.5" /> Make mentor</Btn>
          <p className="text-xs text-slate-500">Only active or approved Mentorship students are listed.</p>
        </div>
      )}
    </Card>
  );
}
