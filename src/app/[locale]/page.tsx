import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { LandingPage } from "@/modules/landing/components/landing-page";
import { buildPageMetadata } from "@/shared/seo/metadata";

type Props = { params: Promise<{ locale: string }> };

// Regenerate daily so the footer's copyright year stays current without a new build.
export const revalidate = 86400;

// Only the generated languages exist here; "/favicon.ico" and the like must be a plain 404.
export const dynamicParams = false;

// Same helper as every subpage: canonical, hreflang, robots and OpenGraph from the registry.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  return buildPageMetadata(locale, "home");
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  return <LandingPage />;
}
