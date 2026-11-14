import { AirplaneTilt } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import type { Locale } from "@/shared/constants/locales";
import { pagePath } from "@/shared/seo/pages";

const STATS = ["twoWay", "warehouses", "rate"] as const;

// Home banner, the design system's page hero at full view: HARUTO's banner artwork across the
// whole banner (above the copy on phones), the H1, two actions and three facts over the ivory fade
// on the left. Every fact is from the site's own data: the warehouses (business.ts) and the
// lowest VN → JP rate (pricing copy).
export function Hero() {
  const t = useTranslations("hero");
  const tRate = useTranslations("pricing.teaser.vnJp");
  const locale = useLocale() as Locale;

  return (
    <section id="top" className="page-hero page-hero--full">
      <div className="page-hero__stage">
        <div className="page-hero__media">
          <Image
            src="/images/haruto/hero/may-bay-nui-phu-si-thap-tokyo-hoa-anh-dao.webp"
            alt=""
            fill
            priority
            sizes="100vw"
            style={{ objectPosition: "76% 50%" }}
          />
        </div>
        <div className="wrap page-hero__content">
          <div className="page-hero__text">
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
              <Link href={pagePath(locale, "concierge")} className="btn btn-outline bg-white/70">
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
        </div>
      </div>
    </section>
  );
}
