import Link from "next/link";
import { signOut } from "@/app/actions";
import { t } from "@/i18n";
import { requireSession } from "@/lib/supabase/server";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { profile } = await requireSession();
  return (
    <div className="mx-auto flex min-h-dvh max-w-xl flex-col">
      <header className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-border px-4 py-3 text-sm">
        <Link href="/" className="me-auto text-base font-semibold">
          {t("app.name")}
        </Link>
        <Link href="/revision">{t("nav.review")}</Link>
        <Link href="/examen-blanc">{t("nav.mockExam")}</Link>
        {profile.role === "admin" ? <Link href="/admin">{t("nav.admin")}</Link> : null}
        <form action={signOut}>
          <button type="submit" className="text-muted">
            {t("nav.signOut")}
          </button>
        </form>
      </header>
      <main className="flex flex-1 flex-col gap-6 px-4 py-6">{children}</main>
    </div>
  );
}
