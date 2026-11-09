import { routing } from "@/i18n/routing";
import type { Locale } from "@/shared/constants/locales";

// The single source of truth for every indexable route. Sitemap, metadata, breadcrumbs,
// navigation and the dynamic [page] route all read from here — nothing hard-codes a URL.
//
// `slug` is the URL segment, shared across locales (e.g. /vi/pricing, /en/pricing). Localised
// Vietnamese slugs are a documented follow-up; shared segments keep next-intl routing robust
// while canonical + hreflang (built from this registry) already deliver the SEO structure.
//
// `indexable: false` → the page renders with robots noindex and is left out of the sitemap.
// Thin pages and anything missing confirmed business data stay non-indexable per the roadmap.

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
  slug: string; // "" for home
  indexable: boolean;
  priority: number;
  changeFrequency: "daily" | "weekly" | "monthly";
  parent?: PageKey; // for breadcrumbs; home is the implicit root
  related: PageKey[]; // internal linking block at the foot of the page
};

export const PAGES: Record<PageKey, PageDef> = {
  home: { key: "home", slug: "", indexable: true, priority: 1, changeFrequency: "weekly", related: ["pricing", "shipToJapan", "shipToVietnam"] },
  shipToJapan: { key: "shipToJapan", slug: "ship-to-japan", indexable: true, priority: 0.9, changeFrequency: "weekly", parent: "home", related: ["pricing", "goods", "japanWarehouse"] },
  shipToVietnam: { key: "shipToVietnam", slug: "ship-to-vietnam", indexable: true, priority: 0.9, changeFrequency: "weekly", parent: "home", related: ["pricing", "concierge", "japanWarehouse"] },
  pricing: { key: "pricing", slug: "pricing", indexable: true, priority: 0.9, changeFrequency: "weekly", parent: "home", related: ["goods", "policy", "shipToJapan"] },
  goods: { key: "goods", slug: "accepted-and-prohibited-items", indexable: true, priority: 0.7, changeFrequency: "monthly", parent: "home", related: ["pricing", "policy", "shipToJapan"] },
  policy: { key: "policy", slug: "shipping-policy", indexable: true, priority: 0.7, changeFrequency: "monthly", parent: "home", related: ["pricing", "goods", "japanWarehouse"] },
  concierge: { key: "concierge", slug: "japan-buying-service", indexable: true, priority: 0.7, changeFrequency: "monthly", parent: "home", related: ["shipToVietnam", "pricing", "japanWarehouse"] },
  japanWarehouse: { key: "japanWarehouse", slug: "japan-warehouse", indexable: true, priority: 0.7, changeFrequency: "monthly", parent: "home", related: ["shipToVietnam", "policy", "pricing"] },
  faq: { key: "faq", slug: "faq", indexable: true, priority: 0.6, changeFrequency: "monthly", parent: "home", related: ["pricing", "policy", "contact"] },
  // Thin / blocked until the business provides content; reachable in nav but noindex + off sitemap.
  business: { key: "business", slug: "business", indexable: false, priority: 0.5, changeFrequency: "monthly", parent: "home", related: ["pricing", "shipToJapan"] },
  contact: { key: "contact", slug: "contact", indexable: false, priority: 0.5, changeFrequency: "monthly", parent: "home", related: ["pricing", "faq"] },
  guides: { key: "guides", slug: "guides", indexable: false, priority: 0.5, changeFrequency: "monthly", parent: "home", related: ["pricing", "goods"] },
};

export const PAGE_KEYS = Object.keys(PAGES) as PageKey[];

// Keys that have a real route folder segment (everything except home).
export const SUBPAGE_KEYS = PAGE_KEYS.filter((k) => k !== "home");

export function pagePath(locale: Locale, key: PageKey): string {
  const slug = PAGES[key].slug;
  return slug ? `/${locale}/${slug}` : `/${locale}`;
}

export function pageBySlug(slug: string): PageDef | undefined {
  return PAGE_KEYS.map((k) => PAGES[k]).find((p) => p.slug === slug);
}

export const LOCALES = routing.locales;
