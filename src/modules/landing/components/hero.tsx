import { AirplaneTilt, Gavel, Package, ShoppingCart, Warehouse } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import type { Locale } from "@/shared/constants/locales";
import { type PageKey, pagePath } from "@/shared/seo/pages";
import { RouteMap } from "./route-map";

// Services along the route, shown under the map (labels: `pages.<page>.nav`).
const TOUCHPOINTS: { page: PageKey; Icon: typeof Package }[] = [
  { page: "concierge", Icon: ShoppingCart },
  { page: "auction", Icon: Gavel },
  { page: "japanWarehouse", Icon: Warehouse },
  { page: "business", Icon: Package },
];

const STATS = ["twoWay", "warehouses", "rate"] as const;

// Split hero: the page's H1, two actions and three facts on the left (55%); the two-way air
// route on a deep-green panel on the right (45%), with the services along it. Every fact is from
// the site's own data: the warehouses (business.ts) and the lowest VN → JP rate (pricing copy).
export function Hero() {
  const t = useTranslations("hero");
  const tPages = useTranslations("pages");
  const tRate = useTranslations("pricing.teaser.vnJp");
  const locale = useLocale() as Locale;

  return (
    <section id="top" className="hero-split">
      <div className="wrap grid items-center gap-10 py-10 lg:grid-cols-[minmax(0,55fr)_minmax(0,45fr)] lg:gap-12 lg:py-16">
        <div>
          <p data-reveal className="inline-flex items-center gap-2 rounded-full bg-sage px-3 py-1.5 text-sm font-medium text-forest">
            <AirplaneTilt size={18} weight="duotone" aria-hidden />
            {t("badge")}
          </p>
          <h1 data-reveal className="hero-title mt-5 text-forest">
            {t("title")}
          </h1>
          <p data-reveal className="mt-5 max-w-[36rem] sm:text-lg">
            {t("description")}
          </p>
          <div data-reveal className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#calculator" data-track="cta_calculator" className="btn btn-gold">
              {t("ctaCalc")}
            </a>
            <Link href={pagePath(locale, "concierge")} className="btn btn-outline">
              {t("ctaConcierge")}
            </Link>
          </div>

          <dl data-reveal-group className="mt-10 grid gap-4 border-t border-line pt-6 sm:grid-cols-3">
            {STATS.map((id) => (
              <div key={id}>
                <dt className="text-sm text-muted">{t(`stats.${id}.label`)}</dt>
                <dd className="mt-1 font-display font-(--weight-display) text-xl text-forest tabular-nums">
                  {id === "rate" ? tRate("price") : t(`stats.${id}.value`)}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div data-reveal className="hero-map">
          <div className="hero-map__art">
            <RouteMap />
          </div>
          <div className="hero-map__foot">
            <p className="text-sm font-medium text-ivory/75">{t("touchpoints")}</p>
            <ul className="mt-3 grid grid-cols-2 gap-2">
              {TOUCHPOINTS.map(({ page, Icon }) => (
                <li key={page}>
                  <Link href={pagePath(locale, page)} className="hero-map__chip">
                    <Icon size={20} weight="duotone" aria-hidden className="shrink-0 text-gold" />
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
