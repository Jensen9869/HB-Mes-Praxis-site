import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LogOut, UserPlus, GraduationCap, Briefcase, ChevronDown, ChevronUp, X } from "lucide-react";
import { api } from "../lib/api";
import { PortalShell, Card, Btn, Field, inputCls, Spinner, ErrorBox } from "../components/PortalShell";
import { StatusPill } from "../components/StatusPill";
import { AdminTabs } from "./AdminTabs";
import { trackLabel, type Status } from "../lib/labels";

type Mentor = { id: string; full_name: string; email: string; kind: "staff" | "student"; enrolment_id: string | null; active: number; apprentice_count: number };
type Apprentice = { id: string; mentor_id: string | null; programme: string; track: string | null; status: Status; full_name: string; email: string };
type Data = { mentors: Mentor[]; apprentices: Apprentice[] };

export default function AdminMentors({ onSignOut }: { onSignOut: () => void }) {
  const [data, setData] = useState<Data | null>(null);
  const [err, setErr] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const [toast, setToast] = useState("");

  const load = () =>
    api<Data>("/api/admin/mentors").then(setData).catch((e) => setErr(e instanceof Error ? e.message : "Failed to load"));
  useEffect(() => {
    load();
  }, []);

  const flash = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(""), 2500);
  };

  const signOut = async () => {
    await api("/api/admin/logout", { method: "POST" });
    onSignOut();
  };

  const toggleActive = async (m: Mentor) => {
    await api(`/api/admin/mentors/${m.id}`, { method: "PATCH", json: { active: !m.active } });
    load();
  };

  const unassigned = data?.apprentices.filter((a) => !a.mentor_id).length ?? 0;

  return (
    <PortalShell area="Admin" wide right={<Btn variant="ghost" size="sm" onClick={signOut}><LogOut className="w-3.5 h-3.5" /> Sign out</Btn>}>
      {toast && <div className="fixed top-20 right-4 z-50 bg-[#102a43] text-white text-sm px-4 py-2.5 rounded-lg shadow-lg">{toast}</div>}

      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <p className="text-xs font-bold tracking-wider text-[#ea580c] uppercase mb-1">Career Launch</p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#102a43] tracking-tight">Mentors</h1>
        </div>
        {data && unassigned > 0 && (
          <span className="text-sm font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg">
            {unassigned} apprentice{unassigned === 1 ? "" : "s"} without a mentor
          </span>
        )}
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
                  <p className="px-5 py-10 text-center text-sm text-slate-500">
                    No mentors yet. Approve a Mentorship student (they become a mentor automatically) or add a staff mentor on the right.
                  </p>
                ) : (
                  <ul className="divide-y divide-slate-100">
                    {data.mentors.map((m) => (
                      <MentorRow
                        key={m.id}
                        m={m}
                        apprentices={data.apprentices}
                        open={open === m.id}
                        onToggle={() => setOpen(open === m.id ? null : m.id)}
                        onToggleActive={() => toggleActive(m)}
                        onChanged={(msg) => { load(); flash(msg); }}
                      />
                    ))}
                  </ul>
                )}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <AddStaff onAdded={() => { load(); flash("Mentor added"); }} />
            <Card title="How it works">
              <ul className="text-sm text-slate-600 space-y-2 list-disc pl-4">
                <li>Approving a Mentorship student makes them a mentor automatically; rejecting or cancelling deactivates them.</li>
                <li>Company staff are added here by hand.</li>
                <li>Open a mentor to assign apprentices. Each apprentice has one mentor; re-assigning moves them.</li>
                <li>Deactivated mentors keep their history but can't receive new apprentices.</li>
              </ul>
            </Card>
          </div>
        </div>
      )}
    </PortalShell>
  );
}

function MentorRow({
  m, apprentices, open, onToggle, onToggleActive, onChanged,
}: {
  m: Mentor; apprentices: Apprentice[]; open: boolean; onToggle: () => void; onToggleActive: () => void; onChanged: (msg: string) => void;
}) {
  const mine = apprentices.filter((a) => a.mentor_id === m.id);
  // Not already theirs, and not the mentor themself (same email).
  const others = apprentices.filter((a) => a.mentor_id !== m.id && a.email.toLowerCase() !== m.email.toLowerCase());
  const [sel, setSel] = useState("");
  const [notify, setNotify] = useState(true);
  const [busy, setBusy] = useState(false);

  const assign = async (enrolmentId: string, mentorId: string | null) => {
    setBusy(true);
    try {
      await api(`/api/admin/enrolments/${enrolmentId}/mentor`, { method: "POST", json: { mentorId, notify: mentorId ? notify : false } });
      setSel("");
      onChanged(mentorId ? "Apprentice assigned" : "Apprentice removed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <li className={m.active ? "" : "opacity-60"}>
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
        <button type="button" onClick={onToggle} className="inline-flex items-center gap-1 text-sm font-semibold text-[#102a43] cursor-pointer whitespace-nowrap">
          {mine.length} apprentice{mine.length === 1 ? "" : "s"}
          {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        <Btn size="sm" variant="ghost" onClick={onToggleActive}>{m.active ? "Deactivate" : "Reactivate"}</Btn>
      </div>

      {open && (
        <div className="px-5 pb-5 pl-[4.25rem] space-y-4">
          {mine.length === 0 ? (
            <p className="text-sm text-slate-500">No apprentices assigned.</p>
          ) : (
            <ul className="space-y-2">
              {mine.map((a) => (
                <li key={a.id} className="flex items-center justify-between gap-3 text-sm">
                  <div className="min-w-0">
                    <Link to={`/admin/enrolments/${a.id}`} className="font-medium text-[#102a43] hover:text-[#ea580c]">{a.full_name}</Link>
                    <span className="text-xs text-slate-500"> · {trackLabel(a.track)} · {a.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusPill status={a.status} />
                    <button
                      type="button"
                      onClick={() => { if (window.confirm(`Remove ${a.full_name} from ${m.full_name}?`)) assign(a.id, null); }}
                      disabled={busy}
                      className="text-slate-400 hover:text-rose-600 cursor-pointer"
                      aria-label="Remove apprentice"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {m.active && (
            <div className="rounded-xl border border-dashed border-slate-300 p-3 space-y-2">
              <p className="text-xs font-semibold text-slate-600">Assign an apprentice to {m.full_name.split(" ")[0]}</p>
              {others.length === 0 ? (
                <p className="text-xs text-slate-500">No other paid/approved apprentices to assign.</p>
              ) : (
                <div className="flex flex-col sm:flex-row gap-2">
                  <select value={sel} onChange={(e) => setSel(e.target.value)} className={`${inputCls} flex-1`}>
                    <option value="">Choose an apprentice…</option>
                    {others.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.full_name} · {trackLabel(a.track)}{a.mentor_id ? " (currently with another mentor)" : ""}
                      </option>
                    ))}
                  </select>
                  <Btn size="sm" variant="secondary" onClick={() => sel && assign(sel, m.id)} disabled={busy || !sel}>Assign</Btn>
                </div>
              )}
              <label className="flex items-center gap-2 text-xs text-slate-600">
                <input type="checkbox" checked={notify} onChange={(e) => setNotify(e.target.checked)} className="rounded" />
                Email both when assigned
              </label>
            </div>
          )}
        </div>
      )}
    </li>
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
