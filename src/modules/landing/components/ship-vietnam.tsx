import { ArrowRight, CheckCircle, DotsThree, Info } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Breadcrumbs } from "@/shared/components/breadcrumbs";
import type { Locale } from "@/shared/constants/locales";
import { type PageKey, pagePath } from "@/shared/seo/pages";
import { Policy } from "./policy";
import { Surcharges } from "./pricing";

// Art cut from HARUTO's text-free "buy in Japan, ship to Vietnam" poster (public/images/haruto/ship-ve-vn).
const ART = "/images/haruto/ship-ve-vn";
// One icon (and, where one exists, a detail page) per entry of `shipVn.services.items`.
const SERVICES: { icon: string; page?: PageKey }[] = [
  { icon: "icon-mua-ho", page: "concierge" },
  { icon: "icon-dau-gia", page: "auction" },
  { icon: "icon-gom-hang", page: "japanWarehouse" },
  { icon: "icon-ship-nhanh" },
  { icon: "icon-uy-tin" },
];
// Brand colour for each store name in `shipVn.stores.items` (the last entry is "and more").
const STORE_TONES = ["#e60033", "#ff0211", "#bf0000", "#232f3e"];

// Poster-style banner: two-tone headline, ribbon, the problem it solves, then the Japanese stores
// HARUTO buys from, as cards.
export function ShipVietnamHero() {
  const t = useTranslations("shipVn");
  const stores = t.raw("stores.items") as { name: string; note: string }[];

  return (
    <section className="shipvn-hero">
      <div className="wrap py-10 lg:py-14">
        <Breadcrumbs page="shipToVietnam" />
        <div className="mt-6 text-center">
          <h1 className="shipvn-title">
            <span className="text-forest">{t("hero.titleA")}</span>
            <span className="shipvn-title__dash" aria-hidden>
              –
            </span>
            <span className="text-[#ea580c]">{t("hero.titleB")}</span>
          </h1>
          <p className="auction-ribbon mt-4">{t("hero.ribbon")}</p>
          <p className="mx-auto mt-5 max-w-[44rem] sm:text-lg">{t("hero.body")}</p>
        </div>

        <ul data-reveal-group className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:mt-10 lg:grid-cols-5 lg:gap-4">
          {stores.map((store, index) => (
            <li key={store.name} className="shipvn-store">
              {STORE_TONES[index] ? (
                <span className="shipvn-store__name" style={{ color: STORE_TONES[index] }}>
                  {store.name}
                </span>
              ) : (
                <DotsThree size={40} weight="bold" aria-hidden className="text-ink" />
              )}
              <span className="mt-1 text-sm text-muted">{store.note}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function ShipVietnamBody() {
  const t = useTranslations("shipVn");
  const tFreight = useTranslations("pricing.freight");
  const locale = useLocale() as Locale;
  const services = t.raw("services.items") as { title: string; body: string }[];
  const reasons = t.raw("why.items") as string[];

  return (
    <>
      {/* The route: Japan → Vietnam. The two blank tags under the map pins get live labels placed
          in percentages of the artwork, so they stay on the tags at every width. */}
      <section className="pb-16 lg:pb-24">
        <div className="wrap">
          <figure data-reveal className="shipvn-scene">
            <Image
              src={`${ART}/duong-bay-nhat-viet.webp`}
              alt={t("scene.alt")}
              width={1201}
              height={478}
              sizes="(max-width: 1279px) 100vw, 1216px"
              className="block h-auto w-full"
            />
            <figcaption className="contents">
              <span className="shipvn-tag shipvn-tag--jp">{t("scene.japan")}</span>
              <span className="shipvn-tag shipvn-tag--vn">{t("scene.vietnam")}</span>
            </figcaption>
          </figure>

          <div data-reveal-group className="mx-auto mt-8 grid max-w-[52rem] gap-4 sm:grid-cols-2">
            <div className="shipvn-stat">
              <p className="text-sm font-medium tracking-[0.12em] text-muted uppercase">{t("stats.priceLabel")}</p>
              <p className="shipvn-stat__value">{t("stats.price")}</p>
            </div>
            <div className="shipvn-stat shipvn-stat--rate">
              <p className="text-sm font-medium tracking-[0.12em] text-muted uppercase">{t("stats.rateLabel")}</p>
              <p className="shipvn-stat__value">{t("stats.rate")}</p>
            </div>
          </div>
          <ul className="mx-auto mt-4 grid max-w-[52rem] gap-2 text-sm text-muted">
            {(["domestic", "vat"] as const).map((key) => (
              <li key={key} className="flex gap-2">
                <Info size={18} weight="fill" aria-hidden className="mt-0.5 shrink-0 text-gold" />
                <span>{tFreight(key)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section bg-sage">
        <div className="wrap">
          <h2 data-reveal className="shipvn-heading">
            <span className="text-forest">HARUTO EXPRESS</span> – {t("services.title")}
          </h2>
          <ul data-reveal-group className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:mt-12 lg:grid-cols-5 lg:gap-4">
            {services.map((service, index) => {
              const { icon, page } = SERVICES[index] ?? SERVICES[0];
              const inner = (
                <>
                  <Image src={`${ART}/${icon}.webp`} alt="" width={122} height={104} className="mx-auto h-16 w-auto" />
                  <span className="mt-3 block font-bold tracking-wide text-forest uppercase">{service.title}</span>
                  <span className="mt-1 block text-sm text-muted">{service.body}</span>
                  {page && (
                    <span className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-forest">
                      {t("services.more")}
                      <ArrowRight size={14} aria-hidden className="m-arrow" />
                    </span>
                  )}
                </>
              );
              return (
                <li key={service.title} className="h-full">
                  {page ? (
                    <Link href={pagePath(locale, page)} className="shipvn-service shipvn-service--link">
                      {inner}
                    </Link>
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
        <div className="wrap grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <h2 data-reveal className="heading-2">{t("why.title")}</h2>
            <p data-reveal className="mt-4 sm:text-lg">{t("why.body")}</p>
          </div>
          <ul data-reveal-group className="grid gap-3">
            {reasons.map((reason) => (
              <li key={reason} className="flex items-center gap-3 rounded-card border border-line bg-white px-5 py-4 text-lg">
                <CheckCircle size={28} weight="fill" aria-hidden className="shrink-0 text-forest" />
                {reason}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Surcharges />
      <Policy show={["weight", "compensation", "warehouse"]} />

    </>
  );
}
