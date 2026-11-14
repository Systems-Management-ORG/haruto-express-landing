import { AirplaneTilt, Gavel, Package, ShoppingCart, Warehouse } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import type { Locale } from "@/shared/constants/locales";
import { type PageKey, pagePath } from "@/shared/seo/pages";
import { RouteMap } from "./route-map";

// Services along the route, as chips under the facts (labels: `pages.<page>.nav`).
const TOUCHPOINTS: { page: PageKey; Icon: typeof Package }[] = [
  { page: "concierge", Icon: ShoppingCart },
  { page: "auction", Icon: Gavel },
  { page: "japanWarehouse", Icon: Warehouse },
  { page: "business", Icon: Package },
];

const STATS = ["twoWay", "warehouses", "rate"] as const;

// Home banner at full view: the two-way air route over East Asia (with its flights) fills the
// deep-green banner, the H1, two actions, three facts and the services along the route over it
// on the left (on phones over the map, as a layer above it). Every fact is from the site's own data: the
// warehouses (business.ts) and the lowest VN → JP rate (pricing copy).
export function Hero() {
  const t = useTranslations("hero");
  const tPages = useTranslations("pages");
  const tRate = useTranslations("pricing.teaser.vnJp");
  const locale = useLocale() as Locale;

  return (
    <section id="top" className="hero-full">
      <div data-reveal className="hero-full__map">
        <RouteMap />
      </div>
      <div className="wrap hero-full__content">
        <div className="hero-full__text">
          <p data-reveal className="inline-flex items-center gap-2 rounded-full bg-ivory/10 px-3 py-1.5 text-sm font-medium text-ivory">
            <AirplaneTilt size={18} weight="duotone" aria-hidden className="text-gold" />
            {t("badge")}
          </p>
          <h1 data-reveal className="hero-title mt-5 text-ivory">
            {t("title")}
          </h1>
          <p data-reveal className="mt-5 max-w-[36rem] text-ivory/85 sm:text-lg">
            {t("description")}
          </p>
          <div data-reveal className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#calculator" data-track="cta_calculator" className="btn btn-gold">
              {t("ctaCalc")}
            </a>
            <Link href={pagePath(locale, "concierge")} className="btn btn-outline-light">
              {t("ctaConcierge")}
            </Link>
          </div>

          <dl data-reveal-group className="mt-10 grid gap-4 border-t border-ivory/15 pt-6 sm:grid-cols-3">
            {STATS.map((id) => (
              <div key={id}>
                <dt className="text-sm text-ivory/70">{t(`stats.${id}.label`)}</dt>
                <dd className="mt-1 font-display font-(--weight-display) text-xl text-gold tabular-nums">
                  {id === "rate" ? tRate("price") : t(`stats.${id}.value`)}
                </dd>
              </div>
            ))}
          </dl>

          <div data-reveal className="mt-8">
            <p className="text-sm font-medium text-ivory/70">{t("touchpoints")}</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {TOUCHPOINTS.map(({ page, Icon }) => (
                <li key={page}>
                  <Link href={pagePath(locale, page)} className="hero-full__chip">
                    <Icon size={18} weight="duotone" aria-hidden className="shrink-0 text-gold" />
                    {tPages(`${page}.nav`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
