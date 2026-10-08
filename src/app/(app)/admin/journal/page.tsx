import { PageHeader } from "@/components/ui/PageHeader";
import { getContent } from "@/content";
import { t } from "@/i18n";
import { formatMs } from "@/lib/analytics";
import { buildJournal, type Tone } from "@/lib/journalView";
import { requireAdmin } from "@/lib/supabase/server";

const DOT: Record<Tone, string> = {
  neutral: "bg-cloud",
  good: "bg-mint",
  soft: "bg-butter",
  milestone: "bg-rose",
};

/** Zahra's journal: everything she did, day by day, newest first. */
export default async function JournalPage() {
  const { supabase, userId, profile } = await requireAdmin();
  const { data, error } = await supabase
    .from("bchwiya_events")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1500);

  const days = buildJournal(data ?? [], getContent());

  return (
    <>
      <PageHeader
        back={{ href: "/admin", label: t("admin.backToDashboard") }}
        kicker={profile.display_name ?? ""}
        title={t("journal.title")}
      />

      {error ? (
        <p className="card">{t("journal.missing")}</p>
      ) : days.length === 0 ? (
        <p className="card">{t("journal.empty")}</p>
      ) : (
        <div className="flex flex-col gap-8">
          {days.map((day) => (
            <section key={day.key} className="flex flex-col gap-3">
              <div className="flex flex-col gap-2">
                <h2 className="title text-[1.75rem] first-letter:uppercase">{day.label}</h2>
                <div className="flex flex-wrap gap-1.5">
                  <span className="pill bg-blush text-ink">
                    {t("journal.sum.time", { time: formatMs(day.activeMs) })}
                  </span>
                  {day.lessons ? (
                    <span className="pill bg-lilac text-ink">
                      {t("journal.sum.lessons", { count: day.lessons })}
                    </span>
                  ) : null}
                  {day.answers ? (
                    <span className="pill bg-mint text-ink">
                      {t("journal.sum.answers", { correct: day.correct, total: day.answers })}
                    </span>
                  ) : null}
                </div>
              </div>
              <ol className="flex flex-col rounded-big bg-cloud px-4 py-2">
                {day.lines.map((line) => (
                  <li
                    key={line.id}
                    className="flex items-start gap-3 border-b border-line py-2.5 last:border-0"
                  >
                    <span className="w-12 shrink-0 pt-0.5 text-[0.9375rem] font-medium tabular-nums text-ink-soft">
                      {line.time}
                    </span>
                    <span
                      aria-hidden
                      className={`mt-2 size-2.5 shrink-0 rounded-full ${DOT[line.tone]} ${line.tone === "neutral" ? "ring-1 ring-ink-soft/40" : ""}`}
                    />
                    <span className="text-[1rem] leading-snug">{line.text}</span>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>
      )}
    </>
  );
}
