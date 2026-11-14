import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import type { Locale } from "@/shared/constants/locales";
import { PRICING_IMAGES } from "@/shared/seo/page-media";
import { type PageKey, pagePath } from "@/shared/seo/pages";
import { ShippingCalculator } from "./shipping-calculator";

// Each direction links to its own route page, which carries the full pricing + policy.
const CARDS: { key: "vnJp" | "jpVn"; page: PageKey }[] = [
  { key: "vnJp", page: "shipToJapan" },
  { key: "jpVn", page: "shipToVietnam" },
];

// Rate overview of the home hub, beside the freight calculator; the detailed tables live per route.
export function PricingTeaser({ withHeader = true }: { withHeader?: boolean }) {
  const t = useTranslations("pricing.teaser");
  const locale = useLocale() as Locale;

  return (
    <section id="pricing" className="section">
      <div className="wrap">
        {withHeader && (
          <>
            <h2 data-reveal className="heading-2">{t("title")}</h2>
            <p data-reveal className="mt-4 max-w-[44rem] sm:text-lg">{t("intro")}</p>
          </>
        )}

        {/* Rates on the left, the calculator on the right (stacked on small screens). */}
        <div className="mt-10 grid gap-8 lg:mt-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-start">
          <div>
            <div data-reveal-group className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
              {CARDS.map(({ key, page }) => (
                <Link key={key} href={pagePath(locale, page)} className="teaser-card group">
                  <div className="teaser-card__media aspect-[21/9]">
                    <Image src={PRICING_IMAGES[key]} alt="" fill sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 40vw" className="object-cover object-[75%_50%]" />
                    <span className="teaser-card__label">{t(`${key}.label`)}</span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="font-display font-(--weight-display) text-3xl text-forest tabular-nums lg:text-4xl">{t(`${key}.price`)}</p>
                    <p className="mt-2 text-muted">{t(`${key}.caption`)}</p>
                    <span className="link-arrow mt-auto pt-3 text-forest">{t("cardCta")}</span>
                  </div>
                </Link>
              ))}
            </div>
            <p data-reveal className="mt-6 text-sm text-muted">{t("note")}</p>
          </div>

          <ShippingCalculator />
        </div>
      </div>
    </section>
  );
}
