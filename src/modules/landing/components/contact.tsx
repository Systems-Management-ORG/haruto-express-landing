import { CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { useLocale, useTranslations } from "next-intl";
import { CHAT_CHANNELS, ChannelIcon, PhoneIcon, primaryHotline } from "@/shared/components/contact-links";
import { HOTLINES, telHref } from "@/shared/seo/business";
import { ContactForm } from "./contact-form";

// Contact page hero: the four ways to reach HARUTO as one tap each (Zalo, both hotlines with the
// number in large type, the Facebook page), the visitor's own hotline first.
export function ContactQuickActions() {
  const t = useTranslations("contact");
  const locale = useLocale();
  const primary = primaryHotline(locale);
  const lines = [...HOTLINES].sort((a, b) => (a.id === primary?.id ? -1 : b.id === primary?.id ? 1 : 0));
  const chat = (id: "zalo" | "facebook") => CHAT_CHANNELS.find((channel) => channel.id === id);
  const zalo = chat("zalo");
  const facebook = chat("facebook");

  return (
    <ul className="quick-actions" data-fab-away>
      {zalo && (
        <li>
          <a href={zalo.href} target="_blank" rel="noopener noreferrer" data-track="click_zalo" className="quick-action">
            <ChannelIcon id="zalo" size={36} />
            <span className="min-w-0">
              <span className="quick-action__title">{t("channels.zalo")}</span>
              <span className="quick-action__sub">{t("channelHints.zalo")}</span>
            </span>
          </a>
        </li>
      )}
      {lines.map((line) => (
        <li key={line.id}>
          <a href={telHref(line.tel)} data-track={`click_hotline_${line.id}`} className="quick-action">
            <span className="icon-chip size-9" aria-hidden>
              <PhoneIcon size={20} />
            </span>
            <span className="min-w-0">
              <span className="quick-action__title tabular-nums">{line.display}</span>
              <span className="quick-action__sub">{t(`hotlines.${line.id}`)}</span>
            </span>
          </a>
        </li>
      ))}
      {facebook && (
        <li>
          <a href={facebook.href} target="_blank" rel="noopener noreferrer" data-track="click_facebook" className="quick-action">
            <ChannelIcon id="facebook" size={36} />
            <span className="min-w-0">
              <span className="quick-action__title">{t("channels.facebook")}</span>
              <span className="quick-action__sub">{t("channelHints.facebook")}</span>
            </span>
          </a>
        </li>
      )}
    </ul>
  );
}

// The consultation form. Home: heading, intro and the contact channels beside the form. Contact
// page ("page"): the channels are already in the hero, so the form sits beside what to have ready.
export function Contact({ variant = "home" }: { variant?: "home" | "page" }) {
  const t = useTranslations("contact");
  const onPage = variant === "page";
  // Only channels with a confirmed URL are shown; never a "pending" placeholder.
  const hasChannels = CHAT_CHANNELS.length > 0 || HOTLINES.length > 0;
  const prepare = t.raw("guide.prepare") as string[];

  return (
    <section id="contact" className="section bg-sage">
      <div className="wrap">
        {/* Phones: heading, the form, then the side column (the form first, as the one place to
            convert). Desktop: heading and side column on the left (it follows the scroll), the
            form on the right across both rows. */}
        <div className="grid gap-8 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:gap-x-12 lg:gap-y-10">
          <div data-reveal className="lg:col-span-5">
            <h2 className="heading-2">{t("title")}</h2>
            {!onPage && <p className="mt-4 sm:text-lg">{t("intro")}</p>}
          </div>
          <div data-reveal className="lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1">
            <ContactForm />
          </div>
          {onPage ? (
            <div data-reveal className="lg:sticky lg:top-24 lg:col-span-5 lg:self-start">
              <h3 className="text-lg font-medium text-forest">{t("guide.prepareTitle")}</h3>
              <ul className="mt-4 grid gap-3">
                {prepare.map((item) => (
                  <li key={item} className="flex gap-2.5">
                    <CheckCircle size={20} weight="fill" aria-hidden className="mt-0.5 shrink-0 text-forest" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            hasChannels && (
              <div data-reveal className="lg:sticky lg:top-24 lg:col-span-5 lg:self-start">
                <h3 className="text-sm font-medium text-muted">{t("channelsTitle")}</h3>
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
                          <span className="block text-sm text-muted">{t(`hotlines.${line.id}`)}</span>
                          <span className="block text-lg font-semibold text-forest tabular-nums">{line.display}</span>
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
