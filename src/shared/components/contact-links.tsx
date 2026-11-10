import { useTranslations } from "next-intl";
import { BUSINESS } from "@/shared/seo/business";

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

// Floating chat buttons in the bottom-right corner of every page: Zalo (sales consultant) and the
// Facebook fanpage. Both open in a new tab and are tracked as click_zalo / click_facebook.
export function ContactFab() {
  const t = useTranslations("contact");
  if (CHAT_CHANNELS.length === 0) return null;

  return (
    <nav aria-label={t("fab.label")} className="contact-fab">
      <ul>
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
