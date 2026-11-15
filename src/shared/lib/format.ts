import type { Locale } from "@/shared/constants/locales";

// Number formatting per site locale: 130.000 (vi), 130,000 (ja, en). Amounts come from
// pricing-data.ts; the unit (VNĐ / VND, /kg…) stays in the messages.
export const NUMBER_LOCALE: Record<Locale, string> = { vi: "vi-VN", ja: "ja-JP", en: "en-US" };

export function formatVnd(amount: number, locale: Locale): string {
  return new Intl.NumberFormat(NUMBER_LOCALE[locale]).format(amount);
}
