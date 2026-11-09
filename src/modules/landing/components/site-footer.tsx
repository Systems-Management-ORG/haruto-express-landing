import { MapPin } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import type { Locale } from "@/shared/constants/locales";
import { LOCATIONS, mapsUrl } from "@/shared/seo/business";
import { type PageKey, pagePath } from "@/shared/seo/pages";

const LINKS: PageKey[] = ["shipToJapan", "shipToVietnam", "pricing", "policy", "faq", "contact"];

export function SiteFooter({ homeHref = "" }: { homeHref?: string }) {
  const t = useTranslations("footer");
  const tPages = useTranslations("pages");
  const locale = useLocale() as Locale;

  return (
    <footer className="bg-deep py-12 text-ivory lg:py-16">
      <div className="wrap">
        <div className="grid gap-10 md:grid-cols-12 md:gap-8">
          <div className="flex items-start gap-5 md:col-span-5">
            <Image
              src="/logo/haruto-lockup.webp"
              alt={t("logoAlt")}
              width={96}
              height={96}
              className="size-24 shrink-0 rounded-2xl bg-ivory p-1.5"
            />
            <div>
              <p className="text-xl font-medium">HARUTO EXPRESS</p>
              <p className="mt-2 text-ivory/85">{t("positioning")}</p>
              <p className="mt-2 font-medium text-gold">{t("tagline")}</p>
            </div>
          </div>

          <div className="md:col-span-4">
            <p className="text-sm font-medium text-ivory/70">{t("addressTitle")}</p>
            <ul className="mt-3 grid gap-4">
              {LOCATIONS.map((loc) => (
                <li key={loc.id}>
                  <a
                    href={mapsUrl(loc.query)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${t(`locations.${loc.id}`)}: ${t("mapHint")}`}
                    className="group flex gap-2.5 hover:text-gold"
                  >
                    <MapPin size={18} weight="fill" aria-hidden className="mt-0.5 shrink-0 text-gold" />
                    <span>
                      <span className="block text-sm font-medium">{t(`locations.${loc.id}`)}</span>
                      <span className="block text-sm text-ivory/75 group-hover:text-ivory">{loc.address}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label={t("navigationTitle")} className="md:col-span-3">
            <p className="text-sm font-medium text-ivory/70">{t("navigationTitle")}</p>
            <ul className="mt-2">
              {LINKS.map((key) => (
                <li key={key}>
                  <a href={pagePath(locale, key)} className="flex min-h-11 items-center hover:text-gold">
                    {tPages(`${key}.nav`)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-10 border-t border-ivory/20 pt-6 text-sm text-ivory/75">
          <p>© {new Date().getFullYear()} HARUTO EXPRESS</p>
        </div>
      </div>
    </footer>
  );
}
