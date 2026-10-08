"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { completeLesson, recordLessonVisit } from "@/app/actions";
import type { Lesson, Question } from "@/content/schema";
import { Media } from "@/components/diagrams/Media";
import { QuizRunner } from "@/components/QuizRunner";
import { BackIcon, Sparkle } from "@/components/ui/Icons";
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
      <div className="flex flex-col gap-5">
        <p className="rounded-card bg-sky px-5 py-4 font-medium">{t("lesson.checksIntro")}</p>
        <QuizRunner
          kind="lesson_check"
          moduleId={lesson.moduleId}
          questions={checks}
          onComplete={finishLesson}
        />
      </div>
    );
  }

  if (phase === "done") {
    return (
      <div className="flex flex-col items-start gap-5 rounded-big bg-mint p-6">
        <Sparkle size={22} className="text-success" />
        <p className="title text-[2.25rem]">{t("lesson.done")}</p>
        <div className="flex w-full flex-col gap-3">
          {next ? (
            <Link href={next.href} className="btn">
              {next.label}
            </Link>
          ) : null}
          <Link href={moduleHref} className="btn btn-secondary bg-paper">
            {t("lesson.backToModule")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col gap-5"
      onTouchStart={(e) => (touchX.current = e.touches[0]?.clientX ?? null)}
      onTouchEnd={onTouchEnd}
    >
      <div
        className="flex gap-1.5"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={index + 1}
        aria-label={t("lesson.progress", { current: index + 1, total })}
      >
        {lesson.screens.map((_, i) => (
          <span
            key={i}
            className={`h-2 flex-1 rounded-full transition-colors ${i <= index ? "bg-rose" : "bg-cloud"}`}
          />
        ))}
      </div>

      {screen ? (
        <div
          key={index}
          className={`flex min-h-72 flex-col gap-4 rounded-big p-6 ${
            screen.type === "keypoint" ? "bg-lilac" : "bg-cloud"
          }`}
        >
          {screen.type === "keypoint" ? (
            <span className="pill self-start bg-paper text-ink">
              <Sparkle size={12} className="text-rose" />
              {t("lesson.keypoint")}
            </span>
          ) : null}
          <Media media={screen.media} />
          <p className="font-serif text-[1.375rem] leading-[1.45] text-ink">{screen.body}</p>
        </div>
      ) : null}

      <div className="flex gap-3">
        <button
          type="button"
          className="btn btn-secondary px-5"
          onClick={goPrev}
          disabled={index === 0}
          aria-label={t("lesson.prev")}
        >
          <BackIcon size={20} />
        </button>
        <button type="button" className="btn flex-1" onClick={goNext}>
          {index + 1 < total
            ? t("lesson.next")
            : checks.length
              ? t("lesson.toChecks")
              : t("lesson.finish")}
        </button>
      </div>
    </div>
  );
}
