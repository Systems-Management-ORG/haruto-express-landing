import type { PageKey } from "@/shared/seo/pages";

// Home-page data layer. Every card points at a route in the page registry (pages.ts), and its
// title/excerpt come from `pages.<key>.*` in the messages, so a page renamed or re-slugged there
// updates the home cards too. Only presentation (image, icon slot, order) lives here.
//
// Layout follows the classic cargo-site home: hero, image service cards, accepted-goods tiles,
// reasons grid, route map, rates, guide cards, FAQ, contact.

// Route pages that carry a title + intro in the messages (home has neither).
export type ContentPage = Exclude<PageKey, "home">;

// Image service cards. Text: `pages.<page>.title` + `pages.<page>.intro`.
export const SERVICE_CARDS: { page: ContentPage; image: string }[] = [
  { page: "shipToJapan", image: "/images/haruto/hero/may-bay-tuyen-viet-nam-nhat-ban.webp" },
  { page: "shipToVietnam", image: "/images/haruto/hero/thung-hang-va-hang-nhat-nui-phu-si.webp" },
  { page: "concierge", image: "/images/haruto/mua-ho/mua-ho-hang-nhat.webp" },
  { page: "business", image: "/images/haruto/kho/kho-haruto-kien-hang-tren-pallet.jpg" },
];

// One tile per entry of `pages.goods.accepted.items`, in the same order.
export const GOODS_TILE_ICONS = ["clothing", "household", "books", "food"] as const;

// Reasons grid; text under `why.<key>.title|body`.
export const WHY_KEYS = ["warehouse", "consultant", "twoWay", "taxIncluded", "weightBands", "concierge"] as const;

// Guide cards: the first one is the large feature card. Text: `pages.<page>.title|intro`.
export const GUIDE_CARDS: { page: ContentPage; image: string }[] = [
  { page: "policy", image: "/images/haruto/kho/kho-haruto-kien-hang-tren-pallet.jpg" },
  { page: "japanWarehouse", image: "/images/haruto/kho/mat-tien-kho-haruto-express.jpg" },
  { page: "goods", image: "/images/haruto/kho/kho-haruto-thung-hang-xep-chong.webp" },
  { page: "faq", image: "/images/haruto/kho/khu-lam-viec-va-kien-hang-kho-haruto.jpg" },
];
