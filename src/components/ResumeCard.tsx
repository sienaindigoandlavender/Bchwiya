import Link from "next/link";
import { t } from "@/i18n";
import type { ResumeTarget } from "@/lib/progress";

/** "On reprend ?": picks up where she left off. No guilt, no counters. */
export function ResumeCard({ target, hasHistory }: { target: ResumeTarget; hasHistory: boolean }) {
  if (target.kind === "done") {
    return (
      <section className="card">
        <p>{t("home.resume.allDone")}</p>
      </section>
    );
  }
  const href = target.kind === "lesson" ? `/lecon/${target.lessonId}` : `/test/${target.moduleId}`;
  return (
    <section className="card flex flex-col gap-3 bg-accent-soft">
      <h2 className="text-xl font-semibold">
        {hasHistory ? t("home.resume.title") : t("home.resume.start")}
      </h2>
      <p>
        {target.kind === "lesson"
          ? t("home.resume.lesson", { title: target.title })
          : t("home.resume.test", { title: target.title })}
      </p>
      <Link href={href} className="btn self-start">
        {hasHistory ? t("home.resume.cta") : t("home.resume.ctaStart")}
      </Link>
    </section>
  );
}
