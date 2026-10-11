import Link from "next/link";
import { PresetSign, presetTitle } from "@/components/signs/presets";
import { SIGN_TINT } from "@/components/signs/tints";
import { CheckIcon } from "@/components/ui/Icons";
import { PageHeader } from "@/components/ui/PageHeader";
import { getSigns } from "@/content/signs";
import { t } from "@/i18n";
import { requireSession } from "@/lib/supabase/server";

/** Her street album: every sign, the ones she has met in colour. */
export default async function SignsPage() {
  const { supabase, userId } = await requireSession();
  const { categories, signs } = getSigns();
  const { data } = await supabase
    .from("bchwiya_spotted_signs")
    .select("sign_id")
    .eq("user_id", userId);
  const seen = new Set((data ?? []).map((r) => r.sign_id));

  return (
    <>
      <PageHeader kicker={t("signs.kicker")} title={t("signs.title")} />
      <p className="text-[1.0625rem] leading-relaxed text-ink-soft">{t("signs.intro")}</p>
      <p className="pill self-start bg-blush text-ink">
        {t("signs.count", { seen: seen.size, total: signs.length })}
      </p>

      {categories.map((cat) => {
        const list = signs.filter((s) => s.category === cat.id);
        if (!list.length) return null;
        return (
          <section key={cat.id} className="flex flex-col gap-3">
            <h2 className="title text-[1.625rem]">{cat.title}</h2>
            <ul className="grid grid-cols-3 gap-2.5">
              {list.map((s) => {
                const met = seen.has(s.id);
                return (
                  <li key={s.id}>
                    <Link
                      href={`/panneaux/${s.id}`}
                      className={`relative flex h-full flex-col items-center gap-2 rounded-card p-3 text-center ${
                        met ? (SIGN_TINT[cat.id] ?? "bg-cloud") : "bg-cloud"
                      }`}
                    >
                      {met ? (
                        <span
                          className="absolute end-2 top-2 flex size-6 items-center justify-center rounded-full bg-rose text-rose-ink"
                          aria-hidden
                        >
                          <CheckIcon size={14} />
                        </span>
                      ) : null}
                      <span className={met ? "" : "opacity-45 grayscale-[40%]"}>
                        <PresetSign preset={s.id} size={64} />
                      </span>
                      <span className="text-[0.875rem] font-medium leading-tight">
                        {presetTitle(s.id)}
                      </span>
                      {met ? null : (
                        <span className="text-[0.8125rem] text-ink-soft">{t("signs.notYet")}</span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </>
  );
}
