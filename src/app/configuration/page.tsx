import Link from "next/link";
import { LittleCar } from "@/components/ui/LittleCar";
import { t } from "@/i18n";
import { diagnose, type SetupState } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const MESSAGE: Record<SetupState, Parameters<typeof t>[0]> = {
  "no-env": "setup.db",
  "no-tables": "setup.tables",
  "bad-key": "setup.key",
  "no-profile": "setup.profile",
  ok: "setup.ok",
};

/** Building phase only: checks the database live and says exactly what is missing. */
export default async function SetupPage() {
  const { state, host, detail } = await diagnose();
  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col justify-center gap-6 px-5 py-10">
      <p className="title text-[1.75rem]">{t("app.name")}</p>
      <section
        className={`flex flex-col items-start gap-5 rounded-big p-6 ${state === "ok" ? "bg-mint" : "bg-blush"}`}
      >
        <LittleCar size={120} />
        <h1 className="title text-[2.5rem]">
          {state === "ok" ? t("setup.okTitle") : t("setup.title")}
        </h1>
        <p className="text-[1.0625rem] leading-relaxed">{t(MESSAGE[state])}</p>
        {host ? (
          <p className="rounded-card bg-paper px-4 py-3 text-[1rem]">
            {t("setup.host", { host })}
            {detail ? <span className="mt-1 block break-all">{detail}</span> : null}
          </p>
        ) : null}
        <Link href="/" className="btn">
          {state === "ok" ? t("setup.open") : t("setup.retry")}
        </Link>
      </section>
    </main>
  );
}
