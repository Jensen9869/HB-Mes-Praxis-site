import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Pencil, Trash2, Send, Eye, EyeOff, ExternalLink } from "lucide-react";
import { api, apiUrl } from "../lib/api";
import { PortalShell, Card, Btn, Field, inputCls, Spinner, ErrorBox } from "../components/PortalShell";
import { StatusPill } from "../components/StatusPill";
import { STATUSES, STATUS_LABEL, programmeLabel, trackLabel, billingLabel, fmtDate, money, type Status } from "../lib/labels";

type Detail = {
  enrolment: {
    id: string; user_id: string; programme: string; track: string | null; status: Status; billing: string;
    provider: string | null; provider_subscription_id: string | null; created_at: string; approved_at: string | null;
    full_name: string; email: string; institution: string | null; graduation_year: number | null; user_created_at: string;
  };
  payments: { id: string; amount: number; currency: string; status: string; paid_at: string; provider_invoice_id: string }[];
  notes: { id: string; body: string; visible_to_student: number; created_at: string }[];
  log: { id: string; from_status: string | null; to_status: string; reason: string | null; actor: string; created_at: string }[];
  emails: { id: string; subject: string; created_at: string }[];
  otherEnrolments: { id: string; programme: string; status: Status; created_at: string }[];
  mentor: { id: string; full_name: string; email: string; kind: string; active: number } | null;
  mentoring: { id: string; programme: string; track: string | null; status: Status; full_name: string; email: string }[];
};

type MentorOption = { id: string; full_name: string; email: string; kind: string; active: number };

export default function AdminDetail() {
  const { id = "" } = useParams();
  const [d, setD] = useState<Detail | null>(null);
  const [err, setErr] = useState("");
  const [toast, setToast] = useState("");

  const load = () =>
    api<Detail>(`/api/admin/enrolments/${id}`)
      .then(setD)
      .catch((e) => setErr(e instanceof Error ? e.message : "Failed to load"));
  useEffect(() => {
    load();
  }, [id]);

  const flash = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(""), 2500);
  };

  if (err) return <PortalShell area="Admin" wide><ErrorBox>{err}</ErrorBox></PortalShell>;
  if (!d) return <PortalShell area="Admin" wide><Spinner /></PortalShell>;
  const e = d.enrolment;

  return (
    <PortalShell
      area="Admin"
      wide
      right={<Link to="/admin" className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white"><ArrowLeft className="w-4 h-4" /> All applications</Link>}
    >
      {toast && <div className="fixed top-20 right-4 z-50 bg-[#102a43] text-white text-sm px-4 py-2.5 rounded-lg shadow-lg">{toast}</div>}

      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <p className="text-xs font-bold tracking-wider text-[#ea580c] uppercase mb-1">{programmeLabel(e.programme)}</p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#102a43] tracking-tight">{e.full_name}</h1>
          <p className="text-sm text-slate-500 mt-1">{e.email} · applied {fmtDate(e.created_at, true)}</p>
        </div>
        <StatusPill status={e.status} className="text-sm px-3 py-1.5" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <StatusCard d={d} onChanged={() => { load(); flash("Status updated"); }} />
          <NotesCard d={d} onChanged={load} />
          <EmailCard d={d} onSent={() => { load(); flash("Email sent"); }} />
          <PaymentsCard payments={d.payments} />
        </div>
        <div className="space-y-6">
          <StudentCard d={d} onSaved={() => { load(); flash("Details saved"); }} />
          {e.programme === "apprenticeship" && <MentorCard d={d} onChanged={() => { load(); flash("Mentor updated"); }} />}
          {d.mentoring.length > 0 && <MentoringCard list={d.mentoring} />}
          <EnrolmentInfo e={e} />
          <HistoryCard d={d} />
        </div>
      </div>
    </PortalShell>
  );
}

/* ───────────────────────── Status change ───────────────────────── */

function StatusCard({ d, onChanged }: { d: Detail; onChanged: () => void }) {
  const e = d.enrolment;
  const [target, setTarget] = useState<Status | null>(null);
  const [reason, setReason] = useState("");
  const [notify, setNotify] = useState(true);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const quick: { to: Status; label: string; variant: "primary" | "secondary" | "danger" | "ghost"; show: boolean }[] = [
    { to: "approved", label: "Approve", variant: "primary", show: e.status === "active" },
    { to: "rejected", label: "Reject", variant: "danger", show: e.status === "active" },
    { to: "cancelled", label: "Cancel enrolment", variant: "danger", show: ["awaiting_payment", "payment_failed", "approved"].includes(e.status) },
    { to: "completed", label: "Mark completed", variant: "secondary", show: e.status === "approved" },
  ];

  const confirm = async () => {
    if (!target) return;
    setBusy(true);
    setErr("");
    try {
      await api(`/api/admin/enrolments/${e.id}/status`, { method: "POST", json: { status: target, reason, notify } });
      setTarget(null);
      setReason("");
      onChanged();
    } catch (er) {
      setErr(er instanceof Error ? er.message : "Failed");
    } finally {
      setBusy(false);
    }
  };

  const ends = target && ["rejected", "cancelled", "completed"].includes(target);

  return (
    <Card title="Review">
      {!target ? (
        <div className="flex flex-wrap items-center gap-2">
          {quick.filter((q) => q.show).map((q) => (
            <Btn key={q.to} variant={q.variant} onClick={() => { setTarget(q.to); setNotify(true); }}>{q.label}</Btn>
          ))}
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs text-slate-500">Set status manually:</span>
            <select
              value=""
              onChange={(ev) => { if (ev.target.value) { setTarget(ev.target.value as Status); setNotify(false); } }}
              className={`${inputCls} w-auto py-1.5 text-xs`}
            >
              <option value="">Choose…</option>
              {STATUSES.filter((s) => s !== e.status).map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
            </select>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm">
            Change status from <StatusPill status={e.status} /> to <StatusPill status={target} />
          </p>
          {ends && e.provider_subscription_id && (
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              The PayPal subscription will be cancelled so no further instalments are taken. Payments already made are <strong>not</strong> refunded automatically — refund in PayPal if required.
            </p>
          )}
          <Field label={notify ? "Message to the student (included in the email)" : "Internal reason (logged, not sent)"}>
            <textarea value={reason} onChange={(ev) => setReason(ev.target.value)} rows={3} className={inputCls} placeholder="Optional" />
          </Field>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" checked={notify} onChange={(ev) => setNotify(ev.target.checked)} className="rounded" />
            Email the student about this change
          </label>
          {err && <p className="text-xs text-rose-600">{err}</p>}
          <div className="flex gap-2">
            <Btn variant={target === "rejected" || target === "cancelled" ? "danger" : "primary"} onClick={confirm} disabled={busy}>
              {busy ? "Saving…" : `Confirm: ${STATUS_LABEL[target]}`}
            </Btn>
            <Btn variant="ghost" onClick={() => setTarget(null)} disabled={busy}>Back</Btn>
          </div>
        </div>
      )}
    </Card>
  );
}

/* ───────────────────────── Notes ───────────────────────── */

function NotesCard({ d, onChanged }: { d: Detail; onChanged: () => void }) {
  const [body, setBody] = useState("");
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);

  const add = async () => {
    if (!body.trim()) return;
    setBusy(true);
    try {
      await api(`/api/admin/enrolments/${d.enrolment.id}/notes`, { method: "POST", json: { body, visibleToStudent: visible } });
      setBody("");
      setVisible(false);
      onChanged();
    } finally {
      setBusy(false);
    }
  };
  const remove = async (noteId: string) => {
    if (!window.confirm("Delete this note?")) return;
    await api(`/api/admin/enrolments/${d.enrolment.id}/notes/${noteId}`, { method: "DELETE" });
    onChanged();
  };

  return (
    <Card title="Notes">
      <div className="space-y-3 mb-5">
        <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={3} className={inputCls} placeholder="Add a note about this applicant…" />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" checked={visible} onChange={(e) => setVisible(e.target.checked)} className="rounded" />
            Show to the student in their portal
          </label>
          <Btn size="sm" variant="secondary" onClick={add} disabled={busy || !body.trim()}>Add note</Btn>
        </div>
      </div>
      {d.notes.length === 0 ? (
        <p className="text-sm text-slate-500">No notes yet.</p>
      ) : (
        <ul className="divide-y divide-slate-100">
          {d.notes.map((n) => (
            <li key={n.id} className="py-3 flex gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-800 whitespace-pre-line">{n.body}</p>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                  {n.visible_to_student ? <><Eye className="w-3 h-3" /> visible to student</> : <><EyeOff className="w-3 h-3" /> internal</>} · {fmtDate(n.created_at, true)}
                </p>
              </div>
              <button onClick={() => remove(n.id)} className="text-slate-400 hover:text-rose-600 cursor-pointer" aria-label="Delete note"><Trash2 className="w-4 h-4" /></button>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

/* ───────────────────────── Email ───────────────────────── */

function EmailCard({ d, onSent }: { d: Detail; onSent: () => void }) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const send = async () => {
    setBusy(true);
    setErr("");
    try {
      await api(`/api/admin/enrolments/${d.enrolment.id}/email`, { method: "POST", json: { subject, message } });
      setSubject("");
      setMessage("");
      onSent();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to send");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card title={`Email ${d.enrolment.full_name.split(" ")[0]}`}>
      <div className="space-y-3">
        <Field label="Subject"><input value={subject} onChange={(e) => setSubject(e.target.value)} className={inputCls} /></Field>
        <Field label="Message"><textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={5} className={inputCls} placeholder={`Hi ${d.enrolment.full_name.split(" ")[0]},`} /></Field>
        {err && <p className="text-xs text-rose-600">{err}</p>}
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-slate-500">Sent to {d.enrolment.email} in the branded template. Greeting is added automatically.</p>
          <Btn onClick={send} disabled={busy || !subject.trim() || !message.trim()}><Send className="w-4 h-4" /> {busy ? "Sending…" : "Send"}</Btn>
        </div>
      </div>
      {d.emails.length > 0 && (
        <ul className="mt-5 pt-4 border-t border-slate-100 text-xs text-slate-500 space-y-1">
          {d.emails.map((m) => <li key={m.id}>Sent “{m.subject}” · {fmtDate(m.created_at, true)}</li>)}
        </ul>
      )}
    </Card>
  );
}

/* ───────────────────────── Payments ───────────────────────── */

function PaymentsCard({ payments }: { payments: Detail["payments"] }) {
  const total = payments.reduce((a, p) => a + p.amount, 0);
  return (
    <Card title="Payments" action={<span className="text-sm font-bold text-[#102a43] tabular-nums">{money(total)} total</span>}>
      {payments.length === 0 ? (
        <p className="text-sm text-slate-500">No payments received.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-slate-500 border-b border-slate-100">
              <th className="py-2 font-semibold">Date</th><th className="py-2 font-semibold">PayPal ref</th><th className="py-2 font-semibold text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {payments.map((p) => (
              <tr key={p.id}>
                <td className="py-2.5 whitespace-nowrap">{fmtDate(p.paid_at, true)}</td>
                <td className="py-2.5 font-mono text-xs text-slate-500">{p.provider_invoice_id}</td>
                <td className="py-2.5 text-right font-semibold text-[#102a43] tabular-nums">{money(p.amount, p.currency)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Card>
  );
}

/* ───────────────────────── Sidebar cards ───────────────────────── */

function StudentCard({ d, onSaved }: { d: Detail; onSaved: () => void }) {
  const e = d.enrolment;
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState(e.full_name);
  const [institution, setInstitution] = useState(e.institution ?? "");
  const [gradYear, setGradYear] = useState(e.graduation_year ? String(e.graduation_year) : "");
  const [busy, setBusy] = useState(false);

  const save = async () => {
    setBusy(true);
    try {
      await api(`/api/admin/users/${e.user_id}`, { method: "PATCH", json: { fullName, institution, graduationYear: gradYear ? Number(gradYear) : null } });
      setEditing(false);
      onSaved();
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card
      title="Student"
      action={!editing && <button onClick={() => setEditing(true)} className="text-xs font-semibold text-[#ea580c] inline-flex items-center gap-1 cursor-pointer"><Pencil className="w-3.5 h-3.5" /> Edit</button>}
    >
      {editing ? (
        <div className="space-y-3">
          <Field label="Full name"><input value={fullName} onChange={(ev) => setFullName(ev.target.value)} className={inputCls} /></Field>
          <Field label="Institution"><input value={institution} onChange={(ev) => setInstitution(ev.target.value)} className={inputCls} /></Field>
          <Field label="Graduation year"><input value={gradYear} onChange={(ev) => setGradYear(ev.target.value)} className={inputCls} inputMode="numeric" /></Field>
          <div className="flex gap-2"><Btn size="sm" onClick={save} disabled={busy}>Save</Btn><Btn size="sm" variant="ghost" onClick={() => setEditing(false)}>Cancel</Btn></div>
        </div>
      ) : (
        <dl className="text-sm space-y-2.5">
          <Row k="Email"><a href={`mailto:${e.email}`} className="text-[#ea580c] break-all">{e.email}</a></Row>
          <Row k="Institution">{e.institution || "—"}</Row>
          <Row k="Graduation year">{e.graduation_year ?? "—"}</Row>
          <Row k="Account created">{fmtDate(e.user_created_at)}</Row>
        </dl>
      )}
      {d.otherEnrolments.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-100">
          <p className="text-xs font-semibold text-slate-500 mb-2">Other enrolments</p>
          <ul className="space-y-1.5">
            {d.otherEnrolments.map((o) => (
              <li key={o.id} className="text-sm flex items-center justify-between gap-2">
                <Link to={`/admin/enrolments/${o.id}`} className="text-[#102a43] hover:text-[#ea580c] truncate">{programmeLabel(o.programme)}</Link>
                <StatusPill status={o.status} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}

function EnrolmentInfo({ e }: { e: Detail["enrolment"] }) {
  return (
    <Card title="Enrolment">
      <dl className="text-sm space-y-2.5">
        <Row k="Programme">{programmeLabel(e.programme)}</Row>
        <Row k="Track">{trackLabel(e.track)}</Row>
        <Row k="Payment plan">{billingLabel(e.billing)}</Row>
        <Row k="Applied">{fmtDate(e.created_at, true)}</Row>
        <Row k="Approved">{e.approved_at ? fmtDate(e.approved_at, true) : "—"}</Row>
        <Row k="PayPal subscription">
          {e.provider_subscription_id ? (
            <a href={`https://www.paypal.com/billing/subscriptions/${e.provider_subscription_id}`} target="_blank" rel="noopener" className="font-mono text-xs text-[#ea580c] inline-flex items-center gap-1">
              {e.provider_subscription_id} <ExternalLink className="w-3 h-3" />
            </a>
          ) : "—"}
        </Row>
        <Row k="Enrolment ID"><span className="font-mono text-xs text-slate-500 break-all">{e.id}</span></Row>
      </dl>
      {e.status === "awaiting_payment" && (
        <p className="text-xs text-slate-500 mt-4">
          Payment link: <a href={apiUrl(`/api/payments/paypal/start?enrolment=${e.id}`)} className="text-[#ea580c] break-all">{apiUrl(`/api/payments/paypal/start?enrolment=${e.id}`)}</a>
        </p>
      )}
    </Card>
  );
}

function HistoryCard({ d }: { d: Detail }) {
  return (
    <Card title="History">
      {d.log.length === 0 ? (
        <p className="text-sm text-slate-500">No status changes recorded.</p>
      ) : (
        <ol className="relative border-l border-slate-200 ml-2 space-y-4">
          {d.log.map((l) => (
            <li key={l.id} className="pl-4">
              <span className="absolute -left-1.5 mt-1.5 w-3 h-3 rounded-full bg-[#38bdf8] border-2 border-white" />
              <div className="text-sm">
                {l.from_status && <><StatusPill status={l.from_status} /> → </>}<StatusPill status={l.to_status} />
              </div>
              <p className="text-xs text-slate-500 mt-1">{l.actor} · {fmtDate(l.created_at, true)}{l.reason ? ` · ${l.reason}` : ""}</p>
            </li>
          ))}
        </ol>
      )}
    </Card>
  );
}

/* ───────────────────────── Mentor assignment ───────────────────────── */

function MentorCard({ d, onChanged }: { d: Detail; onChanged: () => void }) {
  const [options, setOptions] = useState<MentorOption[] | null>(null);
  const [sel, setSel] = useState(d.mentor?.id ?? "");
  const [notify, setNotify] = useState(true);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    api<{ mentors: MentorOption[] }>("/api/admin/mentors")
      // Active mentors only, and never the apprentice themself (same email).
      .then((r) => setOptions(r.mentors.filter((m) => m.active && m.email.toLowerCase() !== d.enrolment.email.toLowerCase())))
      .catch(() => setOptions([]));
  }, []);

  const save = async () => {
    setBusy(true);
    setErr("");
    try {
      await api(`/api/admin/enrolments/${d.enrolment.id}/mentor`, { method: "POST", json: { mentorId: sel || null, notify } });
      onChanged();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusy(false);
    }
  };

  const changed = sel !== (d.mentor?.id ?? "");

  return (
    <Card title="Mentor">
      {d.mentor ? (
        <p className="text-sm mb-3">
          <span className="font-semibold text-[#102a43]">{d.mentor.full_name}</span>
          <span className="text-slate-500"> · {d.mentor.email}</span>
          {!d.mentor.active && <span className="ml-2 text-[10px] uppercase tracking-wider text-rose-600">inactive</span>}
        </p>
      ) : (
        <p className="text-sm text-slate-500 mb-3">No mentor assigned yet.</p>
      )}
      {options === null ? (
        <p className="text-xs text-slate-400">Loading mentors…</p>
      ) : options.length === 0 ? (
        <p className="text-xs text-slate-500">No active mentors. <Link to="/admin/mentors" className="text-[#ea580c] font-semibold">Add one →</Link></p>
      ) : (
        <div className="space-y-3">
          <select value={sel} onChange={(e) => setSel(e.target.value)} className={inputCls}>
            <option value="">— No mentor —</option>
            {options.map((m) => (
              <option key={m.id} value={m.id}>{m.full_name} ({m.kind === "student" ? "Mentorship student" : "Staff"})</option>
            ))}
          </select>
          <label className="flex items-center gap-2 text-xs text-slate-700">
            <input type="checkbox" checked={notify} onChange={(e) => setNotify(e.target.checked)} className="rounded" />
            Email both the apprentice and the mentor
          </label>
          {err && <p className="text-xs text-rose-600">{err}</p>}
          <Btn size="sm" variant="secondary" onClick={save} disabled={busy || !changed}>{busy ? "Saving…" : "Save"}</Btn>
        </div>
      )}
    </Card>
  );
}

function MentoringCard({ list }: { list: Detail["mentoring"] }) {
  return (
    <Card title={`Mentoring (${list.length})`}>
      <ul className="space-y-2.5">
        {list.map((a) => (
          <li key={a.id} className="text-sm flex items-center justify-between gap-2">
            <div className="min-w-0">
              <Link to={`/admin/enrolments/${a.id}`} className="font-medium text-[#102a43] hover:text-[#ea580c]">{a.full_name}</Link>
              <div className="text-xs text-slate-500">{trackLabel(a.track)}</div>
            </div>
            <StatusPill status={a.status} />
          </li>
        ))}
      </ul>
    </Card>
  );
}

const Row: React.FC<{ k: string; children: React.ReactNode }> = ({ k, children }) => (
  <div><dt className="text-xs text-slate-500">{k}</dt><dd className="font-medium text-[#102a43]">{children}</dd></div>
);
