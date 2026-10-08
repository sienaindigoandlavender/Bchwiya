import { WallE } from "@/components/ui/WallE";
import { PageHeader } from "@/components/ui/PageHeader";
import { t } from "@/i18n";

export default function MyCarPage() {
  return (
    <>
      <PageHeader title={t("myCar.title")} />
      <section className="flex flex-col items-start gap-5 rounded-big bg-lilac p-6">
        <span className="pill bg-paper text-ink">{t("myCar.soon")}</span>
        <WallE pose="keys-close" height={280} className="self-center" />
        <p className="font-serif text-[1.375rem] leading-[1.45]">{t("myCar.placeholder")}</p>
      </section>
    </>
  );
}
