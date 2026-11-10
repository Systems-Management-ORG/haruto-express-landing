import { MapPin } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import type { Locale } from "@/shared/constants/locales";
import { CHAT_CHANNELS, ChannelIcon } from "@/shared/components/contact-links";
import { LOCATIONS, mapsUrl } from "@/shared/seo/business";
import { NAV } from "@/shared/seo/nav";
import { type PageKey, pagePath } from "@/shared/seo/pages";

// Link columns mirror the primary navigation groups; top-level links (Liên hệ) join the last one.
const GROUPS = NAV.filter((item) => item.type === "group");
const LOOSE_LINKS: PageKey[] = NAV.flatMap((item) => (item.type === "link" ? [item.key] : []));

export function SiteFooter({ homeHref = "" }: { homeHref?: string }) {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const tPages = useTranslations("pages");
  const tContact = useTranslations("contact");
  const locale = useLocale() as Locale;

  return (
    <footer className="bg-deep text-ivory">
      <div className="wrap py-12 lg:py-16">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-12 lg:gap-8">
          <div className="col-span-2 lg:col-span-5">
            <a href={homeHref || `/${locale}`} className="flex items-center gap-4">
              <Image
                src="/logo/haruto-lockup.webp"
                alt={t("logoAlt")}
                width={64}
                height={64}
                className="size-16 shrink-0 rounded-xl bg-ivory p-1"
              />
              <span>
                <span className="block text-lg font-medium">HARUTO EXPRESS</span>
                <span className="block text-sm text-gold">{t("tagline")}</span>
              </span>
            </a>
            <p className="mt-4 max-w-[26rem] text-ivory/85">{t("positioning")}</p>
            {CHAT_CHANNELS.length > 0 && (
              <ul className="mt-5 flex gap-3">
                {CHAT_CHANNELS.map(({ id, href }) => (
                  <li key={id}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-track={`click_${id}`}
                      aria-label={tContact(`fab.${id}`)}
                      title={tContact(`fab.${id}`)}
                      className="footer-social"
                    >
                      <ChannelIcon id={id} size={36} />
                    </a>
                  </li>
                ))}
              </ul>
            )}

            <p className="footer-heading mt-8">{t("addressTitle")}</p>
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

          {GROUPS.map((group, index) => {
            const links = index === GROUPS.length - 1 ? [...group.children, ...LOOSE_LINKS] : group.children;
            return (
              <nav key={group.id} aria-label={tNav(`groups.${group.id}`)} className="lg:col-span-2 lg:first-of-type:col-start-7">
                <p className="footer-heading">{tNav(`groups.${group.id}`)}</p>
                <ul className="mt-2">
                  {links.map((key) => (
                    <li key={key}>
                      <a href={pagePath(locale, key)} className="flex min-h-10 items-center text-ivory/85 hover:text-gold">
                        {tPages(`${key}.nav`)}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            );
          })}
        </div>
      </div>

      <div className="border-t border-ivory/15">
        <div className="wrap flex flex-col gap-1 py-5 text-sm text-ivory/70 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} HARUTO EXPRESS</p>
          <p>{t("bottomNote")}</p>
        </div>
      </div>
    </footer>
  );
}
