import { QuizSession } from "@/components/QuizSession";
import { PageHeader } from "@/components/ui/PageHeader";
import { WallE } from "@/components/ui/WallE";
import { getContent } from "@/content";
import { t } from "@/i18n";
import { MOCK_EXAM, shuffle } from "@/lib/scoring";

export const dynamic = "force-dynamic";

export default function MockExamPage() {
  const all = [...getContent().questions.values()];
  const questions = shuffle(all).slice(0, MOCK_EXAM.questions);
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
          timerMinutes={MOCK_EXAM.minutes}
          intro={t("exam.intro", { count: questions.length, minutes: MOCK_EXAM.minutes, pass })}
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
