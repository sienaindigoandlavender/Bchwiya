import Link from "next/link";
import { t } from "@/i18n";

export default function NotFound() {
  return (
    <section className="flex flex-col items-start gap-5 rounded-big bg-cloud p-6">
      <p className="title text-[2rem]">{t("common.notFound")}</p>
      <Link href="/" className="btn">
        {t("result.home")}
      </Link>
    </section>
  );
}
