// Japanese stores HARUTO buys from and the carriers it works with inside Japan: the one data
// source for both. Names and notes live in the messages (`marketplaces.<id>`,
// `partners.carriers.items.<id>`); logos are the companies' own marks in public/logo, used only to
// name them. A store or carrier without a logo file shows its name instead; never draw one.

export type MarketplaceId =
  | "yahoo"
  | "mercari"
  | "rakuten"
  | "amazon"
  | "yahooShopping"
  | "zozotown"
  | "rakuma"
  | "qoo10"
  | "surugaya"
  | "mandarake";

// Logo of each store that has a file in public/logo. Stores without one → a text chip.
export const MARKETPLACE_LOGOS: Partial<Record<MarketplaceId, string>> = {
  yahoo: "/logo/yahoo-auction.svg",
  mercari: "/logo/mercari.svg",
  rakuten: "/logo/rakuten.svg",
  amazon: "/logo/amazon-jp.svg",
};

// Display order in the marquee (this list alone decides it).
export const MARQUEE_MARKETPLACES: MarketplaceId[] = [
  "yahoo",
  "mercari",
  "rakuten",
  "amazon",
  "yahooShopping",
  "zozotown",
  "rakuma",
  "qoo10",
  "surugaya",
  "mandarake",
];

export type CarrierId = "sagawa" | "yamato" | "japanPost";

// Official logos are not supplied yet; the logos found online are outdated marks (e.g. Japan Post's
// pre-2007 "日本郵政公社"), so none is used. Fill a path once the owner adds the file.
export const CARRIERS: Record<CarrierId, { logo?: string }> = {
  sagawa: {}, // TODO: official logo → "/logo/carriers/sagawa.svg"
  yamato: {}, // TODO: official logo → "/logo/carriers/yamato.svg"
  japanPost: {}, // TODO: official logo → "/logo/carriers/japan-post.svg"
};

export const CARRIER_ORDER: CarrierId[] = ["sagawa", "yamato", "japanPost"];
