// Single source of truth for business facts used in metadata and JSON-LD.
// Leave a value empty when it is not yet confirmed; empty values are never rendered
// into the UI or structured data (see the roadmap's "no invented business info" rule).

export const SITE_URL = (process.env.SITE_URL ?? "https://harutoexpress.com").replace(/\/$/, "");

export const BUSINESS = {
  name: "HARUTO EXPRESS",
  // Two-way air freight between Vietnam and Japan.
  legalName: "",
  logoPath: "/logo/haruto-mark.png",
  phone: "",
  email: "",
  // Contact channels — fill with real URLs to turn the contact rows into tracked links.
  zaloUrl: "",
  hotlineTel: "",
  messengerUrl: "",
  // Known addresses from the service policy; the Japan warehouse is a drop-off point, not a storefront.
  japanAddress: "〒133-0056 東京都江戸川区南小岩8-5-4 グリームコーポ101号",
  vietnamAddress: "60 Trương Công Giai, Cầu Giấy, Hà Nội",
  // Social / profile URLs for Organization.sameAs.
  sameAs: [] as string[],
} as const;

// Absolute URL for a locale home (the site is a single page per locale for now).
export function localeUrl(locale: string): string {
  return `${SITE_URL}/${locale}`;
}
