import Link from "next/link";
import { notFound } from "next/navigation";
import { SignCheck, SpotButton } from "@/components/signs/SignCard";
import { PresetSign, presetTitle } from "@/components/signs/presets";
import { SIGN_TINT, shortDate } from "@/components/signs/tints";
import { ChevronIcon } from "@/components/ui/Icons";
import { PageHeader } from "@/components/ui/PageHeader";
import { getContent } from "@/content";
import { getSigns } from "@/content/signs";
import { t } from "@/i18n";
import { requireSession } from "@/lib/supabase/server";

/** One sign: what it means, what you do, one question, and the lesson it belongs to. */
export default async function SignPage({ params }: { params: Promise<{ signId: string }> }) {
  const { signId } = await params;
  const { categories, signs } = getSigns();
  const sign = signs.find((s) => s.id === signId);
  if (!sign) notFound();
  const { supabase, userId } = await requireSession();
  const { data: spotted } = await supabase
    .from("bchwiya_spotted_signs")
    .select("*")
    .eq("user_id", userId)
    .eq("sign_id", sign.id)
    .maybeSingle();
  const lesson = sign.lessonId ? getContent().lessons.get(sign.lessonId) : undefined;
  const category = categories.find((c) => c.id === sign.category);

  return (
    <>
      <PageHeader
        back={{ href: "/panneaux", label: t("signs.back") }}
        kicker={category?.title}
        title={presetTitle(sign.id)}
      />

      <div
        className={`flex flex-col items-center gap-4 rounded-big p-6 ${SIGN_TINT[sign.category] ?? "bg-cloud"}`}
      >
        <PresetSign preset={sign.id} size={168} />
        {spotted ? (
          <p className="pill bg-paper text-ink">
            {t("signs.seenOn", { date: shortDate(spotted.first_spotted_at) })}
            {spotted.times > 1 ? ` · ${t("signs.seenTimes", { count: spotted.times })}` : ""}
          </p>
        ) : null}
        <SpotButton signId={sign.id} already={!!spotted} />
      </div>

      <section className="card flex flex-col gap-2 bg-cloud">
        <h2 className="text-[1rem] font-semibold text-ink">{t("signs.meaning")}</h2>
        <p className="font-serif text-[1.25rem] leading-snug">{sign.meaning}</p>
      </section>
      <section className="card flex flex-col gap-2 bg-mint">
        <h2 className="text-[1rem] font-semibold text-ink">{t("signs.todo")}</h2>
        <p className="font-serif text-[1.25rem] leading-snug">{sign.todo}</p>
      </section>

      <SignCheck signId={sign.id} check={sign.check} />

      {lesson ? (
        <Link
          href={`/lecon/${lesson.id}`}
          className="flex items-center gap-3 rounded-card bg-blush px-5 py-4"
        >
          <span className="flex flex-1 flex-col">
            <span className="text-[0.9375rem] text-ink">{t("signs.lesson")}</span>
            <span className="font-medium">{lesson.title}</span>
          </span>
          <ChevronIcon size={18} />
        </Link>
      ) : null}
    </>
  );
}
