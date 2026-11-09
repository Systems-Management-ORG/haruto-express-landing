import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/shared/seo/business";
import { PAGE_KEYS, PAGES, pagePath } from "@/shared/seo/pages";

// Built from the page registry: one entry per indexable page per locale, each advertising all
// locales via alternates so the hreflang cluster stays symmetric. x-default points at Vietnamese.
export default function sitemap(): MetadataRoute.Sitemap {
  const indexable = PAGE_KEYS.filter((key) => PAGES[key].indexable);

  return indexable.flatMap((key) => {
    const def = PAGES[key];
    const languages: Record<string, string> = {
      ...Object.fromEntries(routing.locales.map((locale) => [locale, `${SITE_URL}${pagePath(locale, key)}`])),
      "x-default": `${SITE_URL}${pagePath(routing.defaultLocale, key)}`,
    };
    return routing.locales.map((locale) => ({
      url: `${SITE_URL}${pagePath(locale, key)}`,
      lastModified: new Date(),
      changeFrequency: def.changeFrequency,
      priority: def.priority,
      alternates: { languages },
    }));
  });
}
