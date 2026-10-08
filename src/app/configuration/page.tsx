import Link from "next/link";
import { LittleCar } from "@/components/ui/LittleCar";
import { t } from "@/i18n";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

/** Shown when the database or Zahra's profile is missing. Building phase only. */
export default async function SetupPage({
  searchParams,
}: {
  searchParams: Promise<{ manque?: string }>;
}) {
  const { manque } = await searchParams;
  const message =
    isSupabaseConfigured() && manque === "profil" ? t("setup.profile") : t("setup.db");
  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col justify-center gap-6 px-5 py-10">
      <p className="title text-[1.75rem]">{t("app.name")}</p>
      <section className="flex flex-col items-start gap-5 rounded-big bg-blush p-6">
        <LittleCar size={120} />
        <h1 className="title text-[2.5rem]">{t("setup.title")}</h1>
        <p className="text-[1.0625rem] leading-relaxed">{message}</p>
        <Link href="/" className="btn">
          {t("setup.retry")}
        </Link>
      </section>
    </main>
  );
}
