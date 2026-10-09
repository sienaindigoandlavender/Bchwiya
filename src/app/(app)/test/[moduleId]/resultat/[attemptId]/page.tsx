import Link from "next/link";
import { notFound } from "next/navigation";
import { getContent, lessonsForRules } from "@/content";
import { MissedList } from "@/components/MissedList";
import { ScoreHero } from "@/components/ScoreHero";
import { ChevronIcon } from "@/components/ui/Icons";
import { PageHeader } from "@/components/ui/PageHeader";
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
    supabase
      .from("bchwiya_attempts")
      .select("*")
      .eq("id", attemptId)
      .eq("user_id", userId)
      .maybeSingle(),
    supabase
      .from("bchwiya_answers")
      .select("question_id, correct, created_at")
      .eq("attempt_id", attemptId)
      .order("created_at", { ascending: true }),
  ]);
  if (!attempt || attempt.module_id !== moduleId) {
    return <p className="card">{t("result.notFound")}</p>;
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
      <PageHeader kicker={mod.title} title={t("result.title")} />
      <ScoreHero
        score={attempt.score ?? 0}
        total={attempt.total ?? 0}
        passed={attempt.passed === true}
        message={attempt.passed ? t("result.passed") : t("result.notPassed")}
      />

      {lessons.length ? (
        <section className="flex flex-col gap-3">
          <h2 className="title text-[1.625rem]">{t("result.lessonsToRevisit")}</h2>
          <ul className="flex flex-col gap-2.5">
            {lessons.map((l) => (
              <li key={l.id}>
                <Link
                  href={`/lecon/${l.id}`}
                  className="flex items-center gap-3 rounded-big bg-cloud p-4 font-semibold"
                >
                  <span className="flex-1">{l.title}</span>
                  <ChevronIcon size={18} />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="flex flex-col gap-3">
        <h2 className="title text-[1.625rem]">{t("result.missed")}</h2>
        <MissedList questions={missed} />
      </section>

      <div className="flex flex-col gap-3">
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
