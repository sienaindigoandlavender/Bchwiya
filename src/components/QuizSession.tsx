"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Question } from "@/content/schema";
import { QuizRunner } from "@/components/QuizRunner";
import { t } from "@/i18n";
import type { AttemptKind } from "@/lib/supabase/types";

type Props = {
  kind: AttemptKind;
  moduleId: string | null;
  questions: Question[];
  intro: string;
  note?: string;
  startLabel: string;
  feedback?: boolean;
  timerMinutes?: number;
  /** Navigate here when finished (`{attemptId}` is replaced). Otherwise show doneMessage. */
  resultHref?: string;
  doneMessage?: string;
};

/** Intro card → questions → result page (or an inline closing message). */
export function QuizSession({
  intro,
  note,
  startLabel,
  resultHref,
  doneMessage,
  ...runner
}: Props) {
  const router = useRouter();
  const [phase, setPhase] = useState<"intro" | "running" | "done">("intro");

  if (phase === "intro") {
    return (
      <div className="flex flex-col gap-5 rounded-big bg-blush p-6">
        <p className="font-serif text-[1.375rem] leading-[1.45]">{intro}</p>
        {note ? <p className="rounded-card bg-paper px-4 py-3 text-[1rem]">{note}</p> : null}
        <button type="button" className="btn self-start" onClick={() => setPhase("running")}>
          {startLabel}
        </button>
      </div>
    );
  }

  if (phase === "done") {
    return (
      <div className="flex flex-col items-start gap-5 rounded-big bg-mint p-6">
        <p className="title text-[2rem]">{doneMessage}</p>
        <Link href="/" className="btn self-start">
          {t("result.home")}
        </Link>
      </div>
    );
  }

  return (
    <QuizRunner
      {...runner}
      onComplete={({ attemptId }) => {
        if (resultHref) {
          router.push(resultHref.replace("{attemptId}", attemptId));
          router.refresh();
        } else {
          setPhase("done");
          router.refresh();
        }
      }}
    />
  );
}
