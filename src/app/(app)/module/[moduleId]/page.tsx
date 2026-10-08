import Link from "next/link";
import { notFound } from "next/navigation";
import { StatusBadge } from "@/components/StatusBadge";
import { CheckIcon, ChevronIcon, LockIcon } from "@/components/ui/Icons";
import { PageHeader } from "@/components/ui/PageHeader";
import { t } from "@/i18n";
import { loadPath } from "@/lib/data";
import { findModule } from "@/lib/progress";
import { requireSession } from "@/lib/supabase/server";

export default async function ModulePage({ params }: { params: Promise<{ moduleId: string }> }) {
  const { moduleId } = await params;
  const { path } = await loadPath(await requireSession());
  const mod = findModule(path, moduleId);
  if (!mod) notFound();
  const level = path.find((l) => l.id === mod.levelId);

  return (
    <>
      <PageHeader
        back={{ href: `/niveau/${mod.levelId}`, label: level?.title ?? t("nav.back") }}
        title={mod.title}
        aside={<StatusBadge status={mod.status} />}
      />

      {mod.status === "locked" ? (
        <p className="card">{t("module.locked")}</p>
      ) : (
        <>
          <section className="flex flex-col gap-3">
            <h2 className="title text-[1.625rem]">{t("module.lessons")}</h2>
            <ol className="flex flex-col gap-2.5">
              {mod.lessons.map((l, i) => {
                const marker =
                  l.status === "done" ? (
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-mint text-success">
                      <CheckIcon size={18} />
                    </span>
                  ) : l.status === "locked" ? (
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-paper text-ink-soft">
                      <LockIcon size={16} />
                    </span>
                  ) : (
                    <span className="title flex size-10 shrink-0 items-center justify-center rounded-full bg-rose text-[1.25rem] text-rose-ink">
                      {i + 1}
                    </span>
                  );
                const body = (
                  <>
                    {marker}
                    <span className="flex flex-1 flex-col">
                      <span className="font-semibold leading-snug">{l.title}</span>
                      <span className="text-[0.875rem] text-ink-soft">
                        {t("module.minutes", { minutes: l.minutes })}
                      </span>
                    </span>
                    {l.status !== "locked" ? <ChevronIcon size={18} /> : null}
                  </>
                );
                const cls = `flex items-center gap-4 rounded-big p-4 ${
                  l.status === "available" ? "bg-blush" : "bg-cloud"
                } ${l.status === "locked" ? "text-ink-soft" : "text-ink"}`;
                return (
                  <li key={l.id}>
                    {l.status === "locked" ? (
                      <div className={cls}>{body}</div>
                    ) : (
                      <Link href={`/lecon/${l.id}`} className={cls}>
                        {body}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ol>
          </section>

          <section className="flex flex-col gap-3 rounded-big bg-lilac p-5">
            <h2 className="title text-[1.625rem]">{t("module.testTitle")}</h2>
            {mod.bestScorePct !== null ? (
              <p className="font-medium">{t("module.bestScore", { pct: mod.bestScorePct })}</p>
            ) : null}
            {!mod.hasTest ? (
              <p>{t("module.noTest")}</p>
            ) : mod.allLessonsDone ? (
              <Link href={`/test/${mod.id}`} className="btn self-start">
                {mod.bestScorePct !== null ? t("module.retakeTest") : t("module.takeTest")}
              </Link>
            ) : (
              <p>{t("module.testLocked")}</p>
            )}
          </section>
        </>
      )}
    </>
  );
}
