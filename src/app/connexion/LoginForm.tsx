"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { t } from "@/i18n";

type State = "idle" | "sending" | "sent" | "error";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        // Only the two seeded users may sign in.
        shouldCreateUser: false,
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    setState(error ? "error" : "sent");
  }

  if (state === "sent")
    return <p className="rounded-card bg-success-soft p-3">{t("login.sent")}</p>;

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <label className="flex flex-col gap-1 text-sm">
        {t("login.email")}
        <input
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="min-h-11 rounded-card border border-border bg-surface px-3 text-base"
        />
      </label>
      {state === "error" ? <p className="text-sm text-notice">{t("login.error")}</p> : null}
      <button type="submit" className="btn" disabled={state === "sending"}>
        {state === "sending" ? t("login.sending") : t("login.submit")}
      </button>
    </form>
  );
}
