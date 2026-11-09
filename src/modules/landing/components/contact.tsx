import { useTranslations } from "next-intl";
import { BUSINESS } from "@/shared/seo/business";
import { ContactForm } from "./contact-form";

const CHANNELS = ["zalo", "hotline", "messenger"] as const;

// Real URLs turn the rows into tracked links; empty values stay as pending text.
const CHANNEL_HREF: Record<(typeof CHANNELS)[number], string> = {
  zalo: BUSINESS.zaloUrl,
  hotline: BUSINESS.hotlineTel ? `tel:${BUSINESS.hotlineTel}` : "",
  messenger: BUSINESS.messengerUrl,
};

export function Contact() {
  const t = useTranslations("contact");

  return (
    <section id="contact" className="section bg-sage">
      <div className="wrap">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-6">
          <div data-reveal className="lg:col-span-5 lg:pr-8">
            <h2 className="heading-2">{t("title")}</h2>
            <p className="mt-4 sm:text-lg">{t("intro")}</p>
            <h3 className="mt-8 text-sm font-medium text-muted lg:mt-12">{t("channelsTitle")}</h3>
            <dl className="mt-2 border-t border-line">
              {CHANNELS.map((channel) => {
                const href = CHANNEL_HREF[channel];
                return (
                  <div key={channel} className="flex min-h-12 items-center justify-between gap-4 border-b border-line">
                    <dt className="font-medium">{t(`channels.${channel}`)}</dt>
                    <dd className="text-sm">
                      {href ? (
                        <a
                          href={href}
                          data-track={`click_${channel}`}
                          className="font-medium text-forest underline underline-offset-4"
                        >
                          {channel === "hotline" ? BUSINESS.hotlineTel : t(`channels.${channel}`)}
                        </a>
                      ) : (
                        <span className="text-muted">{t("channelPending")}</span>
                      )}
                    </dd>
                  </div>
                );
              })}
            </dl>
          </div>
          <div data-reveal className="lg:col-span-6 lg:col-start-7">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
