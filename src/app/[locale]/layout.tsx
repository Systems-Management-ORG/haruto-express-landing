import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";
import { AnalyticsEvents } from "@/shared/analytics/analytics-events";
import { GoogleTagManager, GoogleTagManagerNoScript } from "@/shared/analytics/google-tag-manager";
import { routing } from "@/i18n/routing";
import { ContactFab } from "@/shared/components/contact-links";
import { BUSINESS, SITE_URL } from "@/shared/seo/business";
import { JsonLd, PUBLIC_LOCATIONS, localBusiness, organization, website } from "@/shared/seo/json-ld";
import { fontClassName } from "@/shared/lib/fonts";
import "../globals.css";

type LocaleParams = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: "#faf8ea",
};

// Only site-wide defaults live here. Every page (home included) gets its title, description,
// canonical, hreflang, robots and OpenGraph from buildPageMetadata, so they never disagree.
// The fallback title covers the locale 404, which has no page metadata of its own.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: BUSINESS.name,
};

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
        {PUBLIC_LOCATIONS.map((location) => (
          <JsonLd key={location.id} data={localBusiness(location)} />
        ))}
        <AnalyticsEvents />
        <NextIntlClientProvider>
          {children}
          <ContactFab />
        </NextIntlClientProvider>
        <div className="grain" aria-hidden />
        <GoogleTagManager />
      </body>
    </html>
  );
}
