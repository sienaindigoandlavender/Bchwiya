import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { cache } from "react";
import { isSupabaseConfigured, supabaseEnv } from "./env";
import type { Database, ProfileRow } from "./types";

/**
 * Server-only Supabase client using the service-role key.
 * Building phase: no login, so every query must filter by `userId` itself.
 */
export function createClient() {
  const { url, serviceKey } = supabaseEnv();
  return createSupabaseClient<Database>(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export type Session = {
  supabase: ReturnType<typeof createClient>;
  userId: string;
  profile: ProfileRow;
};

/**
 * The learner everyone acts as while there is no login.
 * Uses BCHWIYA_LEARNER_ID if set, otherwise the first learner profile.
 * Sends to /un-instant (a calm holding page) when anything is missing.
 */
export const requireSession = cache(async (): Promise<Session> => {
  // Always render on request: her progress must never be frozen at build time.
  await connection();
  if (!isSupabaseConfigured()) redirect("/un-instant");
  const supabase = createClient();

  const pinned = process.env.BCHWIYA_LEARNER_ID;
  const query = supabase.from("bchwiya_profiles").select("*");
  const { data: profile, error } = pinned
    ? await query.eq("id", pinned).maybeSingle()
    : await query
        .eq("role", "learner")
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle();

  // The holding page diagnoses the exact cause itself; Zahra never sees the details.
  if (error || !profile) redirect("/un-instant");
  return { supabase, userId: profile.id, profile };
});

/** Open during the building phase: same session, the dashboard reads the learner's data. */
export const requireAdmin = requireSession;

export type SetupState =
  "no-env" | "no-tables" | "bad-key" | "wrong-key-kind" | "no-profile" | "ok";

/**
 * Which kind of key is configured, without revealing it. A public (anon or
 * publishable) key is blocked by RLS and silently sees zero rows.
 */
function keyKind(key: string): "secret" | "public" | "unknown" {
  if (key.startsWith("sb_secret_")) return "secret";
  if (key.startsWith("sb_publishable_")) return "public";
  try {
    const payload = JSON.parse(Buffer.from(key.split(".")[1] ?? "", "base64url").toString());
    if (payload.role === "service_role") return "secret";
    if (payload.role === "anon") return "public";
  } catch {
    // not a JWT
  }
  return "unknown";
}

/** Checks the database live, for the setup page. Never throws. */
export async function diagnose(): Promise<{
  state: SetupState;
  host: string | null;
  detail?: string;
}> {
  await connection();
  if (!isSupabaseConfigured()) return { state: "no-env", host: null };
  const host = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!).host;
  if (keyKind(process.env.SUPABASE_SERVICE_ROLE_KEY!) === "public") {
    return { state: "wrong-key-kind", host };
  }
  try {
    const { data, error } = await createClient()
      .from("bchwiya_profiles")
      .select("id")
      .eq("role", "learner")
      .limit(1)
      .maybeSingle();
    if (error?.code === "42P01" || error?.code === "PGRST205") return { state: "no-tables", host };
    if (error)
      return { state: "bad-key", host, detail: `${error.code ?? ""} ${error.message}`.trim() };
    return { state: data ? "ok" : "no-profile", host };
  } catch (e) {
    return { state: "bad-key", host, detail: e instanceof Error ? e.message : String(e) };
  }
}
