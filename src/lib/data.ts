import "server-only";
import { getContent } from "@/content";
import { computePath, type LevelState, type UserProgress } from "@/lib/progress";
import type { Session } from "@/lib/supabase/server";

export type PathData = {
  path: LevelState[];
  progress: UserProgress;
  lastModuleId: string | null;
  lastActivityAt: string | null;
};

/** Loads a user's progress rows and derives the path. */
export async function loadPath({
  supabase,
  userId,
}: Pick<Session, "supabase" | "userId">): Promise<PathData> {
  const content = getContent();
  const [lessons, modules, attempts] = await Promise.all([
    supabase
      .from("bchwiya_lesson_progress")
      .select("lesson_id, completed_at")
      .eq("user_id", userId),
    supabase
      .from("bchwiya_module_progress")
      .select("module_id, best_score_pct, passed_at")
      .eq("user_id", userId),
    supabase
      .from("bchwiya_attempts")
      .select("module_id, started_at")
      .eq("user_id", userId)
      .not("module_id", "is", null)
      .order("started_at", { ascending: false })
      .limit(50),
  ]);

  const progress: UserProgress = {
    completedLessons: new Set(
      (lessons.data ?? []).filter((r) => r.completed_at).map((r) => r.lesson_id),
    ),
    passedModules: new Set((modules.data ?? []).filter((r) => r.passed_at).map((r) => r.module_id)),
    attemptedModules: new Set((attempts.data ?? []).map((r) => r.module_id!)),
    bestScores: new Map(
      (modules.data ?? [])
        .filter((r) => r.best_score_pct !== null)
        .map((r) => [r.module_id, r.best_score_pct!]),
    ),
  };

  // Most recent activity: latest completed lesson or latest module attempt.
  let lastAt: string | null = null;
  let lastModuleId: string | null = null;
  for (const r of lessons.data ?? []) {
    if (r.completed_at && (!lastAt || r.completed_at > lastAt)) {
      lastAt = r.completed_at;
      lastModuleId = content.lessons.get(r.lesson_id)?.moduleId ?? null;
    }
  }
  const latestAttempt = attempts.data?.[0];
  if (latestAttempt && (!lastAt || latestAttempt.started_at > lastAt)) {
    lastAt = latestAttempt.started_at;
    lastModuleId = latestAttempt.module_id;
  }

  return { path: computePath(content, progress), progress, lastModuleId, lastActivityAt: lastAt };
}
