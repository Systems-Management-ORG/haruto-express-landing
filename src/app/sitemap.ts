import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { SITE_URL, localeUrl } from "@/shared/seo/business";

// One entry per locale home. Every entry advertises all locales via alternates so the
// hreflang cluster stays symmetric; x-default points at Vietnamese.
export default function sitemap(): MetadataRoute.Sitemap {
  const languages: Record<string, string> = {
    ...Object.fromEntries(routing.locales.map((locale) => [locale, localeUrl(locale)])),
    "x-default": `${SITE_URL}/vi`,
  };

  return routing.locales.map((locale) => ({
    url: localeUrl(locale),
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: locale === routing.defaultLocale ? 1 : 0.8,
    alternates: { languages },
  }));
}
