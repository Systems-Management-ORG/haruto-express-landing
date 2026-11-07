export const LOCALES = ["vi", "ja", "en"] as const;

export type Locale = (typeof LOCALES)[number];

export const LOCALE_LABELS: Record<Locale, string> = {
  vi: "VI",
  ja: "JA",
  en: "EN",
};

export const LOCALE_NAMES: Record<Locale, string> = {
  vi: "Tiếng Việt",
  ja: "日本語",
  en: "English",
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}
