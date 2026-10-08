import Link from "next/link";
import { t } from "@/i18n";
import type { LevelState, Status } from "@/lib/progress";
import { StatusBadge } from "./StatusBadge";

const DOT: Record<Status, string> = {
  locked: "border-locked bg-bg",
  available: "border-accent bg-bg",
  in_progress: "border-accent bg-accent",
  done: "border-success bg-success",
};

/** Vertical path of levels and their modules. */
export function LevelPath({ levels }: { levels: LevelState[] }) {
  return (
    <ol className="relative flex flex-col gap-6 border-s-2 border-border ps-6">
      {levels.map((level, i) => (
        <li key={level.id} className="relative">
          <span
            aria-hidden
            className={`absolute -start-[33px] top-1 size-4 rounded-full border-2 ${DOT[level.status]}`}
          />
          <div className="flex items-start justify-between gap-2">
            <Link
              href={`/niveau/${level.id}`}
              className={`font-semibold ${level.status === "locked" ? "text-locked" : ""}`}
            >
              <span className="block text-xs font-normal text-muted">
                {t("level.label")} {i}
              </span>
              {level.title}
            </Link>
            <StatusBadge status={level.status} />
          </div>
          <ul className="mt-2 flex flex-col gap-1">
            {level.modules.map((m) => (
              <li key={m.id}>
                {m.status === "locked" ? (
                  <span className="flex items-center justify-between gap-2 py-1 text-sm text-locked">
                    {m.title}
                  </span>
                ) : (
                  <Link
                    href={`/module/${m.id}`}
                    className="flex items-center justify-between gap-2 py-1 text-sm"
                  >
                    <span>{m.title}</span>
                    {m.status !== "available" ? <StatusBadge status={m.status} /> : null}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}
