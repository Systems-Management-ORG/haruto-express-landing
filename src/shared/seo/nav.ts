import type { PageKey } from "./pages";

// Grouped primary navigation, modelled on the Tiximax taxonomy (Dịch vụ / Bảng giá / Hướng dẫn
// as dropdowns, Liên hệ as a direct link). Group labels live under the `nav.groups` i18n key;
// each child's label is `pages.<key>.nav`.
export type NavItem =
  | { type: "link"; key: PageKey }
  | { type: "group"; id: "services" | "pricing" | "guides" | "policies"; children: PageKey[] };

export const NAV: NavItem[] = [
  { type: "group", id: "services", children: ["shipToJapan", "shipToVietnam", "concierge", "auction", "business"] },
  { type: "group", id: "pricing", children: ["priceVnJp", "priceJpVn", "goods"] },
  { type: "group", id: "guides", children: ["guides", "japanWarehouse", "faq"] },
  { type: "group", id: "policies", children: ["policy", "insurancePolicy", "auctionPolicy"] },
  { type: "link", key: "contact" },
];
