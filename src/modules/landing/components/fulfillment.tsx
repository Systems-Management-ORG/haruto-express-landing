import {
  ArrowRight,
  ArrowsLeftRight,
  Buildings,
  ChartBar,
  CheckCircle,
  Globe,
  ListChecks,
  MapPin,
  Package,
  Storefront,
  Truck,
  Warehouse,
} from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { CHAT_CHANNELS, ChannelIcon, PhoneIcon } from "@/shared/components/contact-links";
import type { Locale } from "@/shared/constants/locales";
import { HOTLINES, telHref } from "@/shared/seo/business";
import { pagePath } from "@/shared/seo/pages";

// One icon per entry of `fulfillment.services.items`, in order: the flow from receiving goods in
// Japan to shipping them on, then the Japan ⇄ Vietnam link.
const SERVICE_ICONS = [Warehouse, ChartBar, ListChecks, Package, Truck, ArrowsLeftRight];
// One icon per entry of `fulfillment.audience.items`.
const AUDIENCE_ICONS = [Buildings, Storefront, Warehouse, Globe];

// FFM (fulfillment) in Japan for Vietnamese businesses: what HARUTO handles, who it suits, why
// HARUTO, and a contact band with both hotlines. Rendered under the business page's PageHero.
export function Fulfillment() {
  const t = useTranslations("fulfillment");
  const tContact = useTranslations("contact");
  const locale = useLocale() as Locale;
  const services = t.raw("services.items") as string[];
  const audience = t.raw("audience.items") as string[];
  const reasons = t.raw("why.items") as string[];

  return (
    <>
      <section className="section">
        <div className="wrap">
          <h2 data-reveal className="heading-2">{t("services.title")}</h2>
          <p data-reveal className="mt-4 max-w-[44rem] sm:text-lg">{t("services.intro")}</p>
          <ol data-reveal-group className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3">
            {services.map((item, index) => {
              const Icon = SERVICE_ICONS[index] ?? Package;
              return (
                <li key={item} className="ffm-step">
                  <span className="icon-chip icon-chip--lg" aria-hidden>
                    <Icon size={28} weight="duotone" />
                  </span>
                  <span className="text-lg leading-snug font-medium text-forest">{item}</span>
                  <span aria-hidden className="ffm-step__no">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section className="section bg-sage">
        <div className="wrap">
          <div className="text-center">
            <h2 data-reveal className="heading-2">{t("audience.title")}</h2>
          </div>
          <ul data-reveal-group className="mt-10 grid grid-cols-2 gap-4 lg:mt-12 lg:grid-cols-4 lg:gap-6">
            {audience.map((item, index) => {
              const Icon = AUDIENCE_ICONS[index] ?? Buildings;
              return (
                <li key={item} className="goods-tile">
                  <Icon size={44} weight="light" aria-hidden />
                  <span>{item}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="wrap grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div data-reveal className="ffm-photo">
            <Image
              src="/images/haruto/kho/mat-tien-kho-haruto-express.jpg"
              alt={t("why.photoAlt")}
              fill
              sizes="(max-width: 1023px) 100vw, 45vw"
              className="object-cover"
            />
            <span className="ffm-photo__badge">
              <MapPin size={18} weight="fill" aria-hidden />
              {t("why.warehouses")}
            </span>
          </div>
          <div>
            <h2 data-reveal className="heading-2">{t("why.title")}</h2>
            <ul data-reveal-group className="mt-8 grid gap-4">
              {reasons.map((reason) => (
                <li key={reason} className="flex gap-3 text-lg">
                  <CheckCircle size={26} weight="fill" aria-hidden className="mt-0.5 shrink-0 text-forest" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section ffm-cta text-ivory">
        <div className="wrap grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-center lg:gap-14">
          <div data-reveal>
            <h2 className="heading-2 text-white">{t("cta.title")}</h2>
            <p className="mt-4 max-w-[34rem] text-ivory/85 sm:text-lg">{t("cta.body")}</p>
            <a href={`${pagePath(locale, "contact")}#contact`} data-track="cta_contact" className="btn btn-gold mt-8">
              {t("cta.contact")}
              <ArrowRight size={18} weight="bold" aria-hidden className="m-arrow" />
            </a>
            <p className="mt-6 font-medium text-gold">{t("cta.tagline")}</p>
          </div>
          <ul data-reveal-group className="grid gap-3">
            {HOTLINES.map((line) => (
              <li key={line.id}>
                <a href={telHref(line.tel)} data-track={`click_hotline_${line.id}`} className="ffm-line">
                  <span className="ffm-line__icon" aria-hidden>
                    <PhoneIcon size={22} />
                  </span>
                  <span className="flex-1">
                    <span className="block text-sm text-ivory/70">{tContact(`hotlines.${line.id}`)}</span>
                    <span className="block text-xl font-semibold tracking-wide">{line.display}</span>
                  </span>
                </a>
              </li>
            ))}
            {CHAT_CHANNELS.map(({ id, href }) => (
              <li key={id}>
                <a href={href} target="_blank" rel="noopener noreferrer" data-track={`click_${id}`} className="ffm-line">
                  <ChannelIcon id={id} size={40} />
                  <span className="flex-1">
                    <span className="block text-sm text-ivory/70">{tContact(`channelHints.${id}`)}</span>
                    <span className="block text-xl font-semibold">{tContact(`channels.${id}`)}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
