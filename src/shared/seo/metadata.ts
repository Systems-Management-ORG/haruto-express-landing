import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/shared/constants/locales";
import { OG_SIZE, ogImagePath } from "./page-media";
import { type PageKey, hreflangLocales, hreflangMap, isIndexable, pagePath } from "./pages";

const OG_LOCALES: Record<Locale, string> = { vi: "vi_VN", ja: "ja_JP", en: "en_US" };

// Builds title, description, canonical, hreflang alternates, OpenGraph and robots for a page
// straight from the registry and the `pages.<key>` i18n namespace. One helper, every page.
export async function buildPageMetadata(locale: Locale, key: PageKey): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: `pages.${key}` });
  const footer = await getTranslations({ locale, namespace: "footer" });
  const title = t("metaTitle");
  const description = t("metaDescription");

  // hreflang only on an indexable locale, and then only listing the indexable locales.
  const indexable = isIndexable(key, locale);
  const languages = indexable ? hreflangMap(key) : undefined;
  const ogLocales = indexable ? hreflangLocales(key) : routing.locales;

  // Each page shares its own 1200×630 art (public/og, built by `npm run og:build`); home keeps
  // the brand card.
  const shareImage = [
    { url: ogImagePath(key), ...OG_SIZE, alt: key === "home" ? footer("logoAlt") : title },
  ];

  return {
    title,
    description,
    alternates: { canonical: pagePath(locale, key), languages },
    robots:
      indexable && process.env.ALLOW_INDEXING === "true"
        ? undefined
        : { index: false, follow: true },
    openGraph: {
      type: "website",
      siteName: "HARUTO EXPRESS",
      title,
      description,
      url: pagePath(locale, key),
      locale: OG_LOCALES[locale],
      alternateLocale: ogLocales.filter((l) => l !== locale).map((l) => OG_LOCALES[l]),
      images: shareImage,
    },
    twitter: { card: "summary_large_image", title, description, images: shareImage },
  };
}
