import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { cache } from "react";
import { isSupabaseConfigured } from "./env";
import type { Database, ProfileRow } from "./types";

/**
 * Server-only client with the service role key. There is no login: the app has one
 * learner, and the key never reaches the browser.
 */
function createClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}

export type Session = {
  supabase: ReturnType<typeof createClient>;
  userId: string;
  profile: ProfileRow;
};

/** Zahra's profile, created on first visit. Sends to /bientot until the database is set up. */
export const requireSession = cache(async (): Promise<Session> => {
  if (!isSupabaseConfigured()) redirect("/bientot");
  const supabase = createClient();

  const { data: existing, error } = await supabase
    .from("bchwiya_profiles")
    .select("*")
    .eq("role", "learner")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (error) throw new Error(error.message);

  let profile = existing;
  if (!profile) {
    const { data, error: insertError } = await supabase
      .from("bchwiya_profiles")
      .insert({ role: "learner", display_name: "Zahra" })
      .select("*")
      .single();
    if (insertError) throw new Error(insertError.message);
    profile = data;
  }
  return { supabase, userId: profile.id, profile };
});

/** The admin dashboard has no login either; it is reachable by URL only. */
export const requireAdmin = requireSession;
