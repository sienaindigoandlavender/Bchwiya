import Link from "next/link";
import { getContent } from "@/content";
import { t } from "@/i18n";
import { requireSession } from "@/lib/supabase/server";

export default async function MockExamResultPage({
  params,
}: {
  params: Promise<{ attemptId: string }>;
}) {
  const { attemptId } = await params;
  const { supabase, userId } = await requireSession();
  const [{ data: attempt }, { data: answers }] = await Promise.all([
    supabase.from("attempts").select("*").eq("id", attemptId).eq("user_id", userId).maybeSingle(),
    supabase
      .from("answers")
      .select("question_id, correct, final_selection")
      .eq("attempt_id", attemptId)
      .order("created_at", { ascending: true }),
  ]);
  if (!attempt || attempt.kind !== "mock_exam") {
    return <p className="text-muted">{t("result.notFound")}</p>;
  }

  const content = getContent();
  const missed = (answers ?? [])
    .filter((a) => !a.correct)
    .map((a) => content.questions.get(a.question_id))
    .filter((q) => q !== undefined);

  return (
    <>
      <h1 className="text-2xl font-semibold">{t("exam.title")}</h1>
      <section className={`card flex flex-col gap-2 ${attempt.passed ? "bg-success-soft" : ""}`}>
        <p className="text-3xl font-semibold">
          {t("result.score", { score: attempt.score ?? 0, total: attempt.total ?? 0 })}
        </p>
        <p>{attempt.passed ? t("exam.passed") : t("exam.notPassed")}</p>
      </section>
      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">{t("exam.corrections")}</h2>
        {missed.length === 0 ? (
          <p className="text-muted">{t("result.allCorrect")}</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {missed.map((q) => (
              <li key={q.id} className="card flex flex-col gap-1">
                <p className="font-medium">{q.prompt}</p>
                <p className="text-sm">
                  {t("question.answerWas", {
                    answer: q.options
                      .filter((o) => q.correct.includes(o.id))
                      .map((o) => o.text)
                      .join(" · "),
                  })}
                </p>
                <p className="text-sm text-muted">{q.explanation}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
      <Link href="/" className="btn self-start">
        {t("result.home")}
      </Link>
    </>
  );
}
