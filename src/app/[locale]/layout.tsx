import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";
import { AnalyticsEvents } from "@/shared/analytics/analytics-events";
import { GoogleTagManager, GoogleTagManagerNoScript } from "@/shared/analytics/google-tag-manager";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/shared/seo/business";
import { JsonLd, organization, website } from "@/shared/seo/json-ld";
import type { Locale } from "@/shared/constants/locales";
import { fontClassName } from "@/shared/lib/fonts";
import "../globals.css";

const OG_LOCALES: Record<Locale, string> = { vi: "vi_VN", ja: "ja_JP", en: "en_US" };

// hreflang map: every existing locale plus x-default pointing at Vietnamese.
const languageAlternates: Record<string, string> = {
  ...Object.fromEntries(routing.locales.map((item) => [item, `/${item}`])),
  "x-default": "/vi",
};

type LocaleParams = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: "#faf8ea",
};

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const meta = await getTranslations({ locale, namespace: "meta" });
  const footer = await getTranslations({ locale, namespace: "footer" });
  const title = meta("title");
  const description = meta("description");
  const shareImage = [{ url: "/og/haruto-og.png", width: 1200, height: 630, alt: footer("logoAlt") }];

  return {
    title,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: `/${locale}`,
      languages: languageAlternates,
    },
    robots: process.env.ALLOW_INDEXING === "true" ? undefined : { index: false, follow: true },
    openGraph: {
      type: "website",
      siteName: "HARUTO EXPRESS",
      title,
      description,
      locale: OG_LOCALES[locale],
      alternateLocale: routing.locales.filter((item) => item !== locale).map((item) => OG_LOCALES[item]),
      images: shareImage,
    },
    twitter: {
      card: shareImage ? "summary_large_image" : "summary",
      title,
      description,
      images: shareImage,
    },
  };
}

export default async function LocaleLayout({ children, params }: LocaleParams & { children: ReactNode }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <html lang={locale} className={fontClassName(locale)}>
      <body>
        <GoogleTagManagerNoScript />
        <JsonLd data={organization()} />
        <JsonLd data={website(locale)} />
        <AnalyticsEvents />
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
        <div className="grain" aria-hidden />
        <GoogleTagManager />
      </body>
    </html>
  );
}
