import type { AttemptKind } from "@/lib/supabase/types";

export const MODULE_PASS_PCT = 80;
export const MODULE_TEST_SIZE = 10;
export const MOCK_EXAM = { questions: 40, minutes: 40, passScore: 32 } as const;

/** Exact-set match: every correct option picked, nothing else. */
export function isCorrect(correct: readonly string[], selection: readonly string[]): boolean {
  const want = new Set(correct);
  const got = new Set(selection);
  return want.size === got.size && [...want].every((id) => got.has(id));
}

export function pct(score: number, total: number): number {
  return total === 0 ? 0 : Math.round((score / total) * 100);
}

export function hasPassed(kind: AttemptKind, score: number, total: number): boolean | null {
  switch (kind) {
    case "module_test":
      return total > 0 && pct(score, total) >= MODULE_PASS_PCT;
    case "mock_exam":
      // Real exam: 32/40. With a smaller pool, keep the same 80% ratio.
      return total === MOCK_EXAM.questions
        ? score >= MOCK_EXAM.passScore
        : total > 0 && score / total >= MOCK_EXAM.passScore / MOCK_EXAM.questions;
    default:
      return null;
  }
}

export function shuffle<T>(items: readonly T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}
