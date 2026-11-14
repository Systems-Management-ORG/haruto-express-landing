import type Messages from "@/i18n/messages/vi.json";
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

// The service flow, one lane per direction (lane = the route key of `pricing.teaser`). Step text:
// `home.flow.steps.<id>`. Icons are keyed by step id here.
export type FlowIcon = "ShoppingCart" | "Warehouse" | "AirplaneTilt" | "House" | "Storefront" | "Package" | "Truck";
type FlowStepId = keyof (typeof Messages)["home"]["flow"]["steps"];
export const FLOW_LANES: { lane: "jpVn" | "vnJp"; steps: { id: FlowStepId; icon: FlowIcon }[] }[] = [
  {
    lane: "jpVn",
    steps: [
      { id: "buy", icon: "ShoppingCart" },
      { id: "warehouse", icon: "Warehouse" },
      { id: "flyToVn", icon: "AirplaneTilt" },
      { id: "receive", icon: "House" },
    ],
  },
  {
    lane: "vnJp",
    steps: [
      { id: "dropoff", icon: "Storefront" },
      { id: "pack", icon: "Package" },
      { id: "flyToJp", icon: "AirplaneTilt" },
      { id: "deliver", icon: "Truck" },
    ],
  },
];

// Who-it-is-for cards on the home page. Text: `home.audience.items.<id>.title|body`; each card
// links to the pages that serve that need (labels: `pages.<page>.nav`).
export const AUDIENCE_CARDS: { id: keyof (typeof Messages)["home"]["audience"]["items"]; icon: "Gift" | "ShoppingBag" | "Storefront" | "Buildings"; pages: ContentPage[] }[] = [
  { id: "personal", icon: "Gift", pages: ["shipToJapan"] },
  { id: "shoppers", icon: "ShoppingBag", pages: ["concierge", "auction"] },
  { id: "sellers", icon: "Storefront", pages: ["japanWarehouse", "shipToVietnam"] },
  { id: "business", icon: "Buildings", pages: ["business"] },
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
