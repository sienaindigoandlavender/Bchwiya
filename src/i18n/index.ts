import { fr, type Dictionary } from "./fr";
import { DEFAULT_LOCALE, LOCALE_DIR, type Locale } from "./config";

export type MessageKey = keyof typeof fr;

const dictionaries: Partial<Record<Locale, Dictionary>> = { fr };

export const locale: Locale = DEFAULT_LOCALE;
export const dir = LOCALE_DIR[locale];

/** Translate a key, filling `{placeholders}` from params. Falls back to French. */
export function t(key: MessageKey, params?: Record<string, string | number>): string {
  const template = dictionaries[locale]?.[key] ?? fr[key];
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in params ? String(params[name]) : match,
  );
}
