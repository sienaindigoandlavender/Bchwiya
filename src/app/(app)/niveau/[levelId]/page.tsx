import Link from "next/link";
import { notFound } from "next/navigation";
import { StatusBadge } from "@/components/StatusBadge";
import { ChevronIcon } from "@/components/ui/Icons";
import { PageHeader } from "@/components/ui/PageHeader";
import { t } from "@/i18n";
import { loadPath } from "@/lib/data";
import { levelFill } from "@/lib/levelColors";
import { requireSession } from "@/lib/supabase/server";

export default async function LevelPage({ params }: { params: Promise<{ levelId: string }> }) {
  const { levelId } = await params;
  const { path } = await loadPath(await requireSession());
  const index = path.findIndex((l) => l.id === levelId);
  const level = path[index];
  if (!level) notFound();

  return (
    <>
      <PageHeader
        back={{ href: "/", label: t("nav.home") }}
        kicker={`${t("level.label")} ${index}`}
        title={level.title}
      />
      <ul className="flex flex-col gap-3">
        {level.modules.map((m, i) => {
          const inner = (
            <>
              <span
                className={`title flex size-11 shrink-0 items-center justify-center rounded-full text-[1.375rem] ${
                  m.status === "locked" ? "bg-paper text-ink-soft" : "bg-paper text-ink"
                }`}
              >
                {i + 1}
              </span>
              <span className="flex flex-1 flex-col gap-1.5">
                <span className="text-[1.0625rem] font-semibold leading-snug">{m.title}</span>
                <StatusBadge status={m.status} />
              </span>
              {m.status !== "locked" ? <ChevronIcon size={18} /> : null}
            </>
          );
          const cls = `flex items-center gap-4 rounded-big p-4 ${
            m.status === "locked" ? "bg-cloud text-ink-soft" : `${levelFill(index)} text-ink`
          }`;
          return (
            <li key={m.id}>
              {m.status === "locked" ? (
                <div className={cls}>{inner}</div>
              ) : (
                <Link href={`/module/${m.id}`} className={cls}>
                  {inner}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
}
