import Link from "next/link";
import { notFound } from "next/navigation";
import { getContent } from "@/content";
import { t } from "@/i18n";
import { formatDate, formatMs } from "@/lib/analytics";
import { requireAdmin } from "@/lib/supabase/server";

export default async function AttemptDetailPage({
  params,
}: {
  params: Promise<{ attemptId: string }>;
}) {
  const { attemptId } = await params;
  const { supabase } = await requireAdmin();
  const content = getContent();

  const [{ data: attempt }, { data: answers }] = await Promise.all([
    supabase.from("bchwiya_attempts").select("*").eq("id", attemptId).maybeSingle(),
    supabase
      .from("bchwiya_answers")
      .select("*")
      .eq("attempt_id", attemptId)
      .order("created_at", { ascending: true }),
  ]);
  if (!attempt) notFound();

  const list = (ids: string[] | null) => (ids?.length ? ids.join(", ") : "—");

  return (
    <>
      <Link href="/admin" className="text-sm text-muted">
        ← {t("admin.backToDashboard")}
      </Link>
      <h1 className="title text-[2.5rem]">
        {t(`kind.${attempt.kind}`)}
        {attempt.module_id
          ? ` · ${content.modules.get(attempt.module_id)?.title ?? attempt.module_id}`
          : ""}
      </h1>
      <p className="text-muted">
        {formatDate(attempt.started_at)} · {attempt.score ?? 0}/{attempt.total ?? 0}
      </p>
      <div className="overflow-x-auto">
        <div className="-mx-5 overflow-x-auto px-5">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="text-muted">
              <tr>
                <th className="py-2 pe-2 text-start">{t("admin.question")}</th>
                <th className="px-2 text-start">{t("admin.firstSelection")}</th>
                <th className="px-2 text-start">{t("admin.finalSelection")}</th>
                <th className="px-2 text-end">{t("admin.avgChanges")}</th>
                <th className="px-2 text-end">{t("admin.timeToFirst")}</th>
                <th className="px-2 text-end">{t("admin.timeToSubmit")}</th>
                <th className="ps-2 text-end">{t("admin.correct")}</th>
              </tr>
            </thead>
            <tbody>
              {(answers ?? []).map((a) => (
                <tr key={a.id} className="border-t border-border align-top">
                  <td className="py-2 pe-2">
                    {content.questions.get(a.question_id)?.prompt ?? a.question_id}
                  </td>
                  <td className="px-2">{list(a.first_selection)}</td>
                  <td className="px-2">{list(a.final_selection)}</td>
                  <td className="px-2 text-end">{a.change_count ?? 0}</td>
                  <td className="px-2 text-end">{formatMs(a.time_to_first_ms)}</td>
                  <td className="px-2 text-end">{formatMs(a.time_to_submit_ms)}</td>
                  <td className="ps-2 text-end">{a.correct ? t("admin.yes") : t("admin.no")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
