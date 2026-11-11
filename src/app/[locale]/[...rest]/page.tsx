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
import { breadcrumb, contactPage, faqPage, service } from "@/shared/seo/schema";

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
const SERVICE_PAGES: PageKey[] = ["shipToJapan", "shipToVietnam", "pricing", "concierge", "auction", "japanWarehouse", "business"];

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
  if (SERVICE_PAGES.includes(key)) {
    graphs.push(service({ name: tp("title"), description: tp("intro"), serviceType: tp("title") }));
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
