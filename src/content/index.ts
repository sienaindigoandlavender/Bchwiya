import { readContent, type Content } from "./load";
import { DEFAULT_LOCALE, type Locale } from "@/i18n/config";

export type { Content } from "./load";
export * from "./schema";

const cache = new Map<Locale, Content>();

/** Content for a locale, read once per server process. */
export function getContent(locale: Locale = DEFAULT_LOCALE): Content {
  let c = cache.get(locale);
  if (!c) {
    c = readContent(locale);
    cache.set(locale, c);
  }
  return c;
}

/** Lessons of a module that cover any of the given rules (used to suggest revisits). */
export function lessonsForRules(c: Content, moduleId: string | null, ruleIds: Iterable<string>) {
  const wanted = new Set(ruleIds);
  return [...c.lessons.values()].filter(
    (l) => (moduleId === null || l.moduleId === moduleId) && l.ruleIds.some((r) => wanted.has(r)),
  );
}
