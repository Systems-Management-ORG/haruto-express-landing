import { ArrowUpRight, CheckCircle } from "@phosphor-icons/react/dist/ssr";
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
          <a
            href={zalo.href}
            target="_blank"
            rel="noopener noreferrer"
            data-track="click_zalo"
            className="quick-action group h-full"
          >
            <ChannelIcon id="zalo" size={38} />
            <span className="min-w-0 flex-1">
              <span className="quick-action__title">{t("channels.zalo")}</span>
              <span className="quick-action__sub text-pretty">{t("channelHints.zalo")}</span>
            </span>
            <ArrowUpRight
              size={18}
              aria-hidden
              className="shrink-0 text-forest/45 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-forest"
            />
          </a>
        </li>
      )}
      {lines.map((line) => (
        <li key={line.id}>
          <a
            href={telHref(line.tel)}
            data-track={`click_hotline_${line.id}`}
            className="quick-action group h-full"
          >
            <span className="icon-chip size-10" aria-hidden>
              <PhoneIcon size={20} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="quick-action__title tabular-nums">{line.display}</span>
              <span className="quick-action__sub text-pretty">{t(`hotlines.${line.id}`)}</span>
            </span>
          </a>
        </li>
      ))}
      {facebook && (
        <li>
          <a
            href={facebook.href}
            target="_blank"
            rel="noopener noreferrer"
            data-track="click_facebook"
            className="quick-action group h-full"
          >
            <ChannelIcon id="facebook" size={38} />
            <span className="min-w-0 flex-1">
              <span className="quick-action__title">{t("channels.facebook")}</span>
              <span className="quick-action__sub text-pretty">{t("channelHints.facebook")}</span>
            </span>
            <ArrowUpRight
              size={18}
              aria-hidden
              className="shrink-0 text-forest/45 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-forest"
            />
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
        <div className="grid gap-8 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:gap-x-12 lg:gap-y-8">
          <div data-reveal className="lg:col-span-5">
            <h2 className="heading-2">{t("title")}</h2>
            <p className="mt-4 text-pretty sm:text-lg">{t("intro")}</p>
          </div>
          <div data-reveal className="lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1">
            <ContactForm />
          </div>
          {onPage ? (
            <div data-reveal className="lg:sticky lg:top-24 lg:col-span-5 lg:self-start">
              <div className="rounded-card border border-line bg-white p-6">
                <h3 className="text-lg font-semibold text-forest">{t("guide.prepareTitle")}</h3>
                <ul className="mt-4 grid gap-3.5">
                  {prepare.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle size={20} weight="fill" aria-hidden className="mt-0.5 shrink-0 text-forest" />
                      <span className="text-sm sm:text-base leading-relaxed text-ink text-pretty">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
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
                        <span className="min-w-0 flex-1">
                          <span className="block font-semibold text-forest">{t(`channels.${id}`)}</span>
                          <span className="mt-0.5 block text-xs text-muted text-pretty">
                            {t(`channelHints.${id}`)}
                          </span>
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
