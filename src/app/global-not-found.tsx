import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
import { NotFoundView } from "@/modules/landing/components/not-found-view";
import { fontClassName } from "@/shared/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "404 | Haruto Express",
  robots: { index: false },
};

export default async function GlobalNotFound() {
  const locale = await getLocale();
  return (
    <html lang={locale} className={fontClassName(locale)}>
      <body>
        <NextIntlClientProvider>
          <NotFoundView locale={locale} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
