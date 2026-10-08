"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { finishAttempt, recordAnswer, startAttempt, type AnswerInput } from "@/app/actions";
import type { Question } from "@/content/schema";
import { QuestionCard, type AnswerMetrics } from "@/components/QuestionCard";
import { t } from "@/i18n";
import type { AttemptKind } from "@/lib/supabase/types";

export type QuizResult = {
  attemptId: string;
  score: number;
  total: number;
  passed: boolean | null;
  timedOut: boolean;
};

type Props = {
  kind: AttemptKind;
  moduleId: string | null;
  questions: Question[];
  feedback?: boolean;
  /** Countdown in minutes (mock exam only). */
  timerMinutes?: number;
  onComplete: (result: QuizResult) => void;
};

/**
 * Runs a sequence of questions as one attempt. Each answer is sent to Supabase as soon
 * as it is submitted; failed writes are kept and retried on the next action.
 */
export function QuizRunner({
  kind,
  moduleId,
  questions,
  feedback = true,
  timerMinutes,
  onComplete,
}: Props) {
  const [index, setIndex] = useState(0);
  const [saveError, setSaveError] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const attemptId = useRef<Promise<string> | null>(null);
  const pending = useRef<Omit<AnswerInput, "attemptId">[]>([]);
  const finished = useRef(false);

  const ensureAttempt = useCallback(() => {
    attemptId.current ??= startAttempt(kind, moduleId);
    return attemptId.current;
  }, [kind, moduleId]);

  useEffect(() => {
    void ensureAttempt().catch(() => setSaveError(true));
  }, [ensureAttempt]);

  const flush = useCallback(async () => {
    let id: string;
    try {
      id = await ensureAttempt();
    } catch {
      attemptId.current = null; // retry creating the attempt next time
      setSaveError(true);
      return false;
    }
    while (pending.current.length) {
      const next = pending.current[0]!;
      try {
        await recordAnswer({ ...next, attemptId: id });
        pending.current.shift();
        setSaveError(false);
      } catch {
        setSaveError(true);
        return false;
      }
    }
    return true;
  }, [ensureAttempt]);

  const finish = useCallback(
    async (timedOut: boolean) => {
      if (finished.current) return;
      finished.current = true;
      setFinishing(true);
      // Keep trying until every answer is stored: nothing should be lost.
      while (!(await flush())) await new Promise((r) => setTimeout(r, 3000));
      const id = await ensureAttempt();
      const res = await finishAttempt(id, questions.length);
      onComplete({ attemptId: id, ...res, timedOut });
    },
    [ensureAttempt, flush, onComplete, questions.length],
  );

  // Mock exam countdown. Unlike hesitation timing, it keeps running when the tab is hidden.
  const [remaining, setRemaining] = useState(timerMinutes ? timerMinutes * 60 : 0);
  useEffect(() => {
    if (!timerMinutes) return;
    const end = Date.now() + timerMinutes * 60_000;
    const id = setInterval(() => {
      const left = Math.max(0, Math.round((end - Date.now()) / 1000));
      setRemaining(left);
      if (left === 0) {
        clearInterval(id);
        void finish(true);
      }
    }, 1000);
    return () => clearInterval(id);
  }, [timerMinutes, finish]);

  function handleSubmit(m: AnswerMetrics) {
    pending.current.push({
      questionId: m.questionId,
      firstSelection: m.firstSelection,
      finalSelection: m.finalSelection,
      changeCount: m.changeCount,
      timeToFirstMs: m.timeToFirstMs,
      timeToSubmitMs: m.timeToSubmitMs,
    });
    void flush();
  }

  function handleNext() {
    if (index + 1 < questions.length) setIndex(index + 1);
    else void finish(false);
  }

  const question = questions[index];
  if (!question) return null;
  const isLast = index + 1 === questions.length;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between text-sm text-muted">
        <span>{t("question.count", { current: index + 1, total: questions.length })}</span>
        {timerMinutes ? (
          <span aria-live="off">
            {t("exam.timeLeft", {
              time: `${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, "0")}`,
            })}
          </span>
        ) : null}
      </div>
      {saveError ? <p className="text-sm text-notice">{t("question.saveError")}</p> : null}
      {finishing ? (
        <p className="text-muted">{t("question.saving")}</p>
      ) : (
        <QuestionCard
          key={question.id}
          question={question}
          feedback={feedback}
          onSubmit={handleSubmit}
          onNext={handleNext}
          nextLabel={isLast ? t("question.finish") : undefined}
        />
      )}
    </div>
  );
}
