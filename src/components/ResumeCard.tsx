import Link from "next/link";
import { WallE } from "@/components/ui/WallE";
import { t } from "@/i18n";
import { greetingKey } from "@/lib/greeting";
import type { ResumeTarget } from "@/lib/progress";

/**
 * The welcome: Wall-E greets Zahra by name, in Darija, for the hour of the day,
 * and offers to pick up exactly where she left off. No guilt, no counters.
 */
export function ResumeCard({
  name,
  target,
  hasHistory,
}: {
  name: string;
  target: ResumeTarget;
  hasHistory: boolean;
}) {
  const href =
    target.kind === "lesson"
      ? `/lecon/${target.lessonId}`
      : target.kind === "test"
        ? `/test/${target.moduleId}`
        : "/revision";

  const bubble =
    target.kind === "done"
      ? t("home.bubble.done")
      : hasHistory
        ? t("home.bubble.resume")
        : t("home.bubble.start");

  return (
    <section className="fade-in relative pt-4">
      <div className="flex items-end gap-2">
        <div className="flex min-w-0 flex-1 flex-col gap-5 pb-8">
          <h1 className="title text-[3.25rem] leading-[0.95] text-ink">
            {t(greetingKey())},
            <br />
            {name}.
          </h1>

          {target.kind === "done" ? (
            <p className="text-[1.0625rem]">{t("home.resume.allDone")}</p>
          ) : (
            <div className="flex flex-col gap-1">
              <span className="text-[0.9375rem] font-medium text-ink-soft">
                {target.kind === "lesson" ? t("home.next.lesson") : t("home.next.test")}
              </span>
              <span className="text-[1.125rem] font-semibold leading-snug">{target.title}</span>
            </div>
          )}

          <Link href={href} className="btn self-start">
            {target.kind === "done"
              ? t("home.resume.review")
              : hasHistory
                ? t("home.resume.cta")
                : t("home.resume.ctaStart")}
          </Link>
        </div>

        <div className="relative flex shrink-0 flex-col items-center">
          <p className="relative mb-3 max-w-[9.5rem] rounded-[20px] bg-cloud px-4 py-3 text-[0.9375rem] font-medium leading-snug text-ink">
            {bubble}
            <span
              aria-hidden
              className="absolute -bottom-2 start-1/2 size-4 -translate-x-1/2 rotate-45 rounded-[3px] bg-cloud rtl:translate-x-1/2"
            />
          </p>
          <span aria-hidden className="absolute bottom-0 size-40 rounded-full bg-blush" />
          <WallE pose="hello" height={240} priority className="relative" />
        </div>
      </div>
    </section>
  );
}
