import { MapPin } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import type { Locale } from "@/shared/constants/locales";
import { CHAT_CHANNELS, ChannelIcon, PhoneIcon } from "@/shared/components/contact-links";
import { HOTLINES, LOCATIONS, mapsUrl, telHref } from "@/shared/seo/business";
import { NAV } from "@/shared/seo/nav";
import { type PageKey, pagePath } from "@/shared/seo/pages";
import { CARRIER_ORDER } from "../partners";

// Link columns mirror the primary navigation groups; top-level links (Liên hệ) join "Hướng dẫn".
const GROUPS = NAV.filter((item) => item.type === "group");
const LOOSE_LINKS: PageKey[] = NAV.flatMap((item) => (item.type === "link" ? [item.key] : []));

export function SiteFooter({ homeHref = "" }: { homeHref?: string }) {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const tPages = useTranslations("pages");
  const tContact = useTranslations("contact");
  const tCarriers = useTranslations("partners.carriers");
  const locale = useLocale() as Locale;

  return (
    <footer className="bg-deep text-ivory">
      <div className="wrap py-12 lg:py-16">
        {/* Band 1: brand (identity + description + hotlines + socials) on the left, nav columns on the right. */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-4">
            <Link href={homeHref || `/${locale}`} className="flex items-center gap-4">
              <Image
                src="/logo/haruto-lockup.webp"
                alt={t("logoAlt")}
                width={64}
                height={64}
                className="size-16 shrink-0 rounded-xl bg-ivory p-1"
              />
              <span>
                <span className="block text-lg font-medium">HARUTO EXPRESS</span>
                <span className="block text-sm text-gold text-pretty">{t("tagline")}</span>
              </span>
            </Link>
            <p className="mt-4 max-w-[26rem] text-ivory/85 text-pretty">{t("positioning")}</p>

            <ul className="mt-4 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-1">
              {HOTLINES.map((line) => (
                <li key={line.id}>
                  <a
                    href={telHref(line.tel)}
                    data-track={`click_hotline_${line.id}`}
                    className="group inline-flex items-center gap-3"
                  >
                    <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-gold text-deep" aria-hidden>
                      <PhoneIcon size={16} />
                    </span>
                    <span className="leading-snug">
                      <span className="block text-xs text-ivory/70">{tContact(`hotlines.${line.id}`)}</span>
                      <span className="block text-base font-semibold tracking-wide text-gold tabular-nums transition-colors group-hover:text-ivory">
                        {line.display}
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>

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
          </div>

          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:col-span-2 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-2 xl:grid-cols-4">
            {GROUPS.map((group) => {
              const links = group.id === "guides" ? [...group.children, ...LOOSE_LINKS] : group.children;
              return (
                <nav key={group.id} aria-label={tNav(`groups.${group.id}`)} className="min-w-0">
                  <p className="footer-heading">{tNav(`groups.${group.id}`)}</p>
                  <ul className="mt-2.5 flex flex-col gap-1">
                    {links.map((key) => {
                      const label = tPages(`${key}.nav`);
                      return (
                        <li key={key} className="min-w-0">
                          <Link
                            href={pagePath(locale, key)}
                            title={label}
                            className="flex min-h-9 items-center text-sm text-ivory/85 transition-colors hover:text-gold"
                          >
                            <span className="truncate">{label}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </nav>
              );
            })}
          </div>
        </div>

        {/* Band 2: Three warehouse/office locations in 3 balanced columns. */}
        <div className="mt-10 border-t border-ivory/15 pt-8">
          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {LOCATIONS.map((loc) => (
              <li key={loc.id} className="min-w-0">
                <a
                  href={mapsUrl(loc.query)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${t(`locations.${loc.id}`)}: ${t("mapHint")}`}
                  className="group flex items-start gap-2.5"
                >
                  <MapPin size={18} weight="fill" aria-hidden className="mt-1 shrink-0 text-gold" />
                  <span className="min-w-0">
                    <strong className="block text-sm font-semibold text-gold transition-colors group-hover:text-ivory">
                      {t(`locations.${loc.id}`)}
                    </strong>
                    <span className="mt-1 block text-sm text-ivory/80 text-pretty wrap-break-word transition-colors group-hover:text-ivory">
                      {loc.address}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Band 3: Domestic Japan carriers */}
        <div className="mt-8 border-t border-ivory/15 pt-8">
          <div className="flex flex-col gap-3 text-base lg:flex-row lg:items-center lg:gap-6">
            <span className="footer-heading mb-0 shrink-0">{tCarriers("title")}</span>
            <ul aria-label={tCarriers("title")} className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 sm:gap-6">
              {CARRIER_ORDER.map((id) => {
                const name = tCarriers(`items.${id}.name`);
                const native = tCarriers(`items.${id}.native`);
                return (
                  <li key={id} className="min-w-0 text-sm sm:text-base text-ivory text-pretty">
                    <span className="font-semibold text-pretty">{name}</span>
                    {native !== name && (
                      <span lang="ja" className="ml-2 text-ivory/75">
                        {native}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
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
