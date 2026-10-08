import Link from "next/link";
import { WallE } from "@/components/ui/WallE";
import { t, type MessageKey } from "@/i18n";
import { diagnose, type SetupState } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const DETAIL: Record<SetupState, MessageKey> = {
  "no-env": "setup.db",
  "no-tables": "setup.tables",
  "bad-key": "setup.key",
  "wrong-key-kind": "setup.keyKind",
  "no-profile": "setup.profile",
  ok: "setup.ok",
};

/**
 * Calm holding page. Zahra only ever sees Wall-E and "un petit instant".
 * The technical diagnosis appears only with ?details (for Jacqueline).
 */
export default async function HoldingPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const showDetails = "details" in params;
  const { state, host, detail } = await diagnose();
  const ready = state === "ok";

  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col justify-center px-5 py-10">
      <section className="flex flex-col items-center gap-6 rounded-big bg-blush px-6 pt-10 text-center">
        <h1 className="title text-[2.75rem] leading-none">
          {ready ? t("hold.readyTitle") : t("hold.title")}
        </h1>
        <p className="max-w-[26ch] text-[1.125rem] leading-relaxed">
          {ready ? t("hold.ready") : t("hold.body")}
        </p>
        <Link href="/" className="btn">
          {ready ? t("hold.open") : t("hold.retry")}
        </Link>
        <WallE pose="wave" height={230} className="mt-2" />
      </section>

      {showDetails ? (
        <section className="mt-6 flex flex-col gap-2 rounded-big bg-cloud p-5 text-[1rem]">
          <p className="font-semibold">{t(DETAIL[state])}</p>
          {host ? <p>{t("setup.host", { host })}</p> : null}
          {detail ? <p className="break-all">{detail}</p> : null}
        </section>
      ) : null}
    </main>
  );
}
