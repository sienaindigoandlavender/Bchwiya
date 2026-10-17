import { PhotoQuestion } from "@/components/PhotoQuestion";
import { PageHeader } from "@/components/ui/PageHeader";
import { t } from "@/i18n";
import { isPhotoAskConfigured } from "@/lib/askClaude";
import { requireSession } from "@/lib/supabase/server";

/** A quiz screenshot or a sign from the street: she guesses first, then gets the answer. */
export default async function PhotoPage() {
  await requireSession();
  return (
    <>
      <PageHeader
        back={{ href: "/", label: t("nav.home") }}
        kicker={t("photo.kicker")}
        title={t("photo.title")}
      />
      <p className="text-[1.0625rem] leading-relaxed text-ink">{t("photo.intro")}</p>
      {isPhotoAskConfigured() ? (
        <PhotoQuestion />
      ) : (
        <p className="card bg-cloud text-[1.0625rem]">{t("photo.soon")}</p>
      )}
    </>
  );
}
