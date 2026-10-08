import Link from "next/link";
import { BottomNav } from "@/components/ui/BottomNav";
import { ChartIcon } from "@/components/ui/Icons";
import { t } from "@/i18n";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-dvh max-w-xl flex-col">
      <header className="flex items-center justify-between px-5 pt-5">
        <Link href="/" className="title text-[1.75rem] text-ink">
          {t("app.name")}
        </Link>
        <Link
          href="/admin"
          aria-label={t("nav.admin")}
          className="flex size-10 items-center justify-center rounded-full bg-cloud text-ink"
        >
          <ChartIcon size={19} />
        </Link>
      </header>
      <main className="flex flex-1 flex-col gap-6 px-5 pt-6 pb-32">{children}</main>
      <BottomNav />
    </div>
  );
}
