import { BUSINESS, HOTLINES } from "@/shared/seo/business";

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
