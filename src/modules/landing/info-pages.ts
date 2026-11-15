import {
  AddressBook,
  ArrowsOutLineHorizontal,
  BatteryCharging,
  CalendarCheck,
  Camera,
  ChatCircleDots,
  ClipboardText,
  Clock,
  Drop,
  Package,
  Phone,
  Receipt,
  Ruler,
  ShieldWarning,
  Snowflake,
  Star,
  Tree,
  VideoCamera,
} from "@phosphor-icons/react/dist/ssr";
import type { PageKey } from "@/shared/seo/pages";
import type { CtaAction } from "@/shared/ui/contact-cta";

// Presentation of the info pages (pricing hub, the two price-policy pages, policy, Japan
// warehouse, FAQ, guides, contact): which
// sections each renders, in order, and which actions the buttons take. Copy stays in the messages;
// icons and tones attach to item ids, never to array positions.

export type InfoKey = "pricing" | "priceVnJp" | "priceJpVn" | "policy" | "japanWarehouse" | "faq" | "guides" | "contact";
export type InfoSectionId =
  | "routes"
  | "calculator"
  | "ratesVnJp"
  | "ratesJpVn"
  | "surcharges"
  | "weightVnJp"
  | "weightJpVn"
  | "buyRate"
  | "freightJpVn"
  | "conciergeTerms"
  | "tipsVnJp"
  | "tipsJpVn"
  | "compensation"
  | "warehouse"
  | "carriers"
  | "warehouseTips"
  | "faqGroups"
  | "guideGrid"
  | "contact";

export type InfoPageConfig = {
  heroActions?: { primary: CtaAction; secondary?: CtaAction };
  // A pill with a calendar icon under the lead: `pricing.intro` (the hub) or `pricePolicy.effective`
  // (the two price-policy pages).
  heroNote?: "effectiveDate" | "effectiveRoute";
  toc?: InfoSectionId[]; // the FAQ page lists its question groups instead
  sections: InfoSectionId[]; // render order; backgrounds alternate ivory / sage by position
  faq: boolean; // the questions tagged for this page (the FAQ page uses faqGroups)
  cta?: { primary: CtaAction; secondary?: CtaAction }; // none → no closing CTA band
  // The price-policy pages: the route switch under the hero, and the calculator locked to it.
  route?: "vnJp" | "jpVn";
};

export const INFO_PAGES: Record<InfoKey, InfoPageConfig> = {
  // Hub: one card per route (to its price-policy page) and the freight calculator.
  pricing: {
    heroActions: { primary: "contact", secondary: "call" },
    heroNote: "effectiveDate",
    toc: ["routes", "calculator"],
    sections: ["routes", "calculator"],
    faq: true,
    cta: { primary: "zalo", secondary: "call" },
  },
  priceVnJp: {
    heroActions: { primary: "zalo", secondary: "call" },
    heroNote: "effectiveRoute",
    route: "vnJp",
    sections: ["ratesVnJp", "calculator", "surcharges", "weightVnJp", "compensation", "tipsVnJp"],
    faq: true,
    cta: { primary: "zalo", secondary: "call" },
  },
  priceJpVn: {
    heroActions: { primary: "zalo", secondary: "call" },
    heroNote: "effectiveRoute",
    route: "jpVn",
    sections: ["buyRate", "freightJpVn", "calculator", "surcharges", "weightJpVn", "compensation", "conciergeTerms", "warehouse", "tipsJpVn"],
    faq: true,
    cta: { primary: "zalo", secondary: "call" },
  },
  policy: {
    heroActions: { primary: "contact" },
    toc: ["weightVnJp", "weightJpVn", "compensation"],
    sections: ["weightVnJp", "weightJpVn", "compensation"],
    faq: true,
    cta: { primary: "zalo", secondary: "contact" },
  },
  japanWarehouse: {
    sections: ["warehouse", "carriers", "warehouseTips"],
    faq: true,
    cta: { primary: "zalo", secondary: "call" },
  },
  faq: {
    heroActions: { primary: "contact" },
    sections: ["faqGroups"],
    faq: false,
    cta: { primary: "zalo", secondary: "contact" },
  },
  guides: {
    sections: ["guideGrid"],
    faq: false,
    cta: { primary: "zalo", secondary: "contact" },
  },
  contact: {
    sections: ["contact"],
    faq: false,
  },
};

export function isInfoKey(key: PageKey): key is InfoKey {
  return key in INFO_PAGES;
}

// Section id → the anchor used in the page (kebab-case), e.g. ratesVnJp → rates-vn-jp.
export const anchorOf = (id: string) => id.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

// Feature lines of the VN→JP rate cards (`pricing.vnJp.<kind>.features.<id>`).
export type Tone = "info" | "ok" | "warn" | "ban";
export const PRICING_FEATURE_TONES: Record<"clean" | "mixed", Record<string, Tone>> = {
  clean: { goods: "info", guarantee: "ok", taxIncluded: "ok", freePacking: "ok", wholesale: "ok" },
  mixed: { taxIncluded: "ok", accepted: "ok", notGuaranteed: "warn", prohibited: "ban" },
};

// Surcharge rows (`pricing.surcharge.items.<id>`).
export const SURCHARGE_ICONS: Record<string, typeof Package> = {
  electronics: BatteryCharging,
  perfume: Drop,
  carton: Package,
  wooden: Tree,
  foam: Snowflake,
  special: Star,
  other: ChatCircleDots,
};

// Shipping tips (`policy.tips.items.<id>`).
export const TIP_ICONS: Record<string, typeof Package> = {
  photo: Camera,
  declare: ClipboardText,
  receipt: Receipt,
  recipient: AddressBook,
  video: VideoCamera,
  shelfLife: Clock,
  redelivery: CalendarCheck,
  customsRisk: ShieldWarning,
};

// Which tips each page lists, in order (`policy.tips.items.<id>`): the VN→JP and JP→VN PDFs list
// different ones.
export const TIPS: Record<"vnJp" | "jpVn" | "warehouse", string[]> = {
  vnJp: ["photo", "declare", "receipt", "recipient", "customsRisk", "shelfLife", "video", "redelivery"],
  jpVn: ["photo", "declare", "receipt"],
  warehouse: ["photo", "declare", "receipt", "recipient", "video", "shelfLife", "redelivery"],
};

// The cases in which a VN→JP parcel is charged as bulky (`pricePolicy.vnJpWeight.cases.<id>`).
export const VN_JP_BULKY_CASES: Record<"oversize" | "longSide" | "contact", { Icon: typeof Package; tone: Tone }> = {
  oversize: { Icon: Ruler, tone: "warn" },
  longSide: { Icon: ArrowsOutLineHorizontal, tone: "warn" },
  contact: { Icon: Phone, tone: "info" },
};

// Question groups of the FAQ page. A question belongs to the group of its first tag (ignoring
// "home"); one that matches no group goes to "shipping". Empty groups are not rendered.
export const FAQ_GROUPS: { id: "shipping" | "buying" | "warehouse" | "business"; tags: PageKey[] }[] = [
  { id: "shipping", tags: ["shipToJapan", "shipToVietnam", "pricing", "priceVnJp", "priceJpVn", "policy", "goods"] },
  { id: "buying", tags: ["concierge", "auction"] },
  { id: "warehouse", tags: ["japanWarehouse"] },
  { id: "business", tags: ["business"] },
];
