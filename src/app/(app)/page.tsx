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

      <section className="mt-4 flex flex-col gap-6">
        <h2 className="title text-[2rem]">{t("home.path")}</h2>
        <LevelPath levels={path} />
      </section>

      <Link href="/ma-voiture" className="mt-4 flex items-center gap-4 rounded-big bg-lilac p-5">
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
