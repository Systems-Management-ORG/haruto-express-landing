import type { MetadataRoute } from "next";
import { SITE_URL } from "@/shared/seo/business";
import { PAGE_KEYS, PAGES, hreflangLocales, hreflangMap, pagePath } from "@/shared/seo/pages";

// Built from the page registry: one entry per page per indexable locale. Each entry advertises
// the same indexable locales via alternates, so the hreflang cluster stays symmetric.
export default function sitemap(): MetadataRoute.Sitemap {
  const absolute = (path: string) => `${SITE_URL}${path}`;

  return PAGE_KEYS.flatMap((key) => {
    const def = PAGES[key];
    const languages = hreflangMap(key, absolute);
    return hreflangLocales(key).map((locale) => ({
      url: absolute(pagePath(locale, key)),
      lastModified: new Date(),
      changeFrequency: def.changeFrequency,
      priority: def.priority,
      alternates: { languages },
    }));
  });
}
