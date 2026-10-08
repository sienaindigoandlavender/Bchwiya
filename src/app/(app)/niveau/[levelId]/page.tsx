import Link from "next/link";
import { notFound } from "next/navigation";
import { StatusBadge } from "@/components/StatusBadge";
import { t } from "@/i18n";
import { loadPath } from "@/lib/data";
import { requireSession } from "@/lib/supabase/server";

export default async function LevelPage({ params }: { params: Promise<{ levelId: string }> }) {
  const { levelId } = await params;
  const { path } = await loadPath(await requireSession());
  const index = path.findIndex((l) => l.id === levelId);
  const level = path[index];
  if (!level) notFound();

  return (
    <>
      <Link href="/" className="text-sm text-muted">
        ← {t("nav.home")}
      </Link>
      <header className="flex items-start justify-between gap-2">
        <h1 className="text-2xl font-semibold">
          <span className="block text-sm font-normal text-muted">
            {t("level.label")} {index}
          </span>
          {level.title}
        </h1>
        <StatusBadge status={level.status} />
      </header>
      <ul className="flex flex-col gap-3">
        {level.modules.map((m) => (
          <li key={m.id}>
            {m.status === "locked" ? (
              <div className="card flex items-center justify-between gap-2 text-locked">
                <span>{m.title}</span>
                <StatusBadge status={m.status} />
              </div>
            ) : (
              <Link
                href={`/module/${m.id}`}
                className="card flex items-center justify-between gap-2"
              >
                <span>{m.title}</span>
                <StatusBadge status={m.status} />
              </Link>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}
