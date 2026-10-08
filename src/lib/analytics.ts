import type { Rule } from "@/content/schema";
import type { AnswerRow } from "@/lib/supabase/types";

export type RuleFlag = "hesitation" | "confusion";

export type RuleStats = {
  rule: Rule;
  answers: number;
  accuracyPct: number | null;
  avgTimeMs: number | null;
  avgChanges: number | null;
  flags: RuleFlag[];
};

type AnswerLike = Pick<AnswerRow, "rule_ids" | "correct" | "time_to_submit_ms" | "change_count">;

export function median(values: number[]): number | null {
  if (!values.length) return null;
  const s = [...values].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid]! : (s[mid - 1]! + s[mid]!) / 2;
}

const avg = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null);

/**
 * Rolls answers up to rules. Flags, relative to her own median answer time:
 * - Hésitation: at least half of her correct answers were slow or changed.
 * - Confusion: at least half of her wrong answers were fast.
 * Sorted weakest first; rules with no answers go last.
 */
export function ruleStats(rules: Rule[], answers: AnswerLike[]) {
  const med = median(
    answers.map((a) => a.time_to_submit_ms).filter((n): n is number => n !== null),
  );
  const byRule = new Map<string, AnswerLike[]>();
  for (const a of answers) {
    for (const r of a.rule_ids) {
      const list = byRule.get(r) ?? [];
      list.push(a);
      byRule.set(r, list);
    }
  }

  const stats: RuleStats[] = rules.map((rule) => {
    const list = byRule.get(rule.id) ?? [];
    const right = list.filter((a) => a.correct);
    const wrong = list.filter((a) => !a.correct);
    const flags: RuleFlag[] = [];
    if (med !== null) {
      const hesitant = right.filter(
        (a) => (a.time_to_submit_ms ?? 0) > med || (a.change_count ?? 0) >= 1,
      );
      if (right.length && hesitant.length / right.length >= 0.5) flags.push("hesitation");
      const hasty = wrong.filter((a) => a.time_to_submit_ms !== null && a.time_to_submit_ms < med);
      if (wrong.length && hasty.length / wrong.length >= 0.5) flags.push("confusion");
    }
    return {
      rule,
      answers: list.length,
      accuracyPct: list.length ? Math.round((right.length / list.length) * 100) : null,
      avgTimeMs: avg(list.map((a) => a.time_to_submit_ms ?? 0)),
      avgChanges: avg(list.map((a) => a.change_count ?? 0)),
      flags,
    };
  });

  stats.sort((a, b) => (a.accuracyPct ?? 101) - (b.accuracyPct ?? 101) || b.answers - a.answers);
  return { stats, medianMs: med };
}

export function formatMs(ms: number | null): string {
  if (ms === null) return "—";
  if (ms < 60_000) return `${(ms / 1000).toFixed(1)} s`;
  const min = Math.floor(ms / 60_000);
  const s = Math.round((ms % 60_000) / 1000);
  return `${min} min ${String(s).padStart(2, "0")}`;
}

export function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("fr-MA", { dateStyle: "medium", timeStyle: "short" }).format(
    new Date(iso),
  );
}
