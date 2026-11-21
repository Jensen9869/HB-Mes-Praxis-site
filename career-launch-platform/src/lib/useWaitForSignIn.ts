import { useEffect } from "react";
import { api } from "./api";

/**
 * After a magic link is requested, the user clicks it in their email client,
 * which usually opens a NEW tab. This hook makes the ORIGINAL tab notice the
 * new session (polls /api/me every 3 s for up to 15 min) and calls onSignedIn.
 */
export function useWaitForSignIn(active: boolean, onSignedIn: () => void) {
  useEffect(() => {
    if (!active) return;
    let stopped = false;
    const started = Date.now();
    const tick = async () => {
      if (stopped || Date.now() - started > 15 * 60 * 1000) return;
      try {
        await api("/api/me");
        if (!stopped) onSignedIn();
      } catch {
        /* not signed in yet */
      }
    };
    const id = setInterval(tick, 3000);
    const onFocus = () => tick(); // check immediately when the user comes back to this tab
    window.addEventListener("focus", onFocus);
    return () => {
      stopped = true;
      clearInterval(id);
      window.removeEventListener("focus", onFocus);
    };
  }, [active, onSignedIn]);
}
