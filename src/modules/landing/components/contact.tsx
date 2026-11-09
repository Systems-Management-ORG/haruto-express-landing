import { useTranslations } from "next-intl";
import { MapEmbed } from "@/shared/components/map-embed";
import { BUSINESS, locationById } from "@/shared/seo/business";
import { ContactForm } from "./contact-form";

const CHANNELS = ["zalo", "hotline", "messenger"] as const;

// Real URLs turn the rows into tracked links; empty values stay as pending text.
const CHANNEL_HREF: Record<(typeof CHANNELS)[number], string> = {
  zalo: BUSINESS.zaloUrl,
  hotline: BUSINESS.hotlineTel ? `tel:${BUSINESS.hotlineTel}` : "",
  messenger: BUSINESS.messengerUrl,
};

// `withMap` shows the office location map; used on the dedicated contact page, not the home hub.
export function Contact({ withMap = false }: { withMap?: boolean }) {
  const t = useTranslations("contact");
  // Only show channels that have a confirmed URL; never render a "pending" placeholder.
  const channels = CHANNELS.filter((channel) => CHANNEL_HREF[channel]);
  const office = locationById("vietnamOffice");

  return (
    <section id="contact" className="section bg-sage">
      <div className="wrap">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-6">
          <div data-reveal className="lg:col-span-5 lg:pr-8">
            <h2 className="heading-2">{t("title")}</h2>
            <p className="mt-4 sm:text-lg">{t("intro")}</p>
            {channels.length > 0 && (
              <>
                <h3 className="mt-8 text-sm font-medium text-muted lg:mt-12">{t("channelsTitle")}</h3>
                <dl className="mt-2 border-t border-line">
                  {channels.map((channel) => (
                    <div key={channel} className="flex min-h-12 items-center justify-between gap-4 border-b border-line">
                      <dt className="font-medium">{t(`channels.${channel}`)}</dt>
                      <dd className="text-sm">
                        <a
                          href={CHANNEL_HREF[channel]}
                          data-track={`click_${channel}`}
                          className="font-medium text-forest underline underline-offset-4"
                        >
                          {channel === "hotline" ? BUSINESS.hotlineTel : t(`channels.${channel}`)}
                        </a>
                      </dd>
                    </div>
                  ))}
                </dl>
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
