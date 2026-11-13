// Japanese stores HARUTO buys from. Names and notes live under `marketplaces.<id>` in the
// messages (one source for every page); the logos are the stores' own marks, used only to name
// the store (public/logo).
export type MarketplaceId = "yahoo" | "mercari" | "rakuten" | "amazon";

export const MARKETPLACE_LOGOS: Record<MarketplaceId, string> = {
  yahoo: "/logo/yahoo-auction.svg",
  mercari: "/logo/mercari.svg",
  rakuten: "/logo/rakuten.svg",
  amazon: "/logo/amazon-jp.svg",
};
