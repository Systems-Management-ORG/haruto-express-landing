// Single source of truth for business facts used in metadata and JSON-LD.
// Leave a value empty when it is not yet confirmed; empty values are never rendered
// into the UI or structured data (see the roadmap's "no invented business info" rule).

export const SITE_URL = (process.env.SITE_URL ?? "https://harutoexpress.com").replace(/\/$/, "");

export const BUSINESS = {
  name: "HARUTO EXPRESS",
  // Two-way air freight between Vietnam and Japan.
  // TODO(B3): registered legal name (and tax code) once the business confirms it.
  legalName: "",
  logoPath: "/logo/haruto-mark.png",
  phone: "",
  email: "",
  // Contact channels — fill with real URLs to turn the contact rows into tracked links.
  // Zalo opens a chat with the sales consultant; the fanpage is the business Facebook page.
  zaloUrl: "https://zalo.me/0334992147",
  facebookUrl: "https://www.facebook.com/VnjpLogisticVanChuyen2ChieuVietNhat",
  messengerUrl: "",
  // Social / profile URLs for Organization.sameAs.
  sameAs: ["https://www.facebook.com/VnjpLogisticVanChuyen2ChieuVietNhat"] as string[],
} as const;

// Hotlines per country. `display` is how the number is written locally; `tel` is the E.164 form
// for tel: links and structured data. Labels live under `contact.hotlines.<id>`.
export type HotlineId = "japan" | "vietnam";
export const HOTLINES: { id: HotlineId; display: string; tel: string; country: "JP" | "VN" }[] = [
  { id: "japan", display: "070-3850-5733", tel: "+81-70-3850-5733", country: "JP" },
  { id: "vietnam", display: "0334-992-147", tel: "+84-334-992-147", country: "VN" },
];

export const telHref = (tel: string) => `tel:${tel.replace(/-/g, "")}`;

// Physical locations. `id` keys an i18n label under `locations.<id>`; `query` is what Google Maps
// searches on. The Japan warehouse is the drop-off point for the JP→VN route.
export type LocationId = "japanWarehouse" | "vietnamWarehouse" | "vietnamOffice";

// `embedSrc` overrides the keyless embed with an exact Google Maps embed URL (e.g. a Street View
// panorama) when the business supplies one.
//
// The structured fields feed PostalAddress in JSON-LD; an empty string is dropped, never guessed
// (Vietnamese postal codes are not confirmed, so they stay empty).
// `publicVisit`: true only when customers can walk in. It gates the LocalBusiness node.
// TODO(B4): confirm whether the HCM office and the Hanoi warehouse receive customers, and
// their opening hours (schema.org form, e.g. "Mo-Sa 08:00-17:30").
export type Location = {
  id: LocationId;
  address: string;
  query: string;
  embedSrc?: string;
  streetAddress: string;
  addressLocality: string;
  addressRegion: string;
  postalCode: string;
  addressCountry: "VN" | "JP";
  geo?: { latitude: number; longitude: number };
  publicVisit: boolean;
  openingHours?: string[];
};

export const LOCATIONS: Location[] = [
  {
    id: "japanWarehouse",
    address: "〒133-0056 東京都江戸川区南小岩8-5-4 グリームコーポ1階102号室",
    query: "〒133-0056 東京都江戸川区南小岩8-5-4",
    streetAddress: "南小岩8-5-4 グリームコーポ1階102号室",
    addressLocality: "江戸川区",
    addressRegion: "東京都",
    postalCode: "133-0056",
    addressCountry: "JP",
    // A parcel drop-off point for the JP→VN route, not a walk-in shop.
    publicVisit: false,
  },
  {
    id: "vietnamWarehouse",
    address: "60 Trương Công Giai, Cầu Giấy, Hà Nội",
    query: "60 Trương Công Giai, Cầu Giấy, Hà Nội, Việt Nam",
    streetAddress: "60 Trương Công Giai",
    addressLocality: "Cầu Giấy",
    addressRegion: "Hà Nội",
    postalCode: "",
    addressCountry: "VN",
    publicVisit: false, // TODO(B4)
  },
  {
    id: "vietnamOffice",
    address: "340/16 Quang Trung, Gò Vấp, Hồ Chí Minh",
    streetAddress: "340/16 Quang Trung",
    addressLocality: "Gò Vấp",
    addressRegion: "Hồ Chí Minh",
    postalCode: "",
    addressCountry: "VN",
    geo: { latitude: 10.83257079820806, longitude: 106.6688930732914 },
    publicVisit: false, // TODO(B4)
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
