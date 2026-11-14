import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
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

// Rate overview used on the home hub and the /bang-gia page; the detailed tables live per route.
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

        <div data-reveal-group className="mt-10 grid gap-5 sm:grid-cols-2 lg:mt-12">
          {CARDS.map(({ key, page }) => (
            <Link key={key} href={pagePath(locale, page)} className="teaser-card group">
              <div className="teaser-card__media">
                <Image src={PRICING_IMAGES[key]} alt="" fill sizes="(max-width: 639px) 100vw, 50vw" className="object-cover object-[75%_50%]" />
                <span className="teaser-card__label">{t(`${key}.label`)}</span>
              </div>
              <div className="flex flex-1 flex-col p-6 sm:p-8">
                <p className="font-display font-(--weight-display) text-4xl text-forest lg:text-5xl">{t(`${key}.price`)}</p>
                <p className="mt-3 text-muted">{t(`${key}.caption`)}</p>
                <span className="link-arrow mt-auto pt-4 text-forest">
                  {t("cardCta")}
                  <ArrowRight size={18} aria-hidden className="m-arrow" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        <p data-reveal className="mt-6 text-sm text-muted">{t("note")}</p>

        <ShippingCalculator />
      </div>
    </section>
  );
}
