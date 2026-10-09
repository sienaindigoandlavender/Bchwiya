import type { Content } from "@/content";
import { t, type MessageKey } from "@/i18n";
import { formatMs } from "@/lib/analytics";
import type { EventRow } from "@/lib/supabase/types";

const TZ = "Africa/Casablanca";
/** Gaps longer than this end a study session. */
const SESSION_GAP_MS = 10 * 60_000;

export type Tone = "neutral" | "good" | "soft" | "milestone";
export type JournalLine = { id: number; time: string; text: string; tone: Tone };
export type JournalDay = {
  key: string;
  label: string;
  activeMs: number;
  lessons: number;
  answers: number;
  correct: number;
  lines: JournalLine[];
};

const dayKey = (iso: string) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: TZ, dateStyle: "short" }).format(new Date(iso));
const dayLabel = (iso: string) =>
  new Intl.DateTimeFormat("fr-FR", {
    timeZone: TZ,
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date(iso));
const clock = (iso: string) =>
  new Intl.DateTimeFormat("fr-FR", { timeZone: TZ, hour: "2-digit", minute: "2-digit" }).format(
    new Date(iso),
  );

const str = (v: unknown) => (typeof v === "string" ? v : "");
const short = (s: string, n = 70) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);

/** Screens worth a line of their own (lessons and tests log richer events). */
function pageLabel(path: string, c: Content): string | null {
  if (path === "/") return t("journal.page.home");
  if (path === "/revision") return t("journal.page.review");
  if (path === "/examen-blanc") return t("journal.page.exam");
  if (path === "/ma-voiture") return t("journal.page.car");
  if (path === "/perminou") return t("journal.page.perminou");
  const [, kind, id] = path.split("/");
  if (kind === "niveau" && id) {
    const level = c.levels.find((l) => l.id === id);
    return level ? t("journal.page.level", { title: level.title }) : null;
  }
  if (kind === "module" && id) {
    const mod = c.modules.get(id);
    return mod ? t("journal.page.module", { title: mod.title }) : null;
  }
  return null;
}

const KIND_START: Record<string, MessageKey> = {
  module_test: "journal.start.test",
  review: "journal.start.review",
  mock_exam: "journal.start.exam",
};

function describe(e: EventRow, c: Content): Omit<JournalLine, "id" | "time"> | null {
  const d = e.data ?? {};
  switch (e.type) {
    case "page_view": {
      const label = e.path ? pageLabel(e.path, c) : null;
      return label ? { text: label, tone: "neutral" } : null;
    }
    case "lesson_open": {
      const title = c.lessons.get(str(d.lessonId))?.title ?? str(d.lessonId);
      return { text: t("journal.lesson.open", { title }), tone: "neutral" };
    }
    case "lesson_complete": {
      const title = c.lessons.get(str(d.lessonId))?.title ?? str(d.lessonId);
      return {
        text: t(d.firstTime ? "journal.lesson.done" : "journal.lesson.again", { title }),
        tone: "milestone",
      };
    }
    case "attempt_start": {
      const key = KIND_START[str(d.kind)];
      if (!key) return null; // quick lesson checks: the answers say enough
      const title = c.modules.get(str(d.moduleId))?.title ?? "";
      return { text: t(key, { title }), tone: "neutral" };
    }
    case "answer": {
      const q = c.questions.get(str(d.questionId));
      const changes = Number(d.changes ?? 0);
      const parts = [
        short(q?.prompt ?? str(d.questionId)),
        formatMs(Number(d.timeMs ?? 0)),
        changes > 0 ? t("journal.answer.changed", { count: changes }) : null,
      ].filter(Boolean);
      return {
        text: `${d.correct ? t("journal.answer.right") : t("journal.answer.wrong")} ${parts.join(", ")}`,
        tone: d.correct ? "good" : "soft",
      };
    }
    case "attempt_finish": {
      if (str(d.kind) === "lesson_check") return null;
      const title = c.modules.get(str(d.moduleId))?.title ?? "";
      const score = `${Number(d.score ?? 0)}/${Number(d.total ?? 0)}`;
      const key: MessageKey =
        str(d.kind) === "mock_exam"
          ? "journal.finish.exam"
          : str(d.kind) === "review"
            ? "journal.finish.review"
            : "journal.finish.test";
      const verdict =
        d.passed === true ? t("journal.passed") : d.passed === false ? t("journal.notPassed") : "";
      return {
        text: `${t(key, { title, score })}${verdict ? ` ${verdict}` : ""}`,
        tone: "milestone",
      };
    }
  }
  return null;
}

/** Groups events (newest first) into days with a small summary each. */
export function buildJournal(events: EventRow[], c: Content): JournalDay[] {
  const days = new Map<string, JournalDay>();
  const sorted = [...events].sort((a, b) => a.created_at.localeCompare(b.created_at));
  let prev: EventRow | null = null;

  for (const e of sorted) {
    const key = dayKey(e.created_at);
    let day = days.get(key);
    if (!day) {
      day = {
        key,
        label: dayLabel(e.created_at),
        activeMs: 0,
        lessons: 0,
        answers: 0,
        correct: 0,
        lines: [],
      };
      days.set(key, day);
    }
    if (prev && dayKey(prev.created_at) === key) {
      const gap = Date.parse(e.created_at) - Date.parse(prev.created_at);
      if (gap > 0 && gap < SESSION_GAP_MS) day.activeMs += gap;
    }
    prev = e;

    if (e.type === "lesson_complete" && e.data?.firstTime) day.lessons += 1;
    if (e.type === "answer") {
      day.answers += 1;
      if (e.data?.correct) day.correct += 1;
    }
    const line = describe(e, c);
    if (line) day.lines.push({ id: e.id, time: clock(e.created_at), ...line });
  }

  return [...days.values()]
    .map((d) => ({ ...d, lines: d.lines.reverse() }))
    .sort((a, b) => b.key.localeCompare(a.key));
}
