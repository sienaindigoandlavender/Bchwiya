import { notFound } from "next/navigation";
import { QuizSession } from "@/components/QuizSession";
import { PageHeader } from "@/components/ui/PageHeader";
import { getContent } from "@/content";
import { t } from "@/i18n";
import { loadPath } from "@/lib/data";
import { findModule } from "@/lib/progress";
import { MODULE_TEST_SIZE, shuffle } from "@/lib/scoring";
import { requireSession } from "@/lib/supabase/server";

export default async function ModuleTestPage({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}) {
  const { moduleId } = await params;
  const { path } = await loadPath(await requireSession());
  const mod = findModule(path, moduleId);
  if (!mod) notFound();

  const pool = getContent().questionsByModule.get(moduleId) ?? [];
  const questions = shuffle(pool).slice(0, MODULE_TEST_SIZE);
  const ready = mod.status !== "locked" && mod.allLessonsDone;

  return (
    <>
      <PageHeader
        back={{ href: `/module/${mod.id}`, label: mod.title }}
        kicker={t("test.kicker")}
        title={mod.title}
      />
      {questions.length === 0 ? (
        <p className="card">{t("test.empty")}</p>
      ) : !ready ? (
        <p className="card">{t("test.locked")}</p>
      ) : (
        <QuizSession
          kind="module_test"
          moduleId={mod.id}
          questions={questions}
          intro={t("test.intro", { count: questions.length })}
          startLabel={t("test.start")}
          resultHref={`/test/${mod.id}/resultat/{attemptId}`}
        />
      )}
    </>
  );
}
