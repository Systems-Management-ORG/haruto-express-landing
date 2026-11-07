import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { LandingPage } from "@/modules/landing/components/landing-page";

// Regenerate daily so the footer's copyright year stays current without a new build.
export const revalidate = 86400;

// Only the generated languages exist here; "/favicon.ico" and the like must be a plain 404.
export const dynamicParams = false;

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  return <LandingPage />;
}
