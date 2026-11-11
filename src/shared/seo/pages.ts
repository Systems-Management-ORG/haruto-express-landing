import { routing } from "@/i18n/routing";
import { LOCALES as ALL_LOCALES, type Locale } from "@/shared/constants/locales";

// The single source of truth for every route. Sitemap, metadata, breadcrumbs, navigation and
// the dynamic [...rest] route all read from here — nothing hard-codes a URL.
//
// `slugs` is per-locale: Vietnamese pages use localized slugs (/vi/bang-gia) for VI search
// intent; JA/EN reuse English slugs. `indexable: false` → robots noindex + left out of sitemap.

export type PageKey =
  | "home"
  | "shipToJapan"
  | "shipToVietnam"
  | "pricing"
  | "goods"
  | "policy"
  | "concierge"
  | "auction"
  | "japanWarehouse"
  | "business"
  | "faq"
  | "contact"
  | "guides";

export type PageDef = {
  key: PageKey;
  slugs: Record<Locale, string>; // "" for home
  indexable: boolean;
  // Locales this page may be indexed in. Defaults to REVIEWED_LOCALES when `indexable` is true.
  indexableLocales?: readonly Locale[];
  // Sitemap lastmod, "YYYY-MM-DD": the last commit that changed this page's content
  // (git log -1 --format=%cs -- <its component/messages>). Changing a page's content → bump this.
  updatedAt: string;
  priority: number;
  changeFrequency: "daily" | "weekly" | "monthly";
  parent?: PageKey; // for breadcrumbs; home is the implicit root
  related: PageKey[]; // internal-linking block at the foot of the page
};

// Vietnamese localized slug, then the shared English slug (JA reuses it).
const s = (vi: string, en: string): Record<Locale, string> => ({ vi, en, ja: en });

export const PAGES: Record<PageKey, PageDef> = {
  home: { key: "home", slugs: s("", ""), indexable: true, updatedAt: "2026-11-10", priority: 1, changeFrequency: "weekly", related: ["pricing", "shipToJapan", "shipToVietnam"] },
  shipToJapan: { key: "shipToJapan", slugs: s("gui-hang-di-nhat", "ship-to-japan"), indexable: true, updatedAt: "2026-11-10", priority: 0.9, changeFrequency: "weekly", parent: "home", related: ["pricing", "goods", "japanWarehouse"] },
  shipToVietnam: { key: "shipToVietnam", slugs: s("ship-hang-nhat-ve-viet-nam", "ship-to-vietnam"), indexable: true, updatedAt: "2026-11-10", priority: 0.9, changeFrequency: "weekly", parent: "home", related: ["pricing", "concierge", "japanWarehouse"] },
  pricing: { key: "pricing", slugs: s("bang-gia", "pricing"), indexable: true, updatedAt: "2026-11-10", priority: 0.9, changeFrequency: "weekly", parent: "home", related: ["goods", "policy", "shipToJapan"] },
  goods: { key: "goods", slugs: s("hang-nhan-va-hang-cam", "accepted-and-prohibited-items"), indexable: true, updatedAt: "2026-11-10", priority: 0.7, changeFrequency: "monthly", parent: "home", related: ["pricing", "policy", "shipToJapan"] },
  policy: { key: "policy", slugs: s("chinh-sach-van-chuyen", "shipping-policy"), indexable: true, updatedAt: "2026-11-10", priority: 0.7, changeFrequency: "monthly", parent: "home", related: ["pricing", "goods", "japanWarehouse"] },
  concierge: { key: "concierge", slugs: s("mua-ho-hang-nhat", "japan-buying-service"), indexable: true, updatedAt: "2026-11-10", priority: 0.7, changeFrequency: "monthly", parent: "home", related: ["auction", "shipToVietnam", "japanWarehouse"] },
  auction: { key: "auction", slugs: s("dau-gia-ho-hang-nhat", "japan-auction-service"), indexable: true, updatedAt: "2026-11-10", priority: 0.8, changeFrequency: "monthly", parent: "home", related: ["concierge", "shipToVietnam", "japanWarehouse"] },
  japanWarehouse: { key: "japanWarehouse", slugs: s("dia-chi-kho-nhat", "japan-warehouse"), indexable: true, updatedAt: "2026-11-10", priority: 0.7, changeFrequency: "monthly", parent: "home", related: ["shipToVietnam", "policy", "pricing"] },
  faq: { key: "faq", slugs: s("cau-hoi-thuong-gap", "faq"), indexable: true, updatedAt: "2026-11-09", priority: 0.6, changeFrequency: "monthly", parent: "home", related: ["pricing", "policy", "contact"] },
  // Fulfillment (FFM) in Japan for businesses. Key and slug kept from the former "business" page.
  business: { key: "business", slugs: s("doanh-nghiep", "business"), indexable: true, updatedAt: "2026-11-10", priority: 0.8, changeFrequency: "monthly", parent: "home", related: ["japanWarehouse", "shipToVietnam", "shipToJapan"] },
  // Contact: real NAP (hotlines, chat channels, locations) from business.ts, so it is indexable.
  contact: { key: "contact", slugs: s("lien-he", "contact"), indexable: true, updatedAt: "2026-11-11", priority: 0.5, changeFrequency: "monthly", parent: "home", related: ["pricing", "faq"] },
  // Scaffold until the guides are written (S06): reachable in nav but noindex + off sitemap.
  guides: { key: "guides", slugs: s("huong-dan", "guides"), indexable: false, updatedAt: "2026-11-10", priority: 0.5, changeFrequency: "monthly", parent: "home", related: ["pricing", "goods"] },
};

// Locales whose copy a fluent reader has reviewed. Unreviewed locales still render, but as
// noindex, off the sitemap and out of the hreflang cluster.
// TODO(B1): confirm the JA/EN review. Until then all three stay indexable (the current
// behaviour); set this to ["vi"] to noindex JA/EN.
export const REVIEWED_LOCALES: readonly Locale[] = ["vi", "ja", "en"];

export function isIndexable(key: PageKey, locale: Locale): boolean {
  const def = PAGES[key];
  return def.indexable && (def.indexableLocales ?? REVIEWED_LOCALES).includes(locale);
}

// A page's hreflang cluster: only its indexable locales, so every member links the same set.
export function hreflangLocales(key: PageKey): Locale[] {
  return routing.locales.filter((locale) => isIndexable(key, locale));
}

// hreflang map for a page, x-default on Vietnamese when it is in the cluster. Empty when the
// page is indexable nowhere.
export function hreflangMap(key: PageKey, toUrl: (path: string) => string = (path) => path): Record<string, string> {
  const locales = hreflangLocales(key);
  if (locales.length === 0) return {};
  const fallback = locales.includes(routing.defaultLocale) ? routing.defaultLocale : locales[0];
  return {
    ...Object.fromEntries(locales.map((locale) => [locale, toUrl(pagePath(locale, key))])),
    "x-default": toUrl(pagePath(fallback, key)),
  };
}

export const PAGE_KEYS = Object.keys(PAGES) as PageKey[];
export const SUBPAGE_KEYS = PAGE_KEYS.filter((k) => k !== "home");
export const LOCALES = routing.locales;

export function pagePath(locale: Locale, key: PageKey): string {
  const slug = PAGES[key].slugs[locale];
  return slug ? `/${locale}/${slug}` : `/${locale}`;
}

// Resolve a single URL segment within a locale back to its page key.
export function pageByLocaleSlug(locale: Locale, slug: string): PageDef | undefined {
  return PAGE_KEYS.map((k) => PAGES[k]).find((p) => p.slugs[locale] === slug);
}

export { ALL_LOCALES };
