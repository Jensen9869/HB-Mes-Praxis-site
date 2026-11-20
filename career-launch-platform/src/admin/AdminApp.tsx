import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Lock } from "lucide-react";
import { api, ApiError } from "../lib/api";
import { PortalShell, Card, Btn, Field, inputCls, Spinner } from "../components/PortalShell";
import AdminList from "./AdminList";
import AdminDetail from "./AdminDetail";
import AdminMentors from "./AdminMentors";

/** /admin/* — checks the admin cookie once, then renders the routes. */
export default function AdminApp() {
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    api("/api/admin/me")
      .then(() => setAuthed(true))
      .catch((e) => setAuthed(e instanceof ApiError && e.status === 401 ? false : false));
  }, []);

  if (authed === null) return <PortalShell area="Admin"><Spinner /></PortalShell>;
  if (!authed) return <Login onDone={() => setAuthed(true)} />;

  return (
    <Routes>
      <Route index element={<AdminList onSignOut={() => setAuthed(false)} />} />
      <Route path="enrolments/:id" element={<AdminDetail />} />
      <Route path="mentors" element={<AdminMentors onSignOut={() => setAuthed(false)} />} />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}

function Login({ onDone }: { onDone: () => void }) {
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr("");
    try {
      await api("/api/admin/login", { method: "POST", json: { password } });
      onDone();
    } catch (e) {
      setErr(e instanceof ApiError && e.status === 429 ? "Too many attempts. Wait a minute." : "Wrong password");
    } finally {
      setBusy(false);
    }
  };

  return (
    <PortalShell area="Admin">
      <div className="max-w-sm mx-auto mt-10">
        <Card>
          <form onSubmit={submit} className="space-y-4">
            <div className="w-11 h-11 rounded-xl bg-[#102a43] text-white flex items-center justify-center"><Lock className="w-5 h-5" /></div>
            <h1 className="text-xl font-bold text-[#102a43]">Admin sign in</h1>
            <Field label="Password">
              <input type="password" autoFocus value={password} onChange={(e) => setPassword(e.target.value)} className={inputCls} />
            </Field>
            {err && <p className="text-xs text-rose-600">{err}</p>}
            <Btn type="submit" variant="secondary" disabled={busy || !password} className="w-full">{busy ? "Signing in…" : "Sign in"}</Btn>
          </form>
        </Card>
      </div>
    </PortalShell>
  );
}
