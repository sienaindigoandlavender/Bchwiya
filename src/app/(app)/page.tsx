import Link from "next/link";
import { LevelPath } from "@/components/LevelPath";
import { ResumeCard } from "@/components/ResumeCard";
import { t } from "@/i18n";
import { loadPath } from "@/lib/data";
import { resumeTarget } from "@/lib/progress";
import { requireSession } from "@/lib/supabase/server";

export default async function HomePage() {
  const session = await requireSession();
  const { path, lastModuleId, lastActivityAt } = await loadPath(session);
  const { count } = await session.supabase
    .from("review_queue")
    .select("question_id", { count: "exact", head: true })
    .eq("user_id", session.userId)
    .lte("due_at", new Date().toISOString());

  return (
    <>
      <p className="text-muted">
        {t("home.welcome", { name: session.profile.display_name ?? "" })}
      </p>
      <ResumeCard target={resumeTarget(path, lastModuleId)} hasHistory={lastActivityAt !== null} />
      {count ? (
        <Link href="/revision" className="card block">
          {t("home.review.due", { count })}
        </Link>
      ) : null}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">{t("home.path")}</h2>
        <LevelPath levels={path} />
      </section>
      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">{t("home.extra")}</h2>
        <Link href="/ma-voiture" className="card block">
          {t("nav.myCar")}
        </Link>
      </section>
    </>
  );
}
