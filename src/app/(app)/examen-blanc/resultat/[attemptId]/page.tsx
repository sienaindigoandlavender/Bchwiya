import Link from "next/link";
import { getContent } from "@/content";
import { MissedList } from "@/components/MissedList";
import { ScoreHero } from "@/components/ScoreHero";
import { PageHeader } from "@/components/ui/PageHeader";
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
    supabase
      .from("bchwiya_attempts")
      .select("*")
      .eq("id", attemptId)
      .eq("user_id", userId)
      .maybeSingle(),
    supabase
      .from("bchwiya_answers")
      .select("question_id, correct, final_selection")
      .eq("attempt_id", attemptId)
      .order("created_at", { ascending: true }),
  ]);
  if (!attempt || attempt.kind !== "mock_exam") {
    return <p className="card">{t("result.notFound")}</p>;
  }

  const content = getContent();
  const missed = (answers ?? [])
    .filter((a) => !a.correct)
    .map((a) => content.questions.get(a.question_id))
    .filter((q) => q !== undefined);

  return (
    <>
      <PageHeader title={t("exam.title")} />
      <ScoreHero
        score={attempt.score ?? 0}
        total={attempt.total ?? 0}
        passed={attempt.passed === true}
        message={attempt.passed ? t("exam.passed") : t("exam.notPassed")}
      />
      <section className="flex flex-col gap-3">
        <h2 className="title text-[1.625rem]">{t("exam.corrections")}</h2>
        <MissedList questions={missed} />
      </section>
      <Link href="/" className="btn self-start">
        {t("result.home")}
      </Link>
    </>
  );
}
