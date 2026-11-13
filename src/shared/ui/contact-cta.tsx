import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { CHAT_CHANNELS, ChannelIcon, PhoneIcon, primaryHotline } from "@/shared/components/contact-links";
import type { Locale } from "@/shared/constants/locales";
import { telHref } from "@/shared/seo/business";
import { pagePath } from "@/shared/seo/pages";

export type CtaAction = "zalo" | "contact" | "call" | "pricing";

const zalo = CHAT_CHANNELS.find((channel) => channel.id === "zalo");

type Variant = "primary" | "gold" | "outline" | "onDark";
const VARIANT: Record<Variant, string> = {
  primary: "btn btn-primary",
  gold: "btn btn-gold",
  outline: "btn btn-outline bg-white/70",
  onDark: "btn btn-onDark",
};

// The one contact button of the service and info pages. `zalo` opens the consultant chat (falls back to the
// contact form when no Zalo URL is configured), `contact` the form, `call` the visitor's hotline
// (renders nothing without one), `pricing` the full rate page. Default labels: `service.cta.*`.
export function ContactCta({ action, label, variant = "primary" }: { action: CtaAction; label?: string; variant?: Variant }) {
  const t = useTranslations("service.cta");
  const locale = useLocale() as Locale;
  const className = VARIANT[variant];

  if (action === "zalo" && zalo) {
    return (
      <a href={zalo.href} target="_blank" rel="noopener noreferrer" data-track="click_zalo" className={className}>
        <span className="rounded-md bg-white p-0.5">
          <ChannelIcon id="zalo" size={22} />
        </span>
        {label ?? t("zalo")}
      </a>
    );
  }

  if (action === "call") {
    const line = primaryHotline(locale);
    if (!line) return null;
    return (
      <a href={telHref(line.tel)} data-track={`click_hotline_${line.id}`} className={className}>
        <PhoneIcon size={20} />
        {line.display}
      </a>
    );
  }

  const toPricing = action === "pricing";
  return (
    <Link
      href={toPricing ? pagePath(locale, "pricing") : `${pagePath(locale, "contact")}#contact`}
      data-track={toPricing ? "cta_pricing" : "cta_contact"}
      className={className}
    >
      {/* A page's own label is written for its Zalo button; the contact fallback keeps the form label. */}
      {(action === "contact" && label) || t(toPricing ? "pricing" : "contact")}
      <ArrowRight size={18} weight="bold" aria-hidden className="m-arrow" />
    </Link>
  );
}
