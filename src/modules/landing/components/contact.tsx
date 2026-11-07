import { useTranslations } from "next-intl";
import { ContactForm } from "./contact-form";

const CHANNELS = ["zalo", "hotline", "messenger"] as const;

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
              {CHANNELS.map((channel) => (
                <div key={channel} className="flex min-h-12 items-center justify-between gap-4 border-b border-line">
                  <dt className="font-medium">{t(`channels.${channel}`)}</dt>
                  <dd className="text-sm text-muted">{t("channelPending")}</dd>
                </div>
              ))}
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
