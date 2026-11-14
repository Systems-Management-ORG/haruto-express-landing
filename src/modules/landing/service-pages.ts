import {
  AirplaneTilt,
  Buildings,
  Calculator,
  ChatCircleText,
  ClipboardText,
  CreditCard,
  CurrencyJpy,
  Gavel,
  Gift,
  GlobeHemisphereEast,
  Handshake,
  Headset,
  LinkSimple,
  MagnifyingGlass,
  MapPinLine,
  Package,
  Path,
  Repeat,
  RocketLaunch,
  SealCheck,
  ShieldCheck,
  Stamp,
  Storefront,
  Truck,
  UsersThree,
  Warehouse,
} from "@phosphor-icons/react/dist/ssr";
import type { PageKey } from "@/shared/seo/pages";
import type { CtaAction } from "@/shared/ui/contact-cta";
import type { Visual } from "@/shared/ui/item-visual";
import type { MarketplaceId } from "./partners";
import type { ServiceKey } from "./service-copy";

// Presentation of the six service pages: art, icons/images per item id, which sections render
// and which actions the buttons take. The hero has no Zalo button (the floating Zalo button and
// the closing CTA band carry it). No copy here; that is in the messages (service-copy.ts).
// A section renders only when both its copy and (where listed) its config exist.

export type Art = { src: string; width: number; height: number; sizes: string; variant?: "route" | "seal" };

export type ServicePageConfig = {
  hero: {
    art: Art;
    marketplaces?: MarketplaceId[];
    withMore?: boolean;
    chips?: "customsGroups";
    eyebrowFromNav?: "pricing"; // no eyebrow in the copy → the menu group label (nav.groups.<id>)
    primary: CtaAction;
    secondary?: CtaAction;
  };
  features?: { visuals: Record<string, Visual>; links?: Partial<Record<string, PageKey>>; variant?: "tile" | "product" };
  custom?: "customs"; // goods groups + accepted/prohibited lists
  steps?: { visuals: Record<string, Visual> };
  partners?: ("marketplaces" | "carriers")[]; // PartnersSection right after the steps
  price?: "vnJp" | "jpVn";
  audience?: { visuals: Record<string, Visual> };
  benefits?: { visuals: Record<string, Visual>; chips?: { item: string; pages: PageKey[] } };
  terms?: true;
  conciergeTerms?: true; // buying / auction / shipping-only terms (policy.concierge)
  cta: { primary: CtaAction; secondary?: CtaAction };
};

const ART_SIZES = "(max-width: 1023px) 100vw, 50vw";
const IMG = "/images/haruto";
const img = (src: string, width: number, height: number): Visual => ({ src: `${IMG}/${src}.webp`, width, height });

const ALL_MARKETPLACES: MarketplaceId[] = ["yahoo", "mercari", "rakuten", "amazon"];

// The four-step shipping process shared by both route pages.
const SHIPPING_STEPS: Record<string, Visual> = {
  contact: { Icon: ChatCircleText },
  check: { Icon: ClipboardText },
  ship: { Icon: AirplaneTilt },
  deliver: { Icon: Truck },
};

export const SERVICE_PAGES: Record<ServiceKey, ServicePageConfig> = {
  shipToJapan: {
    hero: {
      art: { src: `${IMG}/ship-ve-vn/gui-hang-viet-nam-nhat-ban.webp`, width: 1192, height: 920, sizes: ART_SIZES },
      primary: "pricing",
    },
    features: {
      visuals: {
        receive: { Icon: Truck },
        gifts: { Icon: Gift },
        rules: { Icon: ClipboardText },
        customs: { Icon: Stamp },
        tracking: { Icon: MapPinLine },
      },
      links: { rules: "goods" },
    },
    steps: { visuals: SHIPPING_STEPS },
    partners: ["carriers"],
    price: "vnJp",
    audience: {
      visuals: {
        personal: { Icon: UsersThree },
        exporters: { Icon: Buildings },
        sellers: { Icon: Storefront },
        regular: { Icon: Repeat },
      },
    },
    benefits: {
      visuals: {
        ecosystem: { Icon: GlobeHemisphereEast },
        support: { Icon: Handshake },
        flexible: { Icon: Package },
        market: { Icon: RocketLaunch },
      },
      chips: { item: "ecosystem", pages: ["shipToVietnam", "concierge", "business"] },
    },
    cta: { primary: "zalo", secondary: "call" },
  },

  shipToVietnam: {
    hero: {
      art: { src: `${IMG}/ship-ve-vn/duong-bay-nhat-viet.webp`, width: 1201, height: 478, sizes: ART_SIZES, variant: "route" },
      marketplaces: ALL_MARKETPLACES,
      withMore: true,
      primary: "pricing",
    },
    features: {
      visuals: {
        buy: img("ship-ve-vn/icon-mua-ho", 122, 104),
        auction: img("ship-ve-vn/icon-dau-gia", 122, 104),
        consolidate: img("ship-ve-vn/icon-gom-hang", 122, 104),
        fast: img("ship-ve-vn/icon-ship-nhanh", 144, 104),
        trust: img("ship-ve-vn/icon-uy-tin", 122, 104),
      },
      links: { buy: "concierge", auction: "auction", consolidate: "japanWarehouse" },
    },
    steps: { visuals: SHIPPING_STEPS },
    partners: ["carriers"], // the hero already lists the stores: no marquee here
    price: "jpVn",
    benefits: {
      visuals: {
        fast: { Icon: AirplaneTilt },
        check: { Icon: MagnifyingGlass },
        tracking: { Icon: MapPinLine },
        support: { Icon: Headset },
      },
    },
    cta: { primary: "zalo", secondary: "call" },
  },

  concierge: {
    hero: {
      art: { src: `${IMG}/mua-ho/mua-ho-hang-nhat.webp`, width: 760, height: 1001, sizes: ART_SIZES },
      marketplaces: ALL_MARKETPLACES,
      primary: "contact",
    },
    steps: {
      visuals: {
        link: { Icon: LinkSimple },
        quote: { Icon: Calculator },
        pay: { Icon: CreditCard },
        warehouse: { Icon: Warehouse },
        ship: { Icon: AirplaneTilt },
      },
    },
    partners: ["marketplaces"], // every store, as on the home page (the hero shows only four)
    benefits: {
      visuals: {
        card: { Icon: CreditCard },
        rate: { Icon: CurrencyJpy },
        support: { Icon: Handshake },
        tracking: { Icon: Path },
      },
    },
    conciergeTerms: true,
    cta: { primary: "zalo", secondary: "call" },
  },

  auction: {
    hero: {
      art: { src: `${IMG}/dau-gia/dau-gia-hang-nhat-banner.webp`, width: 937, height: 600, sizes: ART_SIZES, variant: "seal" },
      marketplaces: ["yahoo", "rakuten", "mercari"],
      primary: "call",
    },
    features: {
      variant: "product",
      visuals: {
        electronics: img("dau-gia/may-anh", 188, 120),
        collectibles: img("dau-gia/mo-hinh-figure", 178, 134),
        fashion: img("dau-gia/tui-xach", 180, 116),
        household: img("dau-gia/noi-com-dien", 188, 134),
        rare: img("dau-gia/meo-than-tai", 180, 134),
      },
    },
    steps: {
      visuals: {
        link: { Icon: LinkSimple },
        quote: { Icon: ClipboardText },
        bid: { Icon: Gavel },
        ship: { Icon: Truck },
      },
    },
    benefits: {
      visuals: {
        fees: { Icon: ShieldCheck },
        support: { Icon: Headset },
        tracking: { Icon: Package },
        trust: { Icon: SealCheck },
      },
    },
    terms: true,
    cta: { primary: "zalo", secondary: "call" },
  },

  business: {
    hero: {
      art: { src: `${IMG}/ffm/kho-ffm-nhat-ban.webp`, width: 512, height: 552, sizes: ART_SIZES },
      primary: "contact",
    },
    steps: {
      visuals: {
        receive: img("ffm/buoc-nhan-hang", 136, 136),
        stock: img("ffm/buoc-ton-kho", 136, 136),
        pack: img("ffm/buoc-dong-goi", 136, 136),
        deliver: img("ffm/buoc-giao-hang", 136, 136),
        report: img("ffm/buoc-bao-cao", 136, 136),
      },
    },
    audience: {
      visuals: {
        exporters: img("ffm/dt-doanh-nghiep", 100, 84),
        retailers: img("ffm/dt-ban-le", 100, 84),
        crossborder: img("ffm/dt-tmdt", 100, 84),
        brands: img("ffm/dt-thuong-hieu", 100, 84),
      },
    },
    benefits: {
      visuals: {
        cost: img("ffm/lt-chi-phi", 78, 78),
        speed: img("ffm/lt-xu-ly", 78, 78),
        safe: img("ffm/lt-an-toan", 78, 78),
        focus: img("ffm/lt-phat-trien", 78, 78),
      },
    },
    cta: { primary: "contact", secondary: "zalo" },
  },

  goods: {
    hero: {
      art: { src: `${IMG}/hang-cam/canh-kiem-tra-hai-quan.webp`, width: 694, height: 466, sizes: ART_SIZES },
      chips: "customsGroups",
      eyebrowFromNav: "pricing",
      primary: "contact",
    },
    custom: "customs",
    cta: { primary: "zalo", secondary: "contact" },
  },
};
