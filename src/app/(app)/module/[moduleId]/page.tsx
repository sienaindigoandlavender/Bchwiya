import Link from "next/link";
import { notFound } from "next/navigation";
import { StatusBadge } from "@/components/StatusBadge";
import { t } from "@/i18n";
import { loadPath } from "@/lib/data";
import { findModule } from "@/lib/progress";
import { requireSession } from "@/lib/supabase/server";

export default async function ModulePage({ params }: { params: Promise<{ moduleId: string }> }) {
  const { moduleId } = await params;
  const { path } = await loadPath(await requireSession());
  const mod = findModule(path, moduleId);
  if (!mod) notFound();

  return (
    <>
      <Link href={`/niveau/${mod.levelId}`} className="text-sm text-muted">
        ← {path.find((l) => l.id === mod.levelId)?.title}
      </Link>
      <header className="flex items-start justify-between gap-2">
        <h1 className="text-2xl font-semibold">{mod.title}</h1>
        <StatusBadge status={mod.status} />
      </header>

      {mod.status === "locked" ? (
        <p className="text-muted">{t("module.locked")}</p>
      ) : (
        <>
          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-semibold">{t("module.lessons")}</h2>
            <ol className="flex flex-col gap-2">
              {mod.lessons.map((l) => (
                <li key={l.id}>
                  {l.status === "locked" ? (
                    <div className="card flex items-center justify-between gap-2 text-locked">
                      <span>{l.title}</span>
                      <span className="text-xs">{t("module.minutes", { minutes: l.minutes })}</span>
                    </div>
                  ) : (
                    <Link
                      href={`/lecon/${l.id}`}
                      className="card flex items-center justify-between gap-2"
                    >
                      <span>{l.title}</span>
                      {l.status === "done" ? (
                        <StatusBadge status="done" />
                      ) : (
                        <span className="text-xs text-muted">
                          {t("module.minutes", { minutes: l.minutes })}
                        </span>
                      )}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </section>

          <section className="flex flex-col gap-2">
            {mod.bestScorePct !== null ? (
              <p className="text-sm text-muted">
                {t("module.bestScore", { pct: mod.bestScorePct })}
              </p>
            ) : null}
            {!mod.hasTest ? (
              <p className="text-sm text-muted">{t("module.noTest")}</p>
            ) : mod.allLessonsDone ? (
              <Link href={`/test/${mod.id}`} className="btn self-start">
                {mod.bestScorePct !== null ? t("module.retakeTest") : t("module.takeTest")}
              </Link>
            ) : (
              <p className="text-sm text-muted">{t("module.testLocked")}</p>
            )}
          </section>
        </>
      )}
    </>
  );
}
