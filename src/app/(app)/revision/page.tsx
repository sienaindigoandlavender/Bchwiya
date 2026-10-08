import { QuizSession } from "@/components/QuizSession";
import { PageHeader } from "@/components/ui/PageHeader";
import { WallE } from "@/components/ui/WallE";
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
        <section className="flex flex-col items-center gap-4 overflow-hidden rounded-big bg-mint px-6 pt-8 text-center">
          <p className="title text-[2rem]">{t("review.empty")}</p>
          <WallE pose="sit-calm" height={230} className="-mb-2" />
        </section>
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
