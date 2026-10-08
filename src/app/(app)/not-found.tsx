import Link from "next/link";
import { t } from "@/i18n";

export default function NotFound() {
  return (
    <>
      <p>{t("common.notFound")}</p>
      <Link href="/" className="btn self-start">
        {t("result.home")}
      </Link>
    </>
  );
}
