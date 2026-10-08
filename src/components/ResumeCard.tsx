import Link from "next/link";
import { LittleCar } from "@/components/ui/LittleCar";
import { Sparkle } from "@/components/ui/Icons";
import { t } from "@/i18n";
import type { ResumeTarget } from "@/lib/progress";

/** "On reprend ?": picks up where she left off. No guilt, no counters. */
export function ResumeCard({ target, hasHistory }: { target: ResumeTarget; hasHistory: boolean }) {
  if (target.kind === "done") {
    return (
      <section className="flex flex-col gap-2 rounded-big bg-mint p-6">
        <Sparkle size={20} className="text-success" />
        <p className="title text-[1.75rem]">{t("home.resume.allDone")}</p>
      </section>
    );
  }
  const href = target.kind === "lesson" ? `/lecon/${target.lessonId}` : `/test/${target.moduleId}`;
  return (
    <section className="relative overflow-hidden rounded-big bg-blush p-6 pb-7">
      <Sparkle size={14} className="absolute end-8 top-7 text-rose" />
      <Sparkle size={9} className="absolute end-16 top-14 text-rose" />
      <h2 className="title text-[2.5rem] text-ink">
        {hasHistory ? t("home.resume.title") : t("home.resume.start")}
      </h2>
      <p className="mt-2 max-w-[22ch] text-[1.0625rem] text-ink">
        {target.kind === "lesson"
          ? t("home.resume.lesson", { title: target.title })
          : t("home.resume.test", { title: target.title })}
      </p>
      <div className="mt-6 flex items-end justify-between gap-3">
        <Link href={href} className="btn">
          {hasHistory ? t("home.resume.cta") : t("home.resume.ctaStart")}
        </Link>
        <LittleCar size={104} className="-me-2 shrink-0" />
      </div>
    </section>
  );
}
