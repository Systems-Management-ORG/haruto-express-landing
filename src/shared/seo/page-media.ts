import type { PageKey } from "./pages";

// One topical image per subpage, shown beside the H1 in PageHero. `position` is the object-position
// for the crop: the banner illustrations keep their subject on the right, so they crop from there.
// Paths are under /public; every image here is HARUTO's own (warehouse photos, banner artwork).
// `og` names the art for the 1200×630 share image when it differs from `src` (pages with their
// own poster-style banner share that banner). Keep this file free of path aliases: the OG
// generator script imports it with Node's type stripping.
export type PageImage = { src: string; position?: string; og?: string };

const HERO = "/images/haruto/hero";
const KHO = "/images/haruto/kho";

export const PAGE_IMAGES: Record<Exclude<PageKey, "home">, PageImage> = {
  shipToJapan: {
    src: `${HERO}/may-bay-tuyen-viet-nam-nhat-ban.webp`,
    position: "72% 50%",
    og: "/images/haruto/ship-ve-vn/gui-hang-viet-nam-nhat-ban.webp",
  },
  shipToVietnam: {
    src: `${HERO}/thung-hang-va-hang-nhat-nui-phu-si.webp`,
    position: "78% 50%",
    og: "/images/haruto/ship-ve-vn/duong-bay-nhat-viet.webp",
  },
  pricing: { src: `${HERO}/may-bay-nui-phu-si-thap-tokyo-hoa-anh-dao.webp`, position: "80% 50%" },
  concierge: { src: "/images/haruto/muaho-mobile.png", position: "50% 55%" },
  auction: { src: "/images/haruto/dau-gia/dau-gia-hang-nhat-banner.webp", position: "60% 50%" },
  japanWarehouse: { src: `${KHO}/mat-tien-kho-haruto-express.jpg` },
  goods: { src: `${KHO}/kho-haruto-thung-hang-xep-chong.webp`, og: "/images/haruto/hang-cam/canh-kiem-tra-hai-quan.webp" },
  policy: { src: `${KHO}/kho-haruto-kien-hang-tren-pallet.jpg` },
  business: { src: `${KHO}/ben-trong-kho-haruto-express.jpg`, og: "/images/haruto/ffm/kho-ffm-nhat-ban.webp" },
  faq: { src: `${KHO}/khu-lam-viec-va-kien-hang-kho-haruto.jpg` },
  contact: { src: `${KHO}/kho-haruto-kien-hang-cho-xu-ly.jpg` },
  guides: { src: `${KHO}/kho-haruto-kien-hang-boc-mang.webp` },
};

// Share image per page: generated into public/og by `npm run og:build`; the home page keeps the
// brand card. Re-run the script after changing a page's image.
export const OG_SIZE = { width: 1200, height: 630 } as const;
export const DEFAULT_OG_IMAGE = "/og/haruto-og.png";
export function ogImagePath(key: PageKey): string {
  return key === "home" ? DEFAULT_OG_IMAGE : `/og/${key}.jpg`;
}

// Section photos inside the pricing blocks.
export const PRICING_IMAGES = {
  clean: `${KHO}/kho-haruto-kien-hang-boc-mang.webp`,
  mixed: `${KHO}/khu-lam-viec-va-kien-hang-kho-haruto.jpg`,
  jpVn: `${HERO}/thung-hang-va-hang-nhat-nui-phu-si.webp`,
  vnJp: `${HERO}/may-bay-tuyen-viet-nam-nhat-ban.webp`,
} as const;
