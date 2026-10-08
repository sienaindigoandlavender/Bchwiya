import Link from "next/link";
import { getContent } from "@/content";
import { t } from "@/i18n";
import { formatDate, formatMs, ruleStats } from "@/lib/analytics";
import { loadPath } from "@/lib/data";
import { resumeTarget } from "@/lib/progress";
import { requireAdmin } from "@/lib/supabase/server";

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export default async function AdminPage() {
  const { supabase } = await requireAdmin();
  const content = getContent();

  const { data: learner } = await supabase
    .from("bchwiya_profiles")
    .select("*")
    .eq("role", "learner")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (!learner) {
    return (
      <>
        <h1 className="title text-[2.5rem]">{t("admin.title")}</h1>
        <p className="text-muted">{t("admin.noLearner")}</p>
      </>
    );
  }

  const [{ data: answers }, { data: attempts }, pathData] = await Promise.all([
    supabase
      .from("bchwiya_answers")
      .select("rule_ids, correct, time_to_submit_ms, change_count, created_at")
      .eq("user_id", learner.id),
    supabase
      .from("bchwiya_attempts")
      .select("*")
      .eq("user_id", learner.id)
      .not("finished_at", "is", null)
      .order("started_at", { ascending: false })
      .limit(100),
    loadPath({ supabase, userId: learner.id }),
  ]);

  const allAnswers = answers ?? [];
  const { stats, medianMs } = ruleStats(content.rules, allAnswers);

  const modulesWithTest = content.moduleOrder.filter(
    (id) => content.questionsByModule.get(id)?.length,
  );
  const passed = modulesWithTest.filter((id) => pathData.progress.passedModules.has(id)).length;
  const target = resumeTarget(pathData.path, pathData.lastModuleId);
  const position =
    target.kind === "done"
      ? t("status.done")
      : `${content.modules.get(target.moduleId)?.title ?? target.moduleId}${target.kind === "lesson" ? ` · ${target.title}` : ""}`;

  const lastAnswerAt = allAnswers.reduce<string | null>(
    (max, a) => (!max || a.created_at > max ? a.created_at : max),
    null,
  );
  const lastActivity =
    [lastAnswerAt, pathData.lastActivityAt].filter(Boolean).sort().at(-1) ?? null;
  const weekAgo = new Date(Date.now() - WEEK_MS).toISOString();
  const weekMs = allAnswers
    .filter((a) => a.created_at >= weekAgo)
    .reduce((sum, a) => sum + (a.time_to_submit_ms ?? 0), 0);

  const tests = (attempts ?? []).filter((a) => a.kind !== "mock_exam");
  const exams = (attempts ?? []).filter((a) => a.kind === "mock_exam");
  const duration = (a: { started_at: string; finished_at: string | null }) =>
    a.finished_at
      ? formatMs(new Date(a.finished_at).getTime() - new Date(a.started_at).getTime())
      : "—";

  return (
    <>
      <h1 className="title text-[2.5rem]">{t("admin.title")}</h1>
      <p className="text-muted">
        {t("admin.learner", { name: learner.display_name ?? learner.id })}
      </p>

      <section className="flex flex-col gap-2">
        <h2 className="title text-[1.625rem]">{t("admin.overview")}</h2>
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div className="card">
            <dt className="text-muted">{t("admin.modulesPassed")}</dt>
            <dd className="text-xl font-semibold">
              {passed} / {modulesWithTest.length}
            </dd>
          </div>
          <div className="card">
            <dt className="text-muted">{t("admin.position")}</dt>
            <dd>{position}</dd>
          </div>
          <div className="card">
            <dt className="text-muted">{t("admin.lastActivity")}</dt>
            <dd>{formatDate(lastActivity)}</dd>
          </div>
          <div className="card">
            <dt className="text-muted">{t("admin.timeThisWeek")}</dt>
            <dd>{formatMs(weekMs)}</dd>
            <dd className="text-xs text-muted">{t("admin.timeNote")}</dd>
          </div>
        </dl>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="title text-[1.625rem]">{t("admin.rules")}</h2>
        <p className="text-xs text-muted">{t("admin.medianNote", { time: formatMs(medianMs) })}</p>
        <div className="overflow-x-auto">
          <div className="-mx-5 overflow-x-auto px-5">
            <table className="w-full min-w-[560px] text-sm">
              <thead className="text-start text-muted">
                <tr>
                  <th className="py-2 pe-2 text-start">{t("admin.rule")}</th>
                  <th className="px-2 text-end">{t("admin.accuracy")}</th>
                  <th className="px-2 text-end">{t("admin.avgTime")}</th>
                  <th className="px-2 text-end">{t("admin.avgChanges")}</th>
                  <th className="px-2 text-end">{t("admin.attemptsCount")}</th>
                  <th className="ps-2 text-start">{t("admin.flag")}</th>
                </tr>
              </thead>
              <tbody>
                {stats.map((s) => (
                  <tr key={s.rule.id} className="border-t border-border">
                    <td className="py-2 pe-2">{s.rule.title}</td>
                    <td className="px-2 text-end">
                      {s.accuracyPct === null ? "—" : `${s.accuracyPct} %`}
                    </td>
                    <td className="px-2 text-end">{formatMs(s.avgTimeMs)}</td>
                    <td className="px-2 text-end">
                      {s.avgChanges === null ? "—" : s.avgChanges.toFixed(1)}
                    </td>
                    <td className="px-2 text-end">{s.answers}</td>
                    <td className="ps-2">{s.flags.map((f) => t(`admin.flag.${f}`)).join(", ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="title text-[1.625rem]">{t("admin.attempts")}</h2>
        {tests.length === 0 ? (
          <p className="text-muted">{t("admin.none")}</p>
        ) : (
          <div className="overflow-x-auto">
            <div className="-mx-5 overflow-x-auto px-5">
              <table className="w-full min-w-[480px] text-sm">
                <thead className="text-muted">
                  <tr>
                    <th className="py-2 pe-2 text-start">{t("admin.date")}</th>
                    <th className="px-2 text-start">{t("admin.kind")}</th>
                    <th className="px-2 text-start">{t("admin.module")}</th>
                    <th className="px-2 text-end">{t("admin.score")}</th>
                    <th className="ps-2 text-end">{t("admin.duration")}</th>
                  </tr>
                </thead>
                <tbody>
                  {tests.map((a) => (
                    <tr key={a.id} className="border-t border-border">
                      <td className="py-2 pe-2">
                        <Link href={`/admin/tentative/${a.id}`} className="underline">
                          {formatDate(a.started_at)}
                        </Link>
                      </td>
                      <td className="px-2">{t(`kind.${a.kind}`)}</td>
                      <td className="px-2">
                        {a.module_id
                          ? (content.modules.get(a.module_id)?.title ?? a.module_id)
                          : "—"}
                      </td>
                      <td className="px-2 text-end">
                        {a.score ?? 0}/{a.total ?? 0}
                      </td>
                      <td className="ps-2 text-end">{duration(a)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="title text-[1.625rem]">{t("admin.mockExams")}</h2>
        {exams.length === 0 ? (
          <p className="text-muted">{t("admin.none")}</p>
        ) : (
          <div className="-mx-5 overflow-x-auto px-5">
            <table className="w-full text-sm">
              <thead className="text-muted">
                <tr>
                  <th className="py-2 pe-2 text-start">{t("admin.date")}</th>
                  <th className="px-2 text-end">{t("admin.score")}</th>
                  <th className="px-2 text-end">{t("admin.duration")}</th>
                  <th className="ps-2 text-end">{t("admin.passed")}</th>
                </tr>
              </thead>
              <tbody>
                {exams.map((a) => (
                  <tr key={a.id} className="border-t border-border">
                    <td className="py-2 pe-2">
                      <Link href={`/admin/tentative/${a.id}`} className="underline">
                        {formatDate(a.started_at)}
                      </Link>
                    </td>
                    <td className="px-2 text-end">
                      {a.score ?? 0}/{a.total ?? 0}
                    </td>
                    <td className="px-2 text-end">{duration(a)}</td>
                    <td className="ps-2 text-end">{a.passed ? t("admin.yes") : t("admin.no")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
