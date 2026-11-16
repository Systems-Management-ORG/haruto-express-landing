import { Info } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import type { Locale } from "@/shared/constants/locales";
import { NUMBER_LOCALE } from "@/shared/lib/format";
import { JP_VN, priceRange, VN_JP_CLEAN, VN_JP_MIXED } from "../../pricing-data";
import { PRICING_IMAGES } from "@/shared/seo/page-media";
import { pagePath } from "@/shared/seo/pages";
import { SectionHead } from "@/shared/ui/section-head";

// A short rate summary for a route page; the full tables, surcharges and weight rules live on the
// price-policy page of that direction (priceVnJp / priceJpVn), which the closing button opens.
// Amounts come from pricing-data.ts (never from price strings), as a min – max range per goods
// type rather than a "from" anchor price, then every weight band of that table (VN → JP).

type Row = { weight: string; price: string; note?: string };

export function PriceSummary({ direction }: { direction: "vnJp" | "jpVn" }) {
  const t = useTranslations("pricing");
  const tPrice = useTranslations("service.price");
  const locale = useLocale() as Locale;
  const nf = new Intl.NumberFormat(NUMBER_LOCALE[locale]);
  const unit = tPrice("unit");

  return (
    <section className="section border-t border-line bg-white">
      <div className="wrap">
        <SectionHead title={tPrice("title")} intro={t(`teaser.${direction}.label`)} />

        {direction === "vnJp" ? (
          <ul data-reveal-group className="mx-auto mt-10 grid max-w-[56rem] gap-5 sm:grid-cols-2 lg:mt-12">
            {([
              ["clean", VN_JP_CLEAN],
              ["mixed", VN_JP_MIXED],
            ] as const).map(([kind, tiers]) => {
              const [min, max] = priceRange(tiers);
              const rows = t.raw(`vnJp.${kind}.rows`) as Row[];
              const first = rows[0];
              return (
                <li key={kind} className="svc-price svc-price--table">
                  <div className="svc-price__media">
                    <Image src={PRICING_IMAGES[kind]} alt="" fill sizes="(max-width: 639px) 100vw, 28rem" className="object-cover" />
                  </div>
                  <div className="svc-price__inner">
                    <h3 className="svc-price__label">{t(`vnJp.${kind}.title`)}</h3>
                    <p className="svc-price__value">
                      {nf.format(min)} – {nf.format(max)} <span className="svc-price__unit">{unit}</span>
                    </p>
                    {first?.note && (
                      <p className="mt-2 text-sm font-medium text-forest">
                        {first.weight}: {first.note}
                      </p>
                    )}
                    {/* Every weight band: the label from the table copy, the rate from pricing-data.ts. */}
                    <dl className="svc-price__bands">
                      {rows.map((row, index) => {
                        const rate = tiers[index]?.vndPerKg;
                        return (
                          <div key={row.weight}>
                            <dt>{row.weight}</dt>
                            <dd>{rate != null ? nf.format(rate) : row.price}</dd>
                          </div>
                        );
                      })}
                    </dl>
                    <p className="mt-4 text-sm text-muted">
                      {t(`vnJp.${kind}.note`)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div data-reveal-group className="mx-auto mt-10 grid max-w-[56rem] items-center gap-6 sm:grid-cols-2 lg:mt-12">
            <div className="svc-price">
              <h3 className="svc-price__label">{t("teaser.jpVn.label")}</h3>
              <p className="svc-price__value">
                {nf.format(JP_VN[0].vndPerKg ?? 0)} <span className="svc-price__unit">{unit}</span>
              </p>
              <p className="mt-3 text-sm text-muted">{t("freight.weight")}</p>
            </div>
            <ul className="grid gap-3">
              {(["buyRate", "domestic"] as const).map((key) => (
                <li key={key} className="flex gap-2.5 text-sm sm:text-base">
                  <Info size={20} weight="fill" aria-hidden className="mt-0.5 shrink-0 text-gold" />
                  <span>{t(`freight.${key}`)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div data-reveal className="mt-8 flex flex-col items-center gap-4 text-center">
          {direction === "vnJp" && <p className="text-sm text-muted">{t("teaser.note")}</p>}
          <Link
            href={pagePath(locale, direction === "vnJp" ? "priceVnJp" : "priceJpVn")}
            data-track={`cta_price_policy_${direction}`}
            className="btn btn-outline bg-white/70"
          >
            {tPrice("detail")}
          </Link>
        </div>
      </div>
    </section>
  );
}
