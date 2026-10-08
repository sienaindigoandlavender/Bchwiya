import { t } from "@/i18n";

export default function MyCarPage() {
  return (
    <>
      <h1 className="text-2xl font-semibold">{t("myCar.title")}</h1>
      <p className="card text-muted">{t("myCar.placeholder")}</p>
    </>
  );
}
