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
        {/* Band 1: brand (identity + description + socials) on the left, nav columns on the right.
            Brand no longer carries hotlines/addresses — those live in their own band below, which
            keeps the two sides of this row close in height. */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-12 lg:gap-8">
          <div className="col-span-2 lg:col-span-4">
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
                <span className="block text-sm text-gold">{t("tagline")}</span>
              </span>
            </Link>
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
          </div>

          {GROUPS.map((group) => {
            const links = group.id === "guides" ? [...group.children, ...LOOSE_LINKS] : group.children;
            return (
              <nav key={group.id} aria-label={tNav(`groups.${group.id}`)} className="lg:col-span-2 lg:first-of-type:col-start-5">
                <p className="footer-heading">{tNav(`groups.${group.id}`)}</p>
                <ul className="mt-2">
                  {links.map((key) => (
                    <li key={key}>
                      <Link href={pagePath(locale, key)} className="flex min-h-10 items-center text-ivory/85 hover:text-gold">
                        {tPages(`${key}.nav`)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            );
          })}
        </div>

        {/* Band 2: two hotlines in a row, then three addresses in a row — the content that used to
            stack in the brand column, now spread across the full width so the footer stops looking
            L-shaped. No heading above them; the content speaks for itself. */}
        <div className="mt-12 grid gap-8 border-t border-ivory/15 pt-10 lg:mt-14 lg:gap-10">
          <ul className="grid gap-4 sm:grid-cols-2 lg:gap-6">
            {HOTLINES.map((line) => (
              <li key={line.id}>
                <a
                  href={telHref(line.tel)}
                  data-track={`click_hotline_${line.id}`}
                  className="group flex min-h-11 items-center gap-3 hover:text-gold"
                >
                  <span className="footer-phone" aria-hidden>
                    <PhoneIcon size={20} />
                  </span>
                  <span>
                    <span className="block text-sm text-ivory/70 group-hover:text-gold">{tContact(`hotlines.${line.id}`)}</span>
                    <span className="block text-lg font-semibold tracking-wide">{line.display}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
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

        {/* Band 3: the carriers HARUTO works with inside Japan, named out of respect for them. A
            slim inline strip — the label sits beside the names instead of above, so the row reads
            as one sentence of partners. Names only (their logos are drawn for light grounds); not
            links. */}
        <div className="mt-10 border-t border-ivory/15 pt-6">
          <div className="flex flex-col gap-x-6 gap-y-2 text-sm sm:flex-row sm:flex-wrap sm:items-center">
            <span className="text-ivory/60">{tCarriers("title")}:</span>
            <ul aria-label={tCarriers("title")} className="flex flex-wrap items-center gap-x-5 gap-y-1">
              {CARRIER_ORDER.map((id) => {
                const name = tCarriers(`items.${id}.name`);
                const native = tCarriers(`items.${id}.native`);
                return (
                  <li key={id} className="text-ivory/85">
                    <span className="font-medium">{name}</span>
                    {native !== name && (
                      <span lang="ja" className="ml-1.5 text-ivory/60">
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
