import type { Content } from "@/content";

export type Status = "locked" | "available" | "in_progress" | "done";

export type LessonState = { id: string; title: string; minutes: number; status: Status };

export type ModuleState = {
  id: string;
  title: string;
  levelId: string;
  status: Status;
  hasTest: boolean;
  allLessonsDone: boolean;
  bestScorePct: number | null;
  lessons: LessonState[];
};

export type LevelState = { id: string; title: string; status: Status; modules: ModuleState[] };

export type UserProgress = {
  completedLessons: Set<string>;
  passedModules: Set<string>;
  attemptedModules: Set<string>;
  bestScores: Map<string, number>;
};

/**
 * Derives the learning path from content + progress.
 *
 * Unlock rule: modules open in order. A module with a test blocks everything after it
 * until it is passed. A module without questions (placeholder content) never blocks,
 * and counts as done once its lessons are done. Inside a module, lessons open in order.
 */
export function computePath(content: Content, p: UserProgress): LevelState[] {
  let blocked = false;

  return content.levels.map((level) => {
    const modules: ModuleState[] = level.modules.map((mod) => {
      const hasTest = (content.questionsByModule.get(mod.id)?.length ?? 0) > 0;
      const lessonDone = mod.lessonIds.map((id) => p.completedLessons.has(id));
      const allLessonsDone = lessonDone.every(Boolean);
      const done = hasTest ? p.passedModules.has(mod.id) : allLessonsDone;
      const started = lessonDone.some(Boolean) || p.attemptedModules.has(mod.id);

      const status: Status = blocked
        ? "locked"
        : done
          ? "done"
          : started
            ? "in_progress"
            : "available";

      const firstOpen = lessonDone.indexOf(false);
      const lessons: LessonState[] = mod.lessonIds.map((id, i) => {
        const lesson = content.lessons.get(id);
        return {
          id,
          title: lesson?.title ?? id,
          minutes: lesson?.minutes ?? 5,
          status:
            status === "locked"
              ? "locked"
              : lessonDone[i]
                ? "done"
                : i === firstOpen
                  ? "available"
                  : "locked",
        };
      });

      if (hasTest && !p.passedModules.has(mod.id)) blocked = true;

      return {
        id: mod.id,
        title: mod.title,
        levelId: level.id,
        status,
        hasTest,
        allLessonsDone,
        bestScorePct: p.bestScores.get(mod.id) ?? null,
        lessons,
      };
    });

    const statuses = modules.map((m) => m.status);
    const levelStatus: Status = statuses.every((s) => s === "locked")
      ? "locked"
      : statuses.every((s) => s === "done")
        ? "done"
        : statuses.some((s) => s === "done" || s === "in_progress")
          ? "in_progress"
          : "available";

    return { id: level.id, title: level.title, status: levelStatus, modules };
  });
}

export type ResumeTarget =
  | { kind: "lesson"; moduleId: string; lessonId: string; title: string }
  | { kind: "test"; moduleId: string; title: string }
  | { kind: "done" };

/** Where to pick up: the module touched most recently if unfinished, else the next open one. */
export function resumeTarget(path: LevelState[], lastModuleId: string | null): ResumeTarget {
  const modules = path.flatMap((l) => l.modules);
  const last = modules.find(
    (m) => m.id === lastModuleId && m.status !== "done" && m.status !== "locked",
  );
  const target =
    last ?? modules.find((m) => m.status === "in_progress" || m.status === "available");
  if (!target) return { kind: "done" };

  const nextLesson = target.lessons.find((l) => l.status === "available");
  if (nextLesson) {
    return {
      kind: "lesson",
      moduleId: target.id,
      lessonId: nextLesson.id,
      title: nextLesson.title,
    };
  }
  return { kind: "test", moduleId: target.id, title: target.title };
}

export function findModule(path: LevelState[], moduleId: string): ModuleState | undefined {
  return path.flatMap((l) => l.modules).find((m) => m.id === moduleId);
}
