export const LOCALES = ["fr", "ary"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "fr";

export const LOCALE_DIR: Record<Locale, "ltr" | "rtl"> = {
  fr: "ltr",
  ary: "rtl",
};
