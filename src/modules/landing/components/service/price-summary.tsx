import { Info } from "@phosphor-icons/react/dist/ssr";
import { useLocale, useTranslations } from "next-intl";
import type { Locale } from "@/shared/constants/locales";
import { JP_VN, type Tier, VN_JP_CLEAN, VN_JP_MIXED } from "../../pricing-data";
import { ContactCta } from "./contact-cta";
import { SectionHead } from "./section-head";

// A short rate summary for a route page; the full tables, surcharges and weight rules live on
// /bang-gia. Amounts come from pricing-data.ts (never from price strings), as a min – max range
// per goods type rather than a "from" anchor price.

const NUMBER_LOCALE: Record<Locale, string> = { vi: "vi-VN", ja: "ja-JP", en: "en-US" };

type Row = { weight: string; price: string; note?: string };

function range(tiers: Tier[]): [number, number] {
  const priced = tiers.map((tier) => tier.vndPerKg).filter((value): value is number => value != null);
  return [Math.min(...priced), Math.max(...priced)];
}

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
              const [min, max] = range(tiers);
              const first = (t.raw(`vnJp.${kind}.rows`) as Row[])[0];
              return (
                <li key={kind} className="svc-price">
                  <h3 className="svc-price__label">{t(`vnJp.${kind}.title`)}</h3>
                  <p className="svc-price__value">
                    {nf.format(min)} – {nf.format(max)} <span className="svc-price__unit">{unit}</span>
                  </p>
                  {first?.note && (
                    <p className="mt-2 text-sm font-medium text-forest">
                      {first.weight}: {first.note}
                    </p>
                  )}
                  <p className="mt-3 text-sm text-muted">{t(`vnJp.${kind}.note`)}</p>
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
              {(["buyRate", "domestic", "vat"] as const).map((key) => (
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
          <ContactCta action="pricing" variant="outline" />
        </div>
      </div>
    </section>
  );
}
