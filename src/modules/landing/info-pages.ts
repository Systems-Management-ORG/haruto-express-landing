import {
  AddressBook,
  BatteryCharging,
  CalendarCheck,
  Camera,
  ChatCircleDots,
  ClipboardText,
  Clock,
  Drop,
  Package,
  Receipt,
  Snowflake,
  Star,
  Tree,
  VideoCamera,
} from "@phosphor-icons/react/dist/ssr";
import type { PageKey } from "@/shared/seo/pages";
import type { CtaAction } from "@/shared/ui/contact-cta";

// Presentation of the info pages (pricing, policy, Japan warehouse, FAQ, guides, contact): which
// sections each renders, in order, and which actions the buttons take. Copy stays in the messages;
// icons and tones attach to item ids, never to array positions.

export type InfoKey = "pricing" | "policy" | "japanWarehouse" | "faq" | "guides" | "contact";
export type InfoSectionId =
  | "ratesVnJp"
  | "ratesJpVn"
  | "surcharges"
  | "weight"
  | "compensation"
  | "warehouse"
  | "carriers"
  | "warehouseTips"
  | "faqGroups"
  | "guideGrid"
  | "contact";

export type InfoPageConfig = {
  heroActions?: { primary: CtaAction; secondary?: CtaAction };
  heroNote?: "effectiveDate"; // pricing: `pricing.intro` as a pill with a calendar icon
  toc?: InfoSectionId[]; // the FAQ page lists its question groups instead
  sections: InfoSectionId[]; // render order; backgrounds alternate ivory / sage by position
  faq: boolean; // the questions tagged for this page (the FAQ page uses faqGroups)
  cta?: { primary: CtaAction; secondary?: CtaAction }; // none → no closing CTA band
};

export const INFO_PAGES: Record<InfoKey, InfoPageConfig> = {
  pricing: {
    heroActions: { primary: "contact", secondary: "call" },
    heroNote: "effectiveDate",
    toc: ["ratesVnJp", "ratesJpVn", "surcharges", "weight"],
    sections: ["ratesVnJp", "ratesJpVn", "surcharges", "weight"],
    faq: true,
    cta: { primary: "zalo", secondary: "call" },
  },
  policy: {
    heroActions: { primary: "contact" },
    toc: ["weight", "compensation"],
    sections: ["weight", "compensation"],
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
};

// Question groups of the FAQ page. A question belongs to the group of its first tag (ignoring
// "home"); one that matches no group goes to "shipping". Empty groups are not rendered.
export const FAQ_GROUPS: { id: "shipping" | "buying" | "warehouse" | "business"; tags: PageKey[] }[] = [
  { id: "shipping", tags: ["shipToJapan", "shipToVietnam", "pricing", "policy", "goods"] },
  { id: "buying", tags: ["concierge", "auction"] },
  { id: "warehouse", tags: ["japanWarehouse"] },
  { id: "business", tags: ["business"] },
];
