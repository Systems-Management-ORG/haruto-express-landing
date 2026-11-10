import { ArrowUpRight, Phone } from "@phosphor-icons/react/dist/ssr";
import { useTranslations } from "next-intl";
import { CHAT_CHANNELS, ChannelIcon } from "@/shared/components/contact-links";
import { MapEmbed } from "@/shared/components/map-embed";
import { BUSINESS, locationById } from "@/shared/seo/business";
import { ContactForm } from "./contact-form";

// `withMap` shows the office location map; used on the dedicated contact page, not the home hub.
export function Contact({ withMap = false }: { withMap?: boolean }) {
  const t = useTranslations("contact");
  const office = locationById("vietnamOffice");
  // Only channels with a confirmed URL are shown; never a "pending" placeholder.
  const hasChannels = CHAT_CHANNELS.length > 0 || Boolean(BUSINESS.hotlineTel);

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
                        <ArrowUpRight size={20} aria-hidden className="m-arrow shrink-0 text-forest" />
                      </a>
                    </li>
                  ))}
                  {BUSINESS.hotlineTel && (
                    <li>
                      <a href={`tel:${BUSINESS.hotlineTel}`} data-track="click_hotline" className="channel-link group">
                        <span className="icon-chip size-10" aria-hidden>
                          <Phone size={22} weight="duotone" />
                        </span>
                        <span className="flex-1">
                          <span className="block font-medium text-ink">{t("channels.hotline")}</span>
                          <span className="block text-sm text-muted">{BUSINESS.hotlineTel}</span>
                        </span>
                      </a>
                    </li>
                  )}
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
