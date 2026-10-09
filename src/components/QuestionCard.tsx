"use client";

import { useRef, useState } from "react";
import type { Question } from "@/content/schema";
import { Media } from "@/components/diagrams/Media";
import { CheckIcon, Sparkle } from "@/components/ui/Icons";
import { useActiveTimer } from "@/components/useActiveTimer";
import { t } from "@/i18n";
import { isCorrect } from "@/lib/scoring";

export type AnswerMetrics = {
  questionId: string;
  firstSelection: string[];
  finalSelection: string[];
  changeCount: number;
  timeToFirstMs: number;
  timeToSubmitMs: number;
  correct: boolean;
};

type Props = {
  question: Question;
  /** Show the correction right after submitting (off in the mock exam). */
  feedback?: boolean;
  onSubmit: (metrics: AnswerMetrics) => void;
  onNext: () => void;
  nextLabel?: string;
};

/**
 * One question, single- or multi-answer. Captures hesitation metrics:
 * time to first tap, time to submit (both excluding hidden-tab time),
 * the selection before her first change of mind, and how often she changed it.
 * A "change" is any tap that removes an option she had selected.
 * Render with a `key` per question so state resets.
 */
export function QuestionCard({ question, feedback = true, onSubmit, onNext, nextLabel }: Props) {
  const multi = question.correct.length > 1;
  const timer = useActiveTimer();
  const [selection, setSelection] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const firstTapMs = useRef<number | null>(null);
  const firstSelection = useRef<string[] | null>(null);
  const changeCount = useRef(0);

  function toggle(optionId: string) {
    if (submitted) return;
    firstTapMs.current ??= timer.elapsed();

    let next: string[];
    if (multi) {
      next = selection.includes(optionId)
        ? selection.filter((id) => id !== optionId)
        : [...selection, optionId];
    } else {
      if (selection[0] === optionId) return;
      next = [optionId];
    }

    const removedSomething = selection.some((id) => !next.includes(id));
    if (removedSomething) {
      firstSelection.current ??= selection;
      changeCount.current += 1;
    }
    setSelection(next);
  }

  function submit() {
    if (submitted || selection.length === 0) return;
    const submitMs = timer.elapsed();
    const correct = isCorrect(question.correct, selection);
    setSubmitted(true);
    onSubmit({
      questionId: question.id,
      firstSelection: firstSelection.current ?? selection,
      finalSelection: selection,
      changeCount: changeCount.current,
      timeToFirstMs: firstTapMs.current ?? submitMs,
      timeToSubmitMs: submitMs,
      correct,
    });
    if (!feedback) onNext();
  }

  const showFeedback = submitted && feedback;
  const correct = isCorrect(question.correct, selection);
  const correctText = question.options
    .filter((o) => question.correct.includes(o.id))
    .map((o) => o.text)
    .join(" / ");

  return (
    <div className="fade-in flex flex-col gap-5">
      {question.media && question.media.kind !== "none" ? (
        <div className="rounded-big bg-cloud p-4">
          <Media media={question.media} />
        </div>
      ) : null}
      <div className="flex flex-col gap-2">
        <p className="font-serif text-[1.5rem] leading-[1.3] text-ink">{question.prompt}</p>
        <span className="pill self-start bg-cloud text-ink-soft">
          {multi ? t("question.multi") : t("question.single")}
        </span>
      </div>

      <ul className="flex flex-col gap-2.5" role={multi ? "group" : "radiogroup"}>
        {question.options.map((o, i) => {
          const picked = selection.includes(o.id);
          const isRight = question.correct.includes(o.id);
          let tone = picked ? "bg-blush ring-2 ring-rose" : "bg-cloud";
          let bubble = picked ? "bg-rose text-rose-ink" : "bg-paper text-ink";
          if (showFeedback && isRight) {
            tone = "bg-mint";
            bubble = "bg-success text-paper";
          } else if (showFeedback && picked) {
            tone = "bg-butter";
            bubble = "bg-paper text-ink";
          } else if (showFeedback) {
            tone = "bg-cloud";
          }
          return (
            <li key={o.id}>
              <button
                type="button"
                role={multi ? "checkbox" : "radio"}
                aria-checked={picked}
                disabled={submitted}
                onClick={() => toggle(o.id)}
                className={`flex min-h-14 w-full items-center gap-3.5 rounded-card px-4 py-3 text-start text-[1.0625rem] text-ink ring-inset transition-colors ${tone}`}
              >
                <span
                  aria-hidden
                  className={`flex size-8 shrink-0 items-center justify-center text-[1rem] font-semibold ${multi ? "rounded-[10px]" : "rounded-full"} ${bubble}`}
                >
                  {showFeedback && isRight ? <CheckIcon size={16} /> : String.fromCharCode(65 + i)}
                </span>
                <span>{o.text}</span>
              </button>
            </li>
          );
        })}
      </ul>

      {showFeedback ? (
        <div
          className={`flex flex-col gap-2 rounded-big p-5 ${correct ? "bg-mint" : "bg-butter"}`}
          aria-live="polite"
        >
          <p className="title flex items-center gap-2 text-[1.625rem]">
            {correct ? <Sparkle size={16} className="text-success" /> : null}
            {correct ? t("question.correct") : t("question.incorrect")}
          </p>
          {!correct ? (
            <p className="font-semibold">{t("question.answerWas", { answer: correctText })}</p>
          ) : null}
          <p className="text-[1rem] leading-relaxed">{question.explanation}</p>
        </div>
      ) : null}

      {!submitted ? (
        <button type="button" className="btn" disabled={selection.length === 0} onClick={submit}>
          {t("question.submit")}
        </button>
      ) : showFeedback ? (
        <button type="button" className="btn" onClick={onNext}>
          {nextLabel ?? t("question.next")}
        </button>
      ) : null}
    </div>
  );
}
