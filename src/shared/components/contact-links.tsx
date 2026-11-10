import { useLocale, useTranslations } from "next-intl";
import { BUSINESS, HOTLINES, telHref } from "@/shared/seo/business";

// Phone handset (public/images/haruto/icon-phone-calling.svg, supplied by HARUTO) drawn as a CSS
// mask, so it takes the current text colour on any background. Decorative.
export function PhoneIcon({ size = 20, className = "" }: { size?: number; className?: string }) {
  return <span aria-hidden className={`phone-icon ${className}`} style={{ width: size, height: size }} />;
}

// The hotline for the visitor's side of the route: the Japan line on the Japanese site, the
// Vietnam line elsewhere.
export function primaryHotline(locale: string) {
  return HOTLINES.find((line) => line.id === (locale === "ja" ? "japan" : "vietnam")) ?? HOTLINES[0];
}

export type ChannelId = "zalo" | "facebook";

// Brand icons supplied by HARUTO (public/images/haruto).
const ICON_SRC: Record<ChannelId, string> = {
  zalo: "/images/haruto/logo-zalo.svg",
  facebook: "/images/haruto/logo-facebook.svg",
};

// Direct chat channels with a confirmed URL, in display order. Empty URLs are left out.
export const CHAT_CHANNELS: { id: ChannelId; href: string }[] = (
  [
    { id: "zalo", href: BUSINESS.zaloUrl },
    { id: "facebook", href: BUSINESS.facebookUrl },
  ] as const
).filter((channel) => channel.href);

// Decorative: every link using it carries its own text or aria-label.
export function ChannelIcon({ id, size = 24 }: { id: ChannelId; size?: number }) {
  // eslint-disable-next-line @next/next/no-img-element -- static SVG, nothing to optimize
  return <img src={ICON_SRC[id]} alt="" width={size} height={size} className="block shrink-0" />;
}

// Floating contact buttons in the bottom-right corner of every page: a call button (small screens
// only, where tel: places a call), Zalo (sales consultant) and the Facebook fanpage. Tracked as
// click_hotline_<id> / click_zalo / click_facebook.
export function ContactFab() {
  const t = useTranslations("contact");
  const locale = useLocale();
  const hotline = primaryHotline(locale);
  if (CHAT_CHANNELS.length === 0 && !hotline) return null;

  return (
    <nav aria-label={t("fab.label")} className="contact-fab">
      <ul>
        {hotline && (
          <li className="lg:hidden">
            <a
              href={telHref(hotline.tel)}
              data-track={`click_hotline_${hotline.id}`}
              aria-label={`${t("fab.call")} ${hotline.display}`}
              title={`${t("fab.call")} ${hotline.display}`}
              className="contact-fab__btn contact-fab__call"
            >
              <PhoneIcon size={26} />
            </a>
          </li>
        )}
        {CHAT_CHANNELS.map(({ id, href }) => (
          <li key={id}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              data-track={`click_${id}`}
              aria-label={t(`fab.${id}`)}
              title={t(`fab.${id}`)}
              className="contact-fab__btn"
            >
              <ChannelIcon id={id} size={52} />
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
