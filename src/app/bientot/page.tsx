import { redirect } from "next/navigation";
import { t } from "@/i18n";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

export default function SoonPage() {
  if (isSupabaseConfigured()) redirect("/");
  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center gap-2 px-4">
      <h1 className="text-3xl font-semibold">{t("app.name")}</h1>
      <p className="text-muted">{t("soon.body")}</p>
    </main>
  );
}
