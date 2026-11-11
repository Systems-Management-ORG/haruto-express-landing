import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/shared/constants/locales";
import { MotionLayer } from "@/modules/landing/components/motion-layer";
import { SiteFooter } from "@/modules/landing/components/site-footer";
import { SiteHeader } from "@/modules/landing/components/site-header";
import { SubPage } from "@/modules/landing/components/subpage";
import { JsonLd } from "@/shared/seo/json-ld";
import { buildPageMetadata } from "@/shared/seo/metadata";
import { LOCALES, PAGES, SUBPAGE_KEYS, type PageKey, pageByLocaleSlug, pagePath } from "@/shared/seo/pages";
import { SITE_URL } from "@/shared/seo/business";
import { breadcrumb, contactPage, faqPage, perKgOffer, service } from "@/shared/seo/schema";
import { JP_VN, VN_JP_CLEAN, lowestRate } from "@/modules/landing/pricing-data";

type Props = { params: Promise<{ locale: string; rest: string[] }> };

// Regenerate daily so the footer year stays current without a rebuild.
export const revalidate = 86400;
// Only the registry's slugs exist; every other path is a real 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    SUBPAGE_KEYS.map((key) => ({ locale, rest: [PAGES[key].slugs[locale]] })),
  );
}

function resolveKey(locale: Locale, rest: string[]): Exclude<PageKey, "home"> | null {
  if (rest.length !== 1) return null;
  const def = pageByLocaleSlug(locale, rest[0]);
  if (!def || def.key === "home") return null;
  return def.key as Exclude<PageKey, "home">;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, rest } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const key = resolveKey(locale as Locale, rest);
  if (!key) return {};
  return buildPageMetadata(locale as Locale, key);
}

// Service-type pages get a Service node; the FAQ page gets FAQPage. Every page gets a breadcrumb.
// serviceType is a fixed English label per page (stable across locales and copy edits).
const SERVICE_TYPES: Partial<Record<PageKey, string>> = {
  shipToJapan: "Air freight Vietnam to Japan",
  shipToVietnam: "Air freight Japan to Vietnam",
  pricing: "Air freight between Vietnam and Japan",
  concierge: "Japan buying service",
  auction: "Japan auction bidding service",
  japanWarehouse: "Japan warehouse parcel receiving",
  business: "Fulfillment in Japan",
};

// Price offers, only where the page shows that rate table (numbers from pricing-data.ts).
const OFFER_VN_JP = perKgOffer("Vietnam → Japan, clean goods (lowest rate)", lowestRate(VN_JP_CLEAN));
const OFFER_JP_VN = perKgOffer("Japan → Vietnam, any weight", JP_VN[0]);
const OFFERS: Partial<Record<PageKey, ReturnType<typeof perKgOffer>[]>> = {
  shipToJapan: [OFFER_VN_JP],
  shipToVietnam: [OFFER_JP_VN],
  pricing: [OFFER_VN_JP, OFFER_JP_VN],
};

export default async function SubRoute({ params }: Props) {
  const { locale, rest } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const key = resolveKey(locale as Locale, rest);
  if (!key) notFound();
  setRequestLocale(locale);

  const homeHref = `/${locale}`;
  const tp = await getTranslations({ locale, namespace: `pages.${key}` });
  const tPages = await getTranslations({ locale, namespace: "pages" });

  const graphs: Record<string, unknown>[] = [
    breadcrumb(locale as Locale, key, (k) => tPages(`${k}.breadcrumb`)),
  ];
  const serviceType = SERVICE_TYPES[key];
  if (serviceType) {
    graphs.push(service({ name: tp("title"), description: tp("intro"), serviceType, offers: OFFERS[key] }));
  }
  if (key === "faq") {
    const tFaq = await getTranslations({ locale, namespace: "faq" });
    const items = tFaq.raw("items") as { question: string; answer: string }[];
    graphs.push(faqPage(items));
  }
  if (key === "contact") {
    graphs.push(
      contactPage({
        name: tp("title"),
        description: tp("metaDescription"),
        url: `${SITE_URL}${pagePath(locale as Locale, key)}`,
        inLanguage: locale,
      }),
    );
  }

  return (
    <>
      <SiteHeader homeHref={homeHref} solid />
      {graphs.map((data, index) => (
        <JsonLd key={index} data={data} />
      ))}
      <SubPage page={key} />
      <SiteFooter homeHref={homeHref} />
      <MotionLayer />
    </>
  );
}
