"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { completeLesson, recordLessonVisit } from "@/app/actions";
import type { Lesson, Question } from "@/content/schema";
import { Media } from "@/components/diagrams/Media";
import { QuizRunner } from "@/components/QuizRunner";
import { t } from "@/i18n";

type Props = {
  lesson: Lesson;
  checks: Question[];
  moduleHref: string;
  next: { href: string; label: string } | null;
};

type Phase = "screens" | "checks" | "done";

/** Screen-by-screen lesson with a progress bar. Tap the buttons or swipe. Then quick checks. */
export function LessonPlayer({ lesson, checks, moduleHref, next }: Props) {
  const [phase, setPhase] = useState<Phase>("screens");
  const [index, setIndex] = useState(0);
  const touchX = useRef<number | null>(null);
  const visited = useRef(false);

  useEffect(() => {
    if (visited.current) return;
    visited.current = true;
    void recordLessonVisit(lesson.id);
  }, [lesson.id]);

  const total = lesson.screens.length;
  const screen = lesson.screens[index];

  function finishLesson() {
    setPhase("done");
    void completeLesson(lesson.id);
  }

  function goNext() {
    if (index + 1 < total) setIndex(index + 1);
    else if (checks.length) setPhase("checks");
    else finishLesson();
  }
  function goPrev() {
    if (index > 0) setIndex(index - 1);
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (touchX.current === null) return;
    const dx = (e.changedTouches[0]?.clientX ?? touchX.current) - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) < 50) return;
    // In RTL, swiping right moves forward.
    const forward = document.documentElement.dir === "rtl" ? dx > 0 : dx < 0;
    if (forward) goNext();
    else goPrev();
  }

  if (phase === "checks") {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-muted">{t("lesson.checksIntro")}</p>
        <QuizRunner kind="lesson_check" moduleId={lesson.moduleId} questions={checks} onComplete={finishLesson} />
      </div>
    );
  }

  if (phase === "done") {
    return (
      <div className="card flex flex-col gap-4">
        <p className="text-lg font-semibold">{t("lesson.done")}</p>
        {next ? (
          <Link href={next.href} className="btn">
            {next.label}
          </Link>
        ) : null}
        <Link href={moduleHref} className="btn btn-secondary">
          {t("lesson.backToModule")}
        </Link>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col gap-4"
      onTouchStart={(e) => (touchX.current = e.touches[0]?.clientX ?? null)}
      onTouchEnd={onTouchEnd}
    >
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-surface-muted"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={index + 1}
        aria-label={t("lesson.progress", { current: index + 1, total })}
      >
        <div className="h-full bg-accent transition-all" style={{ width: `${((index + 1) / total) * 100}%` }} />
      </div>

      {screen ? (
        <div className={`card flex min-h-64 flex-col gap-3 ${screen.type === "keypoint" ? "bg-accent-soft" : ""}`}>
          {screen.type === "keypoint" ? (
            <p className="text-sm font-semibold uppercase tracking-wide text-accent">{t("lesson.keypoint")}</p>
          ) : null}
          <Media media={screen.media} />
          <p className="text-lg leading-relaxed">{screen.body}</p>
        </div>
      ) : null}

      <div className="flex gap-3">
        <button type="button" className="btn btn-secondary flex-1" onClick={goPrev} disabled={index === 0}>
          {t("lesson.prev")}
        </button>
        <button type="button" className="btn flex-1" onClick={goNext}>
          {index + 1 < total ? t("lesson.next") : checks.length ? t("lesson.toChecks") : t("lesson.next")}
        </button>
      </div>
    </div>
  );
}
