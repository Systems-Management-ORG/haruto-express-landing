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
  | "japanWarehouse"
  | "business"
  | "faq"
  | "contact"
  | "guides";

export type PageDef = {
  key: PageKey;
  slugs: Record<Locale, string>; // "" for home
  indexable: boolean;
  priority: number;
  changeFrequency: "daily" | "weekly" | "monthly";
  parent?: PageKey; // for breadcrumbs; home is the implicit root
  related: PageKey[]; // internal-linking block at the foot of the page
};

// Vietnamese localized slug, then the shared English slug (JA reuses it).
const s = (vi: string, en: string): Record<Locale, string> => ({ vi, en, ja: en });

export const PAGES: Record<PageKey, PageDef> = {
  home: { key: "home", slugs: s("", ""), indexable: true, priority: 1, changeFrequency: "weekly", related: ["pricing", "shipToJapan", "shipToVietnam"] },
  shipToJapan: { key: "shipToJapan", slugs: s("gui-hang-di-nhat", "ship-to-japan"), indexable: true, priority: 0.9, changeFrequency: "weekly", parent: "home", related: ["pricing", "goods", "japanWarehouse"] },
  shipToVietnam: { key: "shipToVietnam", slugs: s("ship-hang-nhat-ve-viet-nam", "ship-to-vietnam"), indexable: true, priority: 0.9, changeFrequency: "weekly", parent: "home", related: ["pricing", "concierge", "japanWarehouse"] },
  pricing: { key: "pricing", slugs: s("bang-gia", "pricing"), indexable: true, priority: 0.9, changeFrequency: "weekly", parent: "home", related: ["goods", "policy", "shipToJapan"] },
  goods: { key: "goods", slugs: s("hang-nhan-va-hang-cam", "accepted-and-prohibited-items"), indexable: true, priority: 0.7, changeFrequency: "monthly", parent: "home", related: ["pricing", "policy", "shipToJapan"] },
  policy: { key: "policy", slugs: s("chinh-sach-van-chuyen", "shipping-policy"), indexable: true, priority: 0.7, changeFrequency: "monthly", parent: "home", related: ["pricing", "goods", "japanWarehouse"] },
  concierge: { key: "concierge", slugs: s("mua-ho-hang-nhat", "japan-buying-service"), indexable: true, priority: 0.7, changeFrequency: "monthly", parent: "home", related: ["shipToVietnam", "pricing", "japanWarehouse"] },
  japanWarehouse: { key: "japanWarehouse", slugs: s("dia-chi-kho-nhat", "japan-warehouse"), indexable: true, priority: 0.7, changeFrequency: "monthly", parent: "home", related: ["shipToVietnam", "policy", "pricing"] },
  faq: { key: "faq", slugs: s("cau-hoi-thuong-gap", "faq"), indexable: true, priority: 0.6, changeFrequency: "monthly", parent: "home", related: ["pricing", "policy", "contact"] },
  // Thin / blocked until the business provides content; reachable in nav but noindex + off sitemap.
  business: { key: "business", slugs: s("doanh-nghiep", "business"), indexable: false, priority: 0.5, changeFrequency: "monthly", parent: "home", related: ["pricing", "shipToJapan"] },
  contact: { key: "contact", slugs: s("lien-he", "contact"), indexable: false, priority: 0.5, changeFrequency: "monthly", parent: "home", related: ["pricing", "faq"] },
  guides: { key: "guides", slugs: s("huong-dan", "guides"), indexable: false, priority: 0.5, changeFrequency: "monthly", parent: "home", related: ["pricing", "goods"] },
};

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
