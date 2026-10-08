import Link from "next/link";
import { t } from "@/i18n";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-dvh max-w-xl flex-col">
      <header className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-border px-4 py-3 text-sm">
        <Link href="/" className="me-auto text-base font-semibold">
          {t("app.name")}
        </Link>
        <Link href="/revision">{t("nav.review")}</Link>
        <Link href="/examen-blanc">{t("nav.mockExam")}</Link>
      </header>
      <main className="flex flex-1 flex-col gap-6 px-4 py-6">{children}</main>
    </div>
  );
}
