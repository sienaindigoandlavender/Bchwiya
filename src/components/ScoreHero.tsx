import { Sparkle } from "@/components/ui/Icons";
import { WallE } from "@/components/ui/WallE";
import { t } from "@/i18n";

/** The big score block shared by module tests and mock exams. */
export function ScoreHero({
  score,
  total,
  passed,
  message,
}: {
  score: number;
  total: number;
  passed: boolean;
  message: string;
}) {
  return (
    <section
      className={`relative flex flex-col gap-3 overflow-hidden rounded-big p-6 ${passed ? "bg-mint" : "bg-blush"}`}
    >
      {passed ? (
        <>
          <Sparkle size={18} className="absolute end-10 top-8 text-success" />
          <Sparkle size={10} className="absolute end-20 top-16 text-success" />
        </>
      ) : null}
      <p className="title text-[4.5rem] leading-none text-ink">
        {t("result.score", { score, total })}
      </p>
      <p className="max-w-[26ch] text-[1.0625rem] font-medium">{message}</p>
      {passed ? <WallE pose="joy" height={190} className="-mb-6 self-end" /> : null}
    </section>
  );
}
