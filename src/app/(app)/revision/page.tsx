import { QuizSession } from "@/components/QuizSession";
import { PageHeader } from "@/components/ui/PageHeader";
import { getContent } from "@/content";
import { t } from "@/i18n";
import { requireSession } from "@/lib/supabase/server";

export default async function ReviewPage() {
  const { supabase, userId } = await requireSession();
  const { data } = await supabase
    .from("bchwiya_review_queue")
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
      <PageHeader title={t("review.title")} />
      {questions.length === 0 ? (
        <p className="title rounded-big bg-mint p-6 text-[1.75rem]">{t("review.empty")}</p>
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
