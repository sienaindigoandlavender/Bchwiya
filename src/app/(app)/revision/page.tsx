import { QuizSession } from "@/components/QuizSession";
import { getContent } from "@/content";
import { t } from "@/i18n";
import { requireSession } from "@/lib/supabase/server";

export default async function ReviewPage() {
  const { supabase, userId } = await requireSession();
  const { data } = await supabase
    .from("review_queue")
    .select("question_id, due_at")
    .eq("user_id", userId)
    .lte("due_at", new Date().toISOString())
    .order("due_at", { ascending: true });

  const content = getContent();
  const questions = (data ?? [])
    .map((r) => content.questions.get(r.question_id))
    .filter((q) => q !== undefined);

  return (
    <>
      <h1 className="text-2xl font-semibold">{t("review.title")}</h1>
      {questions.length === 0 ? (
        <p className="card">{t("review.empty")}</p>
      ) : (
        <QuizSession
          kind="review"
          moduleId={null}
          questions={questions}
          intro={t("review.intro", { count: questions.length })}
          startLabel={t("review.start")}
          doneMessage={t("review.done")}
        />
      )}
    </>
  );
}
