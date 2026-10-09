import Link from "next/link";
import { CheckIcon, LockIcon } from "@/components/ui/Icons";
import { t } from "@/i18n";
import { levelFill } from "@/lib/levelColors";
import type { LevelState, ModuleState } from "@/lib/progress";

/** The current stop: the first level that isn't finished and isn't locked. */
function currentIndex(levels: LevelState[]) {
  return levels.findIndex((l) => l.status === "in_progress" || l.status === "available");
}

const CHIP: Record<ModuleState["status"], string> = {
  locked: "bg-cloud text-ink-soft",
  available: "bg-paper text-ink ring-1 ring-line ring-inset",
  in_progress: "bg-blush text-ink ring-1 ring-rose ring-inset",
  done: "bg-mint text-ink",
};

function ModuleChip({ m }: { m: ModuleState }) {
  const body = (
    <>
      {m.status === "done" ? <CheckIcon size={14} className="text-success" /> : null}
      {m.status === "locked" ? <LockIcon size={13} /> : null}
      <span>{m.title}</span>
    </>
  );
  const cls = `inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[0.9375rem] font-medium ${CHIP[m.status]}`;
  return m.status === "locked" ? (
    <span className={cls}>{body}</span>
  ) : (
    <Link href={`/module/${m.id}`} className={cls}>
      {body}
    </Link>
  );
}

/**
 * The learning path drawn as a road: a soft lane with a dashed centre line,
 * one stop per level. Done stops turn mint, the current one is rose.
 */
export function LevelPath({ levels }: { levels: LevelState[] }) {
  const current = currentIndex(levels);
  return (
    <ol className="relative flex flex-col gap-7">
      {/* the road */}
      <span
        aria-hidden
        className="absolute inset-y-0 start-0 w-12 rounded-full bg-paper"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, transparent 0 10px, var(--line) 10px 20px)",
          backgroundSize: "3px 100%",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      {levels.map((level, i) => {
        const isCurrent = i === current;
        const stop =
          level.status === "done"
            ? "bg-mint text-success"
            : isCurrent
              ? "bg-rose text-rose-ink"
              : level.status === "locked"
                ? "bg-paper text-ink-soft ring-2 ring-cloud ring-inset"
                : `${levelFill(i)} text-ink`;
        return (
          <li key={level.id} className="relative flex gap-4">
            <span
              aria-hidden
              className={`relative z-[1] flex size-12 shrink-0 items-center justify-center rounded-full ${stop}`}
            >
              {level.status === "done" ? (
                <CheckIcon size={20} />
              ) : (
                <span className="title text-[1.5rem] leading-none">{i}</span>
              )}
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-2.5 pt-1">
              <Link href={`/niveau/${level.id}`} className="flex flex-col">
                <span className="flex items-center gap-2 text-[0.9375rem] font-medium text-ink-soft">
                  {t("level.label")} {i}
                  {isCurrent ? (
                    <span className="pill bg-rose py-0 text-rose-ink">{t("path.here")}</span>
                  ) : null}
                </span>
                <span
                  className={`title text-[1.625rem] ${level.status === "locked" ? "text-ink-soft" : "text-ink"}`}
                >
                  {level.title}
                </span>
              </Link>
              <div className="flex flex-wrap gap-1.5">
                {level.modules.map((m) => (
                  <ModuleChip key={m.id} m={m} />
                ))}
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
