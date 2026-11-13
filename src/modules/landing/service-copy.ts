import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/shared/constants/locales";
import type { PageKey } from "@/shared/seo/pages";

// Copy of the six service pages, one shape for all of them (messages: shipJp, shipVn, concierge,
// auction, fulfillment, customs). Every list is an object keyed by id: its key order is the
// display order, and icons/images in service-pages.ts attach to the id, never to an index.

export type Item = { title: string; body?: string };
type Section = { title: string; intro?: string; items: Record<string, Item> };

export type ServiceCopy = {
  hero: {
    eyebrow?: string; // small caps line above the H1
    titleA: string; // H1 part 1 (forest)
    titleB: string; // H1 part 2 (orange, on its own line)
    ribbon?: string; // green ribbon under the H1 (poster brand device)
    hook?: string; // one bold line before the lead (the pain point)
    lead: string;
    points?: string[]; // up to three proof bullets
    marketplacesLabel?: string;
    badge?: string; // round seal on the art (auction)
    imageAlt: string;
    artLabels?: { japan: string; vietnam: string }; // map tags on the route art (JP → VN)
    alert?: { title: string; body: string }; // warning callout (accepted & prohibited goods)
  };
  features?: Section & { more?: string };
  steps?: Section & { note?: string };
  audience?: Omit<Section, "intro">;
  benefits?: Section;
  terms?: { title: string; body: string };
  cta: { title: string; body: string; note?: string; primary?: string }; // primary = page's own label for its main button
};

export type ServiceKey = "shipToJapan" | "shipToVietnam" | "concierge" | "auction" | "business" | "goods";
export type ServiceNs = "shipJp" | "shipVn" | "concierge" | "auction" | "fulfillment" | "customs";

export const SERVICE_NS = {
  shipToJapan: "shipJp",
  shipToVietnam: "shipVn",
  concierge: "concierge",
  auction: "auction",
  business: "fulfillment",
  goods: "customs",
} as const satisfies Record<ServiceKey, ServiceNs>;

export function isServiceKey(key: PageKey): key is ServiceKey {
  return key in SERVICE_NS;
}

// Messages are typed against vi.json, whose six namespaces differ in which optional sections they
// carry, and t.raw's typing only accepts leaf keys; this is the one place that casts them to
// ServiceCopy.
type RawReader = (key: string) => unknown;

// Server components (sync).
export function useServiceCopy(key: ServiceKey): ServiceCopy {
  const t = useTranslations();
  return (t.raw as RawReader)(SERVICE_NS[key]) as ServiceCopy;
}

// Route page (async).
export async function getServiceCopy(locale: Locale, key: ServiceKey): Promise<ServiceCopy> {
  const t = await getTranslations({ locale });
  return (t.raw as RawReader)(SERVICE_NS[key]) as ServiceCopy;
}
