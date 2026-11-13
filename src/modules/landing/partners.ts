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
// yahoo-shopping / rakuma / mandarake: taken from the header of each store's own site (2026-11-13);
// zozotown / qoo10 / surugaya: SVG files supplied by the owner (their sites block automated access).
export const MARKETPLACE_LOGOS: Partial<Record<MarketplaceId, string>> = {
  yahoo: "/logo/yahoo-auction.svg",
  mercari: "/logo/mercari.svg",
  rakuten: "/logo/rakuten.svg",
  amazon: "/logo/amazon-jp.svg",
  yahooShopping: "/logo/yahoo-shopping.png",
  zozotown: "/logo/zozotown-logo.svg",
  rakuma: "/logo/rakuma.svg",
  qoo10: "/logo/Qoo10_logo.svg",
  surugaya: "/logo/Surugaya_logo.svg",
  mandarake: "/logo/mandarake.png",
};

// Logos that already spell the store's name (wordmarks): shown alone, with the name as alt text,
// instead of logo + the same name again.
export const MARKETPLACE_WORDMARKS: MarketplaceId[] = [
  "yahooShopping",
  "zozotown",
  "rakuma",
  "qoo10",
  "surugaya",
  "mandarake",
];

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

// Current logos from the header of each carrier's own site (2026-11-13); never the outdated marks
// found elsewhere online (e.g. Japan Post's pre-2007 "日本郵政公社").
// - yamato.png: the cat mark + ヤマト運輸 from the header image, without the slogan beside it.
// - japan-post.svg: the white JP POST mark on the #CC0000 header block it sits on there.
export const CARRIERS: Record<CarrierId, { logo?: string }> = {
  sagawa: { logo: "/logo/carriers/sagawa.svg" },
  yamato: { logo: "/logo/carriers/yamato.png" },
  japanPost: { logo: "/logo/carriers/japan-post.svg" },
};

export const CARRIER_ORDER: CarrierId[] = ["sagawa", "yamato", "japanPost"];
