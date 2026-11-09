import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/shared/constants/locales";
import { PAGES, type PageKey, pagePath } from "./pages";

const OG_LOCALES: Record<Locale, string> = { vi: "vi_VN", ja: "ja_JP", en: "en_US" };

// Builds title, description, canonical, hreflang alternates, OpenGraph and robots for a page
// straight from the registry and the `pages.<key>` i18n namespace. One helper, every page.
export async function buildPageMetadata(locale: Locale, key: PageKey): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: `pages.${key}` });
  const footer = await getTranslations({ locale, namespace: "footer" });
  const def = PAGES[key];

  const title = t("metaTitle");
  const description = t("metaDescription");

  // hreflang: this page in every locale plus x-default → Vietnamese.
  const languages: Record<string, string> = {
    ...Object.fromEntries(routing.locales.map((l) => [l, pagePath(l, key)])),
    "x-default": pagePath(routing.defaultLocale, key),
  };

  const shareImage = [{ url: "/og/haruto-og.png", width: 1200, height: 630, alt: footer("logoAlt") }];

  return {
    title,
    description,
    alternates: { canonical: pagePath(locale, key), languages },
    robots:
      def.indexable && process.env.ALLOW_INDEXING === "true"
        ? undefined
        : { index: false, follow: true },
    openGraph: {
      type: "website",
      siteName: "HARUTO EXPRESS",
      title,
      description,
      url: pagePath(locale, key),
      locale: OG_LOCALES[locale],
      alternateLocale: routing.locales.filter((l) => l !== locale).map((l) => OG_LOCALES[l]),
      images: shareImage,
    },
    twitter: { card: "summary_large_image", title, description, images: shareImage },
  };
}
