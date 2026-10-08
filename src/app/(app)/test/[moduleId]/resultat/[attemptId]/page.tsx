import Link from "next/link";
import { notFound } from "next/navigation";
import { getContent, lessonsForRules } from "@/content";
import { t } from "@/i18n";
import { requireSession } from "@/lib/supabase/server";

export default async function ModuleResultPage({
  params,
}: {
  params: Promise<{ moduleId: string; attemptId: string }>;
}) {
  const { moduleId, attemptId } = await params;
  const { supabase, userId } = await requireSession();
  const content = getContent();
  const mod = content.modules.get(moduleId);
  if (!mod) notFound();

  const [{ data: attempt }, { data: answers }] = await Promise.all([
    supabase.from("attempts").select("*").eq("id", attemptId).eq("user_id", userId).maybeSingle(),
    supabase
      .from("answers")
      .select("question_id, correct, created_at")
      .eq("attempt_id", attemptId)
      .order("created_at", { ascending: true }),
  ]);
  if (!attempt || attempt.module_id !== moduleId) {
    return <p className="text-muted">{t("result.notFound")}</p>;
  }

  // Last answer per question wins.
  const last = new Map<string, boolean>();
  for (const a of answers ?? []) last.set(a.question_id, a.correct === true);
  const missed = [...last.entries()]
    .filter(([, ok]) => !ok)
    .map(([id]) => content.questions.get(id))
    .filter((q) => q !== undefined);
  const lessons = lessonsForRules(
    content,
    moduleId,
    missed.flatMap((q) => q.ruleIds),
  );

  return (
    <>
      <h1 className="text-2xl font-semibold">{t("result.title")}</h1>
      <section className={`card flex flex-col gap-2 ${attempt.passed ? "bg-success-soft" : ""}`}>
        <p className="text-3xl font-semibold">
          {t("result.score", { score: attempt.score ?? 0, total: attempt.total ?? 0 })}
        </p>
        <p>{attempt.passed ? t("result.passed") : t("result.notPassed")}</p>
      </section>

      {lessons.length ? (
        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">{t("result.lessonsToRevisit")}</h2>
          <ul className="flex flex-col gap-2">
            {lessons.map((l) => (
              <li key={l.id}>
                <Link href={`/lecon/${l.id}`} className="card block">
                  {l.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">{t("result.missed")}</h2>
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

      <div className="flex flex-wrap gap-3">
        {!attempt.passed ? (
          <Link href={`/test/${moduleId}`} className="btn">
            {t("result.retake")}
          </Link>
        ) : null}
        <Link href={`/module/${moduleId}`} className="btn btn-secondary">
          {t("result.backToModule")}
        </Link>
      </div>
    </>
  );
}
