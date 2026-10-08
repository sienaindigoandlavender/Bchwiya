import { t } from "@/i18n";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { LoginForm } from "./LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ erreur?: string }>;
}) {
  const { erreur } = await searchParams;
  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center gap-6 px-4">
      <div>
        <h1 className="text-3xl font-semibold">{t("app.name")}</h1>
        <p className="text-muted">{t("app.tagline")}</p>
      </div>
      <div className="card flex flex-col gap-4">
        <h2 className="text-lg font-semibold">{t("login.title")}</h2>
        {!isSupabaseConfigured() ? (
          <p className="text-sm text-muted">{t("login.notConfigured")}</p>
        ) : (
          <>
            {erreur ? (
              <p className="text-sm text-notice">
                {erreur === "acces" ? t("login.noAccess") : t("login.linkError")}
              </p>
            ) : null}
            <p className="text-sm">{t("login.intro")}</p>
            <LoginForm />
          </>
        )}
      </div>
    </main>
  );
}
