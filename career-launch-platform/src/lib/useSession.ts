import { useCallback, useEffect, useState } from "react";
import { api } from "./api";

/** Is the visitor signed in to the student portal? (checks the session cookie via /api/me) */
export function useSession() {
  const [state, setState] = useState<"loading" | "in" | "out">("loading");

  const refresh = useCallback(() => {
    api("/api/me")
      .then(() => setState("in"))
      .catch(() => setState("out"));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const signOut = useCallback(async () => {
    try {
      await api("/api/me/logout", { method: "POST" });
    } finally {
      setState("out");
    }
  }, []);

  return { signedIn: state === "in", loading: state === "loading", refresh, signOut };
}
