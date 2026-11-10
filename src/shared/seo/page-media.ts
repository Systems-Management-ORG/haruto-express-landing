import type { PageKey } from "./pages";

// One topical image per subpage, shown beside the H1 in PageHero. `position` is the object-position
// for the crop: the banner illustrations keep their subject on the right, so they crop from there.
// Paths are under /public; every image here is HARUTO's own (warehouse photos, banner artwork).
export type PageImage = { src: string; position?: string };

const HERO = "/images/haruto/hero";
const KHO = "/images/haruto/kho";

export const PAGE_IMAGES: Record<Exclude<PageKey, "home">, PageImage> = {
  shipToJapan: { src: `${HERO}/may-bay-tuyen-viet-nam-nhat-ban.webp`, position: "72% 50%" },
  shipToVietnam: { src: `${HERO}/thung-hang-va-hang-nhat-nui-phu-si.webp`, position: "78% 50%" },
  pricing: { src: `${HERO}/may-bay-nui-phu-si-thap-tokyo-hoa-anh-dao.webp`, position: "80% 50%" },
  concierge: { src: "/images/haruto/muaho-mobile.png", position: "50% 55%" },
  auction: { src: "/images/haruto/dau-gia/dau-gia-hang-nhat-banner.webp", position: "60% 50%" },
  japanWarehouse: { src: `${KHO}/mat-tien-kho-haruto-express.jpg` },
  goods: { src: `${KHO}/kho-haruto-thung-hang-xep-chong.webp` },
  policy: { src: `${KHO}/kho-haruto-kien-hang-tren-pallet.jpg` },
  business: { src: `${KHO}/ben-trong-kho-haruto-express.jpg` },
  faq: { src: `${KHO}/khu-lam-viec-va-kien-hang-kho-haruto.jpg` },
  contact: { src: `${KHO}/kho-haruto-kien-hang-cho-xu-ly.jpg` },
  guides: { src: `${KHO}/kho-haruto-kien-hang-boc-mang.webp` },
};

// Section photos inside the pricing blocks.
export const PRICING_IMAGES = {
  clean: `${KHO}/kho-haruto-kien-hang-boc-mang.webp`,
  mixed: `${KHO}/khu-lam-viec-va-kien-hang-kho-haruto.jpg`,
  jpVn: `${HERO}/thung-hang-va-hang-nhat-nui-phu-si.webp`,
  vnJp: `${HERO}/may-bay-tuyen-viet-nam-nhat-ban.webp`,
} as const;
