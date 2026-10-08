"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getContent } from "@/content";
import { nextReviewStep } from "@/lib/review";
import { hasPassed, isCorrect, pct } from "@/lib/scoring";
import { createClient, requireSession } from "@/lib/supabase/server";
import type { AttemptKind } from "@/lib/supabase/types";

export type AnswerInput = {
  attemptId: string;
  questionId: string;
  firstSelection: string[];
  finalSelection: string[];
  changeCount: number;
  timeToFirstMs: number;
  timeToSubmitMs: number;
};

export async function startAttempt(kind: AttemptKind, moduleId: string | null): Promise<string> {
  const { supabase, userId } = await requireSession();
  const { data, error } = await supabase
    .from("attempts")
    .insert({ user_id: userId, kind, module_id: moduleId })
    .select("id")
    .single();
  if (error || !data) throw new Error(error?.message ?? "Could not start attempt");
  return data.id;
}

/** Stores one answer as soon as it is submitted, and updates the review queue. */
export async function recordAnswer(input: AnswerInput): Promise<{ correct: boolean }> {
  const { supabase, userId } = await requireSession();
  const question = getContent().questions.get(input.questionId);
  if (!question) throw new Error(`Unknown question ${input.questionId}`);

  const { data: attempt } = await supabase
    .from("attempts")
    .select("kind")
    .eq("id", input.attemptId)
    .eq("user_id", userId)
    .single();
  if (!attempt) throw new Error("Unknown attempt");

  const correct = isCorrect(question.correct, input.finalSelection);
  const clampMs = (n: number) => Math.max(0, Math.min(Math.round(n), 2_000_000_000));

  const { error } = await supabase.from("answers").insert({
    attempt_id: input.attemptId,
    user_id: userId,
    question_id: question.id,
    rule_ids: question.ruleIds,
    first_selection: input.firstSelection,
    final_selection: input.finalSelection,
    change_count: Math.max(0, Math.round(input.changeCount)),
    correct,
    time_to_first_ms: clampMs(input.timeToFirstMs),
    time_to_submit_ms: clampMs(input.timeToSubmitMs),
  });
  if (error) throw new Error(error.message);

  const { data: existing } = await supabase
    .from("review_queue")
    .select("interval_days, correct_in_a_row")
    .eq("user_id", userId)
    .eq("question_id", question.id)
    .maybeSingle();

  const step = nextReviewStep(existing, correct, attempt.kind === "review");
  if (step.action === "upsert") {
    const { action: _, ...fields } = step;
    await supabase
      .from("review_queue")
      .upsert({ user_id: userId, question_id: question.id, ...fields });
  } else if (step.action === "delete") {
    await supabase
      .from("review_queue")
      .delete()
      .eq("user_id", userId)
      .eq("question_id", question.id);
  }

  return { correct };
}

/**
 * Scores an attempt from its stored answers (last answer per question wins).
 * `total` is the number of questions served, so unanswered ones count as missed.
 */
export async function finishAttempt(
  attemptId: string,
  total: number,
): Promise<{ score: number; total: number; passed: boolean | null }> {
  const { supabase, userId } = await requireSession();
  const { data: attempt } = await supabase
    .from("attempts")
    .select("*")
    .eq("id", attemptId)
    .eq("user_id", userId)
    .single();
  if (!attempt) throw new Error("Unknown attempt");

  const { data: answers } = await supabase
    .from("answers")
    .select("question_id, correct, created_at")
    .eq("attempt_id", attemptId)
    .order("created_at", { ascending: true });

  const last = new Map<string, boolean>();
  for (const a of answers ?? []) last.set(a.question_id, a.correct === true);
  const score = [...last.values()].filter(Boolean).length;
  const safeTotal = Math.max(total, last.size);
  const passed = hasPassed(attempt.kind, score, safeTotal);

  await supabase
    .from("attempts")
    .update({ finished_at: new Date().toISOString(), score, total: safeTotal, passed })
    .eq("id", attemptId);

  if (attempt.kind === "module_test" && attempt.module_id) {
    const { data: prev } = await supabase
      .from("module_progress")
      .select("best_score_pct, passed_at")
      .eq("user_id", userId)
      .eq("module_id", attempt.module_id)
      .maybeSingle();
    const scorePct = pct(score, safeTotal);
    await supabase.from("module_progress").upsert({
      user_id: userId,
      module_id: attempt.module_id,
      best_score_pct: Math.max(scorePct, prev?.best_score_pct ?? 0),
      passed_at: prev?.passed_at ?? (passed ? new Date().toISOString() : null),
    });
  }

  revalidatePath("/", "layout");
  return { score, total: safeTotal, passed };
}

export async function recordLessonVisit(lessonId: string): Promise<void> {
  const { supabase, userId } = await requireSession();
  if (!getContent().lessons.has(lessonId)) return;
  const { data } = await supabase
    .from("lesson_progress")
    .select("visits")
    .eq("user_id", userId)
    .eq("lesson_id", lessonId)
    .maybeSingle();
  if (data) {
    await supabase
      .from("lesson_progress")
      .update({ visits: data.visits + 1 })
      .eq("user_id", userId)
      .eq("lesson_id", lessonId);
  } else {
    await supabase.from("lesson_progress").insert({ user_id: userId, lesson_id: lessonId, visits: 1 });
  }
}

export async function completeLesson(lessonId: string): Promise<void> {
  const { supabase, userId } = await requireSession();
  if (!getContent().lessons.has(lessonId)) return;
  const { data } = await supabase
    .from("lesson_progress")
    .select("completed_at")
    .eq("user_id", userId)
    .eq("lesson_id", lessonId)
    .maybeSingle();
  if (data?.completed_at) return;
  if (data) {
    await supabase
      .from("lesson_progress")
      .update({ completed_at: new Date().toISOString() })
      .eq("user_id", userId)
      .eq("lesson_id", lessonId);
  } else {
    await supabase.from("lesson_progress").insert({
      user_id: userId,
      lesson_id: lessonId,
      visits: 1,
      completed_at: new Date().toISOString(),
    });
  }
  revalidatePath("/", "layout");
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/connexion");
}
