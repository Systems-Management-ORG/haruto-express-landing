import { CheckCircle, ClipboardText, MapPin } from "@phosphor-icons/react/dist/ssr";
import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { CHAT_CHANNELS, ChannelIcon, PhoneIcon } from "@/shared/components/contact-links";
import { MapEmbed } from "@/shared/components/map-embed";
import { HOTLINES, LOCATIONS, locationById, mapsUrl, telHref } from "@/shared/seo/business";
import { ContactForm } from "./contact-form";

type GuideKey = "zalo" | "facebook" | "hotline" | "form";
const GUIDE_ICONS: Record<GuideKey, ReactNode> = {
  zalo: <ChannelIcon id="zalo" size={40} />,
  facebook: <ChannelIcon id="facebook" size={40} />,
  hotline: (
    <span className="icon-chip size-10" aria-hidden>
      <PhoneIcon size={22} />
    </span>
  ),
  form: (
    <span className="icon-chip size-10" aria-hidden>
      <ClipboardText size={22} weight="duotone" />
    </span>
  ),
};

// Contact page only: what each channel is for, what to have ready, and every HARUTO location
// (addresses from business.ts; opening hours on the walk-in locations, `publicVisit`).
export function ContactGuide() {
  const t = useTranslations("contact.guide");
  const tFooter = useTranslations("footer");
  const prepare = t.raw("prepare") as string[];

  return (
    <section className="section">
      <div className="wrap">
        <div data-reveal className="max-w-[44rem]">
          <h2 className="heading-2">{t("title")}</h2>
          <p className="mt-4 sm:text-lg">{t("intro")}</p>
        </div>
        <ul data-reveal-group className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {(Object.keys(GUIDE_ICONS) as GuideKey[]).map((key) => (
            <li key={key} className="card p-6">
              {GUIDE_ICONS[key]}
              <h3 className="mt-4 text-lg font-medium text-forest">{t(`itemTitles.${key}`)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{t(`items.${key}`)}</p>
            </li>
          ))}
        </ul>

        <div className="mt-12 grid gap-8 lg:mt-16 lg:grid-cols-2 lg:gap-6">
          <div data-reveal>
            <h3 className="text-xl text-forest">{t("prepareTitle")}</h3>
            <ul className="mt-4 grid gap-3">
              {prepare.map((item) => (
                <li key={item} className="flex gap-2.5">
                  <CheckCircle size={20} weight="fill" aria-hidden className="mt-0.5 shrink-0 text-forest" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div data-reveal>
            <h3 className="text-xl text-forest">{t("locationsTitle")}</h3>
            <ul className="mt-4 grid gap-4">
              {LOCATIONS.map((location) => (
                <li key={location.id} className="flex gap-3">
                  <MapPin size={22} weight="duotone" aria-hidden className="mt-0.5 shrink-0 text-forest" />
                  <span>
                    <span className="block font-medium text-ink">{tFooter(`locations.${location.id}`)}</span>
                    <span className="block text-sm text-muted">{t(`locations.${location.id}`)}</span>
                    {location.publicVisit && <span className="block text-sm font-medium text-forest">{t("hours")}</span>}
                    <a
                      href={mapsUrl(location.query)}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-track="open_map"
                      className="mt-1 inline-flex items-center gap-1 text-sm underline underline-offset-4"
                    >
                      {location.address}
                    </a>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

// `withMap` shows the office location map; used on the dedicated contact page, not the home hub.
export function Contact({ withMap = false }: { withMap?: boolean }) {
  const t = useTranslations("contact");
  const office = locationById("vietnamOffice");
  // Only channels with a confirmed URL are shown; never a "pending" placeholder.
  const hasChannels = CHAT_CHANNELS.length > 0 || HOTLINES.length > 0;

  return (
    <section id="contact" className="section bg-sage">
      <div className="wrap">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-6">
          <div data-reveal className="lg:col-span-5 lg:pr-8">
            <h2 className="heading-2">{t("title")}</h2>
            <p className="mt-4 sm:text-lg">{t("intro")}</p>
            {hasChannels && (
              <>
                <h3 className="mt-8 text-sm font-medium text-muted lg:mt-12">{t("channelsTitle")}</h3>
                <ul className="mt-3 grid gap-3">
                  {CHAT_CHANNELS.map(({ id, href }) => (
                    <li key={id}>
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-track={`click_${id}`}
                        className="channel-link group"
                      >
                        <ChannelIcon id={id} size={40} />
                        <span className="flex-1">
                          <span className="block font-medium text-ink">{t(`channels.${id}`)}</span>
                          <span className="block text-sm text-muted">{t(`channelHints.${id}`)}</span>
                        </span>
                      </a>
                    </li>
                  ))}
                  {HOTLINES.map((line) => (
                    <li key={line.id}>
                      <a href={telHref(line.tel)} data-track={`click_hotline_${line.id}`} className="channel-link group">
                        <span className="icon-chip size-10" aria-hidden>
                          <PhoneIcon size={22} />
                        </span>
                        <span className="flex-1">
                          <span className="block font-medium text-ink">{t(`hotlines.${line.id}`)}</span>
                          <span className="block text-sm text-muted">{line.display}</span>
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
          <div data-reveal className="lg:col-span-6 lg:col-start-7">
            <ContactForm />
          </div>
        </div>

        {withMap && office && (
          <div data-reveal className="mt-12 lg:mt-16">
            <h3 className="text-xl text-forest">{t("officeTitle")}</h3>
            <p className="mt-2 text-muted">{office.address}</p>
            <div className="mt-4 max-w-[48rem]">
              <MapEmbed
                query={office.query}
                src={office.embedSrc}
                title={t("mapTitle")}
                openLabel={t("mapOpen")}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
