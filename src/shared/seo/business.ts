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
  // Social / profile URLs for Organization.sameAs.
  sameAs: [] as string[],
} as const;

// Physical locations. `id` keys an i18n label under `locations.<id>`; `query` is what Google Maps
// searches on. The Japan warehouse is the drop-off point for the JP→VN route.
export type LocationId = "japanWarehouse" | "vietnamWarehouse" | "vietnamOffice";

// `embedSrc` overrides the keyless embed with an exact Google Maps embed URL (e.g. a Street View
// panorama) when the business supplies one.
export const LOCATIONS: { id: LocationId; address: string; query: string; embedSrc?: string }[] = [
  {
    id: "japanWarehouse",
    address: "〒133-0056 東京都江戸川区南小岩8-5-4 グリームコーポ1階102号室",
    query: "〒133-0056 東京都江戸川区南小岩8-5-4",
  },
  {
    id: "vietnamWarehouse",
    address: "60 Trương Công Giai, Cầu Giấy, Hà Nội",
    query: "60 Trương Công Giai, Cầu Giấy, Hà Nội, Việt Nam",
  },
  {
    id: "vietnamOffice",
    address: "340/16 Quang Trung, Gò Vấp, Hồ Chí Minh",
    // Exact coordinates from the office embed, so "Open in Google Maps" lands precisely.
    query: "10.83257079820806,106.6688930732914",
    embedSrc:
      "https://www.google.com/maps/embed?pb=!4v1794218786287!6m8!1m7!1s4WuVnLmBitDS8G1VEGHvtA!2m2!1d10.83257079820806!2d106.6688930732914!3f221.14247711853298!4f18.63707504340229!5f0.4000000000000002",
  },
];

export const locationById = (id: LocationId) => LOCATIONS.find((l) => l.id === id);

// Link that opens the place in Google Maps.
export const mapsUrl = (query: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

// Keyless interactive embed (output=embed). CSP must allow frame-src https://www.google.com.
export const mapsEmbed = (query: string) =>
  `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;

// Absolute URL for a locale home (the site is a single page per locale for now).
export function localeUrl(locale: string): string {
  return `${SITE_URL}/${locale}`;
}
