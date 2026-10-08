import Link from "next/link";
import { WallE } from "@/components/ui/WallE";
import { t } from "@/i18n";

/** Any address that doesn't exist: Wall-E points her back home. */
export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col justify-center px-5 py-10">
      <section className="flex flex-col items-center gap-6 rounded-big bg-blush px-6 pt-10 text-center">
        <h1 className="title text-[2.75rem] leading-none">{t("lost.title")}</h1>
        <p className="max-w-[26ch] text-[1.125rem] leading-relaxed">{t("lost.body")}</p>
        <Link href="/" className="btn">
          {t("lost.home")}
        </Link>
        <WallE pose="sit-curious" height={220} className="mt-2" />
      </section>
    </main>
  );
}
