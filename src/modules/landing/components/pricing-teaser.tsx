import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { useLocale, useTranslations } from "next-intl";
import type { Locale } from "@/shared/constants/locales";
import { pagePath } from "@/shared/seo/pages";

const CARDS = ["vnJp", "jpVn"] as const;

// Compact rate highlights for the home hub; the full tables live on the pricing page.
export function PricingTeaser() {
  const t = useTranslations("pricing.teaser");
  const locale = useLocale() as Locale;

  return (
    <section id="pricing" className="section">
      <div className="wrap">
        <h2 data-reveal className="heading-2">{t("title")}</h2>
        <p data-reveal className="mt-4 max-w-[44rem] sm:text-lg">{t("intro")}</p>

        <div data-reveal-group className="mt-10 grid gap-5 sm:grid-cols-2 lg:mt-12">
          {CARDS.map((key) => (
            <article key={key} className="card flex flex-col">
              <p className="text-sm font-medium uppercase tracking-[0.14em] text-muted">{t(`${key}.label`)}</p>
              <p className="mt-3 font-display text-4xl text-forest lg:text-5xl">{t(`${key}.price`)}</p>
              <p className="mt-3 text-muted">{t(`${key}.caption`)}</p>
            </article>
          ))}
        </div>

        <div data-reveal className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
          <a href={pagePath(locale, "pricing")} className="btn btn-primary">
            {t("cta")}
            <span className="btn-chip" aria-hidden>
              <ArrowRight size={14} weight="bold" />
            </span>
          </a>
          <p className="text-sm text-muted">{t("note")}</p>
        </div>
      </div>
    </section>
  );
}
