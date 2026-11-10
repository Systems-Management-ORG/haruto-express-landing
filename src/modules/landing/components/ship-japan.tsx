import {
  ArrowRight,
  Buildings,
  ClipboardText,
  GlobeHemisphereEast,
  Handshake,
  MapPinLine,
  Package,
  Gift,
  Repeat,
  RocketLaunch,
  Stamp,
  Storefront,
  Truck,
  UsersThree,
} from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Breadcrumbs } from "@/shared/components/breadcrumbs";
import type { Locale } from "@/shared/constants/locales";
import { type PageKey, pagePath } from "@/shared/seo/pages";
import { Policy } from "./policy";
import { Pricing } from "./pricing";

// One icon (and, where one exists, a related page) per entry of the `shipJp` lists, in order.
const SERVICES: { Icon: typeof Truck; page?: PageKey }[] = [
  { Icon: Truck },
  { Icon: Gift },
  { Icon: ClipboardText, page: "goods" },
  { Icon: Stamp },
  { Icon: MapPinLine },
];
const AUDIENCE = [UsersThree, Buildings, Storefront, Repeat];
const REASONS = [GlobeHemisphereEast, Handshake, Package, RocketLaunch];
// Pages behind the "logistics ecosystem" reason: shipping, buying service, fulfillment.
const ECOSYSTEM: PageKey[] = ["shipToVietnam", "concierge", "business"];

// Banner for the Vietnam → Japan route on HARUTO's own artwork (ship-viet-nhat.png, cut to its
// scene): Vietnam and Japan joined by an arrow, the plane, gifts, HARUTO parcels, tracking devices
// and a customs stamp. Copy on the left, the scene on the right with its left edge feathered.
export function ShipJapanHero() {
  const t = useTranslations("shipJp.hero");

  return (
    <section className="vnjp-hero">
      <div className="wrap grid items-center gap-8 py-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-8 lg:py-12">
        <div className="relative z-[1]">
          <Breadcrumbs page="shipToJapan" />
          <h1 className="shipvn-title shipvn-title--start mt-6">
            <span className="text-forest">{t("titleA")}</span>
            <span className="text-[#ea580c]">{t("titleB")}</span>
          </h1>
          <p className="auction-ribbon mt-4">{t("ribbon")}</p>
          <p className="mt-5 max-w-[34rem] sm:text-lg">{t("body")}</p>
          <p className="mt-3 max-w-[34rem] font-semibold text-forest sm:text-lg">{t("promise")}</p>
        </div>
        <Image
          src="/images/haruto/ship-ve-vn/gui-hang-viet-nam-nhat-ban.webp"
          alt={t("imageAlt")}
          width={1192}
          height={920}
          priority
          quality={90}
          sizes="(max-width: 1023px) 100vw, 52vw"
          className="vnjp-hero__art"
        />
      </div>
    </section>
  );
}

export function ShipJapanBody() {
  const t = useTranslations("shipJp");
  const tPages = useTranslations("pages");
  const locale = useLocale() as Locale;
  const services = t.raw("services.items") as string[];
  const audience = t.raw("audience.items") as string[];
  const reasons = t.raw("why.items") as { title: string; body: string }[];

  return (
    <>
      <section className="section bg-sage">
        <div className="wrap">
          <h2 data-reveal className="ffm-section-title">{t("services.title")}</h2>
          <ul data-reveal-group className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:mt-12 lg:grid-cols-5 lg:gap-4">
            {services.map((service, index) => {
              const { Icon, page } = SERVICES[index] ?? SERVICES[0];
              const inner = (
                <>
                  <span className="vnjp-badge" aria-hidden>
                    <Icon size={30} weight="duotone" />
                  </span>
                  <span className="mt-3 block font-medium text-ink">{service}</span>
                  {page && (
                    <span className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-forest">
                      {t("services.more")}
                      <ArrowRight size={14} aria-hidden className="m-arrow" />
                    </span>
                  )}
                </>
              );
              return (
                <li key={service} className="h-full">
                  {page ? (
                    <a href={pagePath(locale, page)} className="shipvn-service shipvn-service--link">
                      {inner}
                    </a>
                  ) : (
                    <div className="shipvn-service">{inner}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <h2 data-reveal className="ffm-section-title">{t("audience.title")}</h2>
          <ul data-reveal-group className="ffm-audience mt-10 lg:mt-12">
            {audience.map((item, index) => {
              const Icon = AUDIENCE[index] ?? UsersThree;
              return (
                <li key={item} className="ffm-audience__item">
                  <Icon size={44} weight="duotone" aria-hidden className="mx-auto text-forest" />
                  <p className="mt-3 text-[0.95rem] font-medium text-ink">{item}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <Pricing direction="vnJp" />

      <section className="auction-benefits">
        <div className="wrap py-12 lg:py-14">
          <h2 data-reveal className="text-center font-sans text-2xl font-extrabold tracking-wide text-white uppercase sm:text-3xl">
            {t("why.title")}
          </h2>
          <ul data-reveal-group className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
            {reasons.map((reason, index) => {
              const Icon = REASONS[index] ?? Package;
              return (
                <li key={reason.title} className="auction-benefit">
                  <Icon size={40} weight="duotone" aria-hidden className="shrink-0 text-gold" />
                  <span>
                    <span className="block font-semibold">{reason.title}</span>
                    <span className="mt-1 block text-sm text-ivory/80">{reason.body}</span>
                    {index === 0 && (
                      <span className="mt-3 flex flex-wrap gap-1.5">
                        {ECOSYSTEM.map((key) => (
                          <a key={key} href={pagePath(locale, key)} className="vnjp-chip">
                            {tPages(`${key}.nav`)}
                          </a>
                        ))}
                      </span>
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <Policy show={["weight", "compensation"]} />

      <section className="section">
        <div className="wrap">
          <div data-reveal className="ffm-closing">
            <Image src="/logo/haruto-mark.png" alt="" width={92} height={80} className="mx-auto h-16 w-auto" />
            <p className="mx-auto mt-5 max-w-[44rem] text-lg font-semibold text-forest sm:text-xl">{t("closing.body")}</p>
            <p className="mt-3 font-medium text-[#c2410c]">{t("closing.tagline")}</p>
            <div className="mt-8 flex justify-center">
              <a href={`${pagePath(locale, "contact")}#contact`} data-track="cta_contact" className="btn btn-primary">
                {t("closing.cta")}
                <ArrowRight size={18} weight="bold" aria-hidden className="m-arrow" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
