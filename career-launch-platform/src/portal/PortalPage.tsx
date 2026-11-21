import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Mail, LogOut, Pencil, Check, ExternalLink, CreditCard, BookOpen, MessageSquare, FileText, Users } from "lucide-react";
import { api, apiUrl, ApiError } from "../lib/api";
import { useWaitForSignIn } from "../lib/useWaitForSignIn";
import { PortalShell, Card, Btn, Field, inputCls, Spinner, ErrorBox } from "../components/PortalShell";
import { StatusPill } from "../components/StatusPill";
import { programmeLabel, trackLabel, billingLabel, fmtDate, money, STATUS_HINT, type Status } from "../lib/labels";

type Me = {
  user: { id: string; email: string; full_name: string; institution: string | null; graduation_year: number | null; created_at: string };
  enrolments: {
    id: string; programme: string; track: string | null; status: Status; billing: string; created_at: string; approved_at: string | null;
    mentor_name: string | null; mentor_email: string | null;
  }[];
  payments: { id: string; amount: number; currency: string; status: string; paid_at: string; programme: string }[];
  updates: { id: string; body: string; created_at: string; programme: string }[];
  mentoring: { id: string; programme: string; track: string | null; status: Status; full_name: string; email: string }[];
  isMentor: boolean;
};

export default function PortalPage() {
  const [state, setState] = useState<"loading" | "unauth" | "ready" | "error">("loading");
  const [me, setMe] = useState<Me | null>(null);
  const [params] = useSearchParams();

  const load = useCallback(async () => {
    try {
      setMe(await api<Me>("/api/me"));
      setState("ready");
    } catch (e) {
      setState(e instanceof ApiError && e.status === 401 ? "unauth" : "error");
    }
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  if (state === "loading") return <PortalShell area="Student Portal"><Spinner /></PortalShell>;
  if (state === "error")
    return (
      <PortalShell area="Student Portal">
        <ErrorBox>Could not load your portal. Please refresh, or email us if it keeps happening.</ErrorBox>
      </PortalShell>
    );
  if (state === "unauth" || !me) return <SignIn expired={params.get("error") === "expired"} onSignedIn={load} />;

  const signOut = async () => {
    await api("/api/me/logout", { method: "POST" });
    setState("unauth");
    setMe(null);
  };

  const firstName = me.user.full_name.split(" ")[0];

  return (
    <PortalShell
      area="Student Portal"
      right={
        <>
          <span className="hidden sm:inline text-slate-300">{me.user.email}</span>
          <Btn variant="ghost" size="sm" onClick={signOut}><LogOut className="w-3.5 h-3.5" /> Sign out</Btn>
        </>
      }
    >
      <div className="mb-8">
        <p className="text-xs font-bold tracking-wider text-[#ea580c] uppercase mb-1">Welcome back</p>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#102a43] tracking-tight">Hi {firstName}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Enrolments me={me} />
          {me.isMentor && <Mentoring list={me.mentoring} />}
          <Progress />
          <Payments payments={me.payments} />
        </div>
        <div className="space-y-6">
          <Profile me={me} onSaved={load} />
          <Updates updates={me.updates} isApprentice={me.enrolments.some((e) => e.programme === "apprenticeship")} />
          <Card title="Need help?">
            <p className="text-sm text-slate-600 leading-relaxed">
              Questions about your programme, payments or anything else — email{" "}
              <a href="mailto:support@birthdaymessaging.io" className="text-[#ea580c] font-semibold">support@birthdaymessaging.io</a>.
            </p>
          </Card>
        </div>
      </div>
    </PortalShell>
  );
}

/* ───────────────────────── Sign in (magic link) ───────────────────────── */

function SignIn({ expired, onSignedIn }: { expired: boolean; onSignedIn: () => void }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  // When the magic link is clicked (usually in another tab), this tab loads the portal by itself.
  useWaitForSignIn(sent, onSignedIn);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setErr("Please enter a valid email address");
    setErr("");
    setBusy(true);
    try {
      await api("/api/auth/magic-link", { method: "POST", json: { email } });
      setSent(true);
    } catch {
      setErr("Could not send the link. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <PortalShell area="Student Portal">
      <div className="max-w-md mx-auto mt-6">
        <Card>
          {sent ? (
            <div className="text-center py-4 space-y-3">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto"><Check className="w-6 h-6" /></div>
              <h1 className="text-lg font-bold text-[#102a43]">Check your email</h1>
              <p className="text-sm text-slate-600">If <strong>{email}</strong> has an enrolment with us, a one-time sign-in link is on its way. Click it and this page will open your portal automatically.</p>
              <p className="text-xs text-slate-400 animate-pulse">Waiting for you to click the link…</p>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div>
                <h1 className="text-xl font-bold text-[#102a43]">Sign in to your portal</h1>
                <p className="text-sm text-slate-600 mt-1">Enter the email you applied with and we'll send you a one-time sign-in link. No password needed.</p>
              </div>
              {expired && <ErrorBox>That sign-in link has expired or was already used. Request a new one below.</ErrorBox>}
              <Field label="Email address">
                <div className="relative">
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@university.edu" className={`${inputCls} pl-9`} />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </Field>
              {err && <p className="text-xs text-rose-600">{err}</p>}
              <Btn type="submit" disabled={busy} className="w-full">{busy ? "Sending…" : "Send sign-in link"}</Btn>
            </form>
          )}
        </Card>
      </div>
    </PortalShell>
  );
}

/* ───────────────────────── Sections ───────────────────────── */

function Enrolments({ me }: { me: Me }) {
  if (!me.enrolments.length)
    return (
      <Card title="My programmes">
        <p className="text-sm text-slate-600">You have no enrolments yet. <a href="/#programmes" className="text-[#ea580c] font-semibold">Explore the programmes →</a></p>
      </Card>
    );
  return (
    <Card title="My programmes">
      <div className="space-y-4">
        {me.enrolments.map((e) => (
          <div key={e.id} className="rounded-xl border border-slate-200 p-4 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="font-bold text-[#102a43]">{programmeLabel(e.programme)}</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {trackLabel(e.track)} · {billingLabel(e.billing)} · applied {fmtDate(e.created_at)}
                </p>
              </div>
              <StatusPill status={e.status} />
            </div>
            <p className="text-sm text-slate-600 mt-3">{STATUS_HINT[e.status] ?? ""}</p>
            {e.mentor_name && (
              <div className="mt-3 flex items-center gap-2 text-sm bg-sky-50 border border-sky-100 rounded-lg px-3 py-2">
                <Users className="w-4 h-4 text-[#0284c7] shrink-0" />
                <span>Your mentor: <strong className="text-[#102a43]">{e.mentor_name}</strong>
                  {e.mentor_email && <> · <a href={`mailto:${e.mentor_email}`} className="text-[#ea580c]">{e.mentor_email}</a></>}
                </span>
              </div>
            )}
            {e.status === "awaiting_payment" && (
              <a
                href={apiUrl(`/api/payments/paypal/start?enrolment=${e.id}`)}
                className="mt-3 inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-[#ea580c] hover:bg-[#c2410c] rounded-lg"
              >
                <CreditCard className="w-4 h-4" /> Pay now with PayPal
              </a>
            )}
            {e.status === "payment_failed" && (
              <a href="https://www.paypal.com/myaccount/autopay/" target="_blank" rel="noopener" className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[#ea580c]">
                Update payment method in PayPal <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}

function Mentoring({ list }: { list: Me["mentoring"] }) {
  return (
    <Card title={`Your apprentices (${list.length})`}>
      {list.length === 0 ? (
        <div className="flex items-start gap-3 text-sm text-slate-500">
          <Users className="w-5 h-5 text-slate-300 shrink-0 mt-0.5" />
          <p>No apprentices have been assigned to you yet. You'll get an email when one is.</p>
        </div>
      ) : (
        <ul className="divide-y divide-slate-100">
          {list.map((a) => (
            <li key={a.id} className="py-3 flex flex-wrap items-center justify-between gap-3 text-sm">
              <div className="min-w-0">
                <div className="font-semibold text-[#102a43]">{a.full_name}</div>
                <div className="text-xs text-slate-500">{trackLabel(a.track)} · {programmeLabel(a.programme)}</div>
              </div>
              <div className="flex items-center gap-2">
                <StatusPill status={a.status} />
                <a href={`mailto:${a.email}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#102a43] hover:bg-[#1a365d] rounded-lg">
                  <Mail className="w-3.5 h-3.5" /> Email
                </a>
              </div>
            </li>
          ))}
        </ul>
      )}
      {list.length > 0 && <p className="text-xs text-slate-500 mt-3">Please contact each apprentice to arrange your first session.</p>}
    </Card>
  );
}

function Progress() {
  return (
    <Card title="Progress & assignments">
      <div className="flex items-start gap-3 text-sm text-slate-600">
        <BookOpen className="w-5 h-5 text-[#38bdf8] shrink-0 mt-0.5" />
        <p>Your assignments, submissions and mentor feedback will appear here once your programme begins.</p>
      </div>
    </Card>
  );
}

function Payments({ payments }: { payments: Me["payments"] }) {
  return (
    <Card title="Payments">
      {payments.length === 0 ? (
        <p className="text-sm text-slate-500">No payments yet.</p>
      ) : (
        <div className="overflow-x-auto -mx-5 sm:-mx-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-slate-500 border-b border-slate-100">
                <th className="px-5 sm:px-6 py-2 font-semibold">Date</th>
                <th className="px-3 py-2 font-semibold">Programme</th>
                <th className="px-3 py-2 font-semibold text-right">Amount</th>
                <th className="px-5 sm:px-6 py-2 font-semibold text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payments.map((p) => (
                <tr key={p.id}>
                  <td className="px-5 sm:px-6 py-3 whitespace-nowrap">{fmtDate(p.paid_at)}</td>
                  <td className="px-3 py-3">{programmeLabel(p.programme)}</td>
                  <td className="px-3 py-3 text-right font-semibold text-[#102a43] tabular-nums whitespace-nowrap">{money(p.amount, p.currency)}</td>
                  <td className="px-5 sm:px-6 py-3 text-right">
                    <a href={apiUrl(`/api/me/receipts/${p.id}`)} target="_blank" rel="noopener" className="inline-flex items-center gap-1 text-[#ea580c] font-semibold">
                      <FileText className="w-3.5 h-3.5" /> View
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="text-xs text-slate-500 mt-4">To update your card, log in to your PayPal account. Prices are in USD.</p>
    </Card>
  );
}

function Profile({ me, onSaved }: { me: Me; onSaved: () => void }) {
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState(me.user.full_name);
  const [institution, setInstitution] = useState(me.user.institution ?? "");
  const [gradYear, setGradYear] = useState(me.user.graduation_year ? String(me.user.graduation_year) : "");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const save = async () => {
    setBusy(true);
    setErr("");
    try {
      await api("/api/me", {
        method: "PATCH",
        json: { fullName, institution, graduationYear: gradYear ? Number(gradYear) : null },
      });
      setEditing(false);
      onSaved();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not save");
    } finally {
      setBusy(false);
    }
  };

  const years = Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - 1 + i);

  return (
    <Card
      title="My details"
      action={
        !editing && (
          <button onClick={() => setEditing(true)} className="text-xs font-semibold text-[#ea580c] inline-flex items-center gap-1 cursor-pointer">
            <Pencil className="w-3.5 h-3.5" /> Edit
          </button>
        )
      }
    >
      {editing ? (
        <div className="space-y-3">
          <Field label="Full name"><input value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputCls} /></Field>
          <Field label="University / College"><input value={institution} onChange={(e) => setInstitution(e.target.value)} className={inputCls} /></Field>
          <Field label="Expected graduation year">
            <select value={gradYear} onChange={(e) => setGradYear(e.target.value)} className={inputCls}>
              <option value="">Other / not applicable</option>
              {years.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </Field>
          {err && <p className="text-xs text-rose-600">{err}</p>}
          <div className="flex gap-2 pt-1">
            <Btn size="sm" onClick={save} disabled={busy}>{busy ? "Saving…" : "Save"}</Btn>
            <Btn size="sm" variant="ghost" onClick={() => setEditing(false)}>Cancel</Btn>
          </div>
        </div>
      ) : (
        <dl className="text-sm space-y-2.5">
          <div><dt className="text-xs text-slate-500">Name</dt><dd className="font-medium text-[#102a43]">{me.user.full_name}</dd></div>
          <div><dt className="text-xs text-slate-500">Email</dt><dd className="font-medium text-[#102a43] break-all">{me.user.email}</dd></div>
          <div><dt className="text-xs text-slate-500">Institution</dt><dd className="font-medium text-[#102a43]">{me.user.institution || "—"}</dd></div>
          <div><dt className="text-xs text-slate-500">Graduation year</dt><dd className="font-medium text-[#102a43]">{me.user.graduation_year ?? "—"}</dd></div>
        </dl>
      )}
      <p className="text-xs text-slate-500 mt-4">To change your email address, contact support.</p>
    </Card>
  );
}

function Updates({ updates, isApprentice }: { updates: Me["updates"]; isApprentice: boolean }) {
  // Mentorship-only students have no mentor: show the card only if there is something to show.
  if (!isApprentice && updates.length === 0) return null;
  return (
    <Card title={isApprentice ? "Updates from your mentor" : "Updates from the team"}>
      {updates.length === 0 ? (
        <div className="flex items-start gap-3 text-sm text-slate-500">
          <MessageSquare className="w-5 h-5 text-slate-300 shrink-0 mt-0.5" />
          <p>Nothing yet. Messages from your mentor and the team will appear here.</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {updates.map((u) => (
            <li key={u.id} className="text-sm">
              <p className="text-slate-700 whitespace-pre-line">{u.body}</p>
              <p className="text-xs text-slate-400 mt-1">{programmeLabel(u.programme)} · {fmtDate(u.created_at)}</p>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
