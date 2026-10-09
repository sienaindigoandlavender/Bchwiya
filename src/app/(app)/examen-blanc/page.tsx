import { QuizSession } from "@/components/QuizSession";
import { loadPath } from "@/lib/data";
import { requireSession } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui/PageHeader";
import { WallE } from "@/components/ui/WallE";
import { getContent } from "@/content";
import { t } from "@/i18n";
import { MOCK_EXAM, shuffle } from "@/lib/scoring";

export const dynamic = "force-dynamic";

export default async function MockExamPage() {
  // Only what she has already studied: a module counts once all its lessons are done.
  const { path } = await loadPath(await requireSession());
  const studied = new Set(
    path
      .flatMap((l) => l.modules)
      .filter((m) => m.allLessonsDone)
      .map((m) => m.id),
  );
  const all = [...getContent().questions.values()].filter((q) => studied.has(q.moduleId));
  const questions = shuffle(all).slice(0, MOCK_EXAM.questions);
  // Same pace as the real exam: one minute per question.
  const minutes = Math.round((questions.length * MOCK_EXAM.minutes) / MOCK_EXAM.questions);
  const pass =
    questions.length === MOCK_EXAM.questions
      ? MOCK_EXAM.passScore
      : Math.ceil((questions.length * MOCK_EXAM.passScore) / MOCK_EXAM.questions);

  return (
    <>
      <PageHeader title={t("exam.title")} />
      {questions.length === 0 ? (
        <p className="card">{t("exam.empty")}</p>
      ) : (
        <QuizSession
          kind="mock_exam"
          moduleId={null}
          questions={questions}
          feedback={false}
          timerMinutes={minutes}
          intro={t("exam.intro", { count: questions.length, minutes, pass })}
          note={
            questions.length < MOCK_EXAM.questions
              ? t("exam.fewQuestions", { count: questions.length })
              : undefined
          }
          startLabel={t("exam.start")}
          resultHref="/examen-blanc/resultat/{attemptId}"
          illustration={<WallE pose="sit-curious" height={200} className="self-center" />}
        />
      )}
    </>
  );
}
