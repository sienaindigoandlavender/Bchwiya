import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
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
 * Sends to /configuration when the database or the profile is missing.
 */
export const requireSession = cache(async (): Promise<Session> => {
  if (!isSupabaseConfigured()) redirect("/configuration");
  const supabase = createClient();

  const pinned = process.env.BCHWIYA_LEARNER_ID;
  const query = supabase.from("bchwiya_profiles").select("*");
  const { data: profile } = pinned
    ? await query.eq("id", pinned).maybeSingle()
    : await query
        .eq("role", "learner")
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle();

  if (!profile) redirect("/configuration?manque=profil");
  return { supabase, userId: profile.id, profile };
});

/** Open during the building phase: same session, the dashboard reads the learner's data. */
export const requireAdmin = requireSession;
