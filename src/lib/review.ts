import type { ReviewQueueRow } from "@/lib/supabase/types";

const DAY_MS = 24 * 60 * 60 * 1000;
export const GRADUATE_AFTER = 4;

type QueueState = Pick<ReviewQueueRow, "interval_days" | "correct_in_a_row">;

export type ReviewStep =
  | { action: "upsert"; due_at: string; interval_days: number; correct_in_a_row: number }
  | { action: "delete" }
  | { action: "none" };

/**
 * Leitner-style scheduling.
 * - Any wrong answer: due now, streak reset.
 * - Correct answer during a review: interval doubles (1 → 2 → 4 → 8 days);
 *   after GRADUATE_AFTER correct in a row the question leaves the queue.
 * - Correct answer elsewhere: queue untouched.
 */
export function nextReviewStep(
  existing: QueueState | null,
  correct: boolean,
  isReview: boolean,
  now: Date = new Date(),
): ReviewStep {
  if (!correct) {
    return { action: "upsert", due_at: now.toISOString(), interval_days: 0, correct_in_a_row: 0 };
  }
  if (!isReview || !existing) return { action: "none" };

  const streak = existing.correct_in_a_row + 1;
  if (streak >= GRADUATE_AFTER) return { action: "delete" };
  const interval = existing.interval_days === 0 ? 1 : existing.interval_days * 2;
  return {
    action: "upsert",
    due_at: new Date(now.getTime() + interval * DAY_MS).toISOString(),
    interval_days: interval,
    correct_in_a_row: streak,
  };
}
