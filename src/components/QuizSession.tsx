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
      <div className="card flex flex-col gap-3">
        <p>{intro}</p>
        {note ? <p className="text-sm text-muted">{note}</p> : null}
        <button type="button" className="btn self-start" onClick={() => setPhase("running")}>
          {startLabel}
        </button>
      </div>
    );
  }

  if (phase === "done") {
    return (
      <div className="card flex flex-col gap-3">
        <p>{doneMessage}</p>
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
