import Link from "next/link";
import { LevelPath } from "@/components/LevelPath";
import { ResumeCard } from "@/components/ResumeCard";
import { CarIcon, ChevronIcon, ReviewIcon } from "@/components/ui/Icons";
import { t } from "@/i18n";
import { loadPath } from "@/lib/data";
import { resumeTarget } from "@/lib/progress";
import { requireSession } from "@/lib/supabase/server";

export default async function HomePage() {
  const session = await requireSession();
  const { path, lastModuleId, lastActivityAt } = await loadPath(session);
  const { count } = await session.supabase
    .from("bchwiya_review_queue")
    .select("question_id", { count: "exact", head: true })
    .eq("user_id", session.userId)
    .lte("due_at", new Date().toISOString());

  const modules = path.flatMap((l) => l.modules);
  const modulesDone = modules.filter((m) => m.status === "done").length;
  const modulesTotal = modules.length;

  return (
    <>
      <ResumeCard
        name={session.profile.display_name ?? ""}
        target={resumeTarget(path, lastModuleId)}
        hasHistory={lastActivityAt !== null}
      />

      {count ? (
        <Link
          href="/revision"
          className="flex items-center gap-3 rounded-card bg-butter px-5 py-4 font-medium"
        >
          <ReviewIcon size={20} />
          <span className="flex-1">{t("home.review.due", { count })}</span>
          <ChevronIcon size={18} />
        </Link>
      ) : null}

      <details className="group rounded-big bg-cloud">
        <summary className="flex cursor-pointer list-none items-center gap-3 p-5 [&::-webkit-details-marker]:hidden">
          <span className="flex flex-1 flex-col gap-0.5">
            <span className="title text-[1.5rem]">{t("home.path")}</span>
            <span className="text-[1rem] text-ink-soft">
              {t("home.path.summary", { done: modulesDone, total: modulesTotal })}
            </span>
          </span>
          <span className="text-[0.9375rem] font-semibold text-rose group-open:hidden">
            {t("home.path.open")}
          </span>
          <span className="hidden text-[0.9375rem] font-semibold text-rose group-open:inline">
            {t("home.path.close")}
          </span>
        </summary>
        <div className="fade-in px-5 pt-2 pb-6">
          <LevelPath levels={path} />
        </div>
      </details>

      <Link href="/ma-voiture" className="flex items-center gap-4 rounded-big bg-cloud p-5">
        <span className="flex size-12 items-center justify-center rounded-full bg-paper">
          <CarIcon size={24} />
        </span>
        <span className="flex flex-1 flex-col">
          <span className="title text-[1.5rem]">{t("nav.myCar")}</span>
          <span className="text-[1rem] text-ink-soft">{t("home.myCar.sub")}</span>
        </span>
        <ChevronIcon size={18} />
      </Link>
    </>
  );
}
