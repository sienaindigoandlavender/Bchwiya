import "server-only";
import type { Session } from "@/lib/supabase/server";
import type { EventType } from "@/lib/supabase/types";

/**
 * Writes one line to Zahra's journal. Never throws: a journal hiccup must
 * never interrupt her lesson.
 */
export async function logEvent(
  { supabase, userId }: Pick<Session, "supabase" | "userId">,
  type: EventType,
  data: Record<string, unknown> = {},
  path: string | null = null,
): Promise<void> {
  try {
    await supabase.from("bchwiya_events").insert({ user_id: userId, type, data, path });
  } catch {
    // ignore
  }
}
