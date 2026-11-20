import {
  CheckCircle,
  ClipboardText,
  CurrencyCircleDollar,
  Info,
  Package,
  Prohibit,
  Receipt,
  Storefront,
  Truck,
  Warning,
} from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import type { Locale } from "@/shared/constants/locales";
import { formatVnd } from "@/shared/lib/format";
import { rawRecord } from "@/shared/lib/raw-messages";
import { PRICING_IMAGES } from "@/shared/seo/page-media";
import { PRICING_FEATURE_TONES, SURCHARGE_ICONS, type Tone } from "../../info-pages";
import { SURCHARGES } from "../../pricing-data";

// Bodies of the rate sections of the price-policy pages (the InfoPage frame adds the anchor,
// background and H2): VN→JP rate tables per goods type, the JP→VN flat rate and the surcharge grid.

type Rate = { weight: string; price: string; note?: string };
const VN_JP_GOODS = ["clean", "mixed"] as const;

const TONE_ICON: Record<Tone, { Icon: typeof Info; className: string }> = {
  info: { Icon: Info, className: "text-forest" },
  ok: { Icon: CheckCircle, className: "text-forest" },
  warn: { Icon: Warning, className: "text-gold" },
  ban: { Icon: Prohibit, className: "text-[#9f2f2d]" },
};

// "130.000 VNĐ/kg" / "130,000 VND/kg" → 130000; text-only prices ("Thương lượng") → null.
function amount(price: string): number | null {
  const digits = price.replace(/[^\d]/g, "");
  return digits ? Number(digits) : null;
}

// Weight-band table. Lowest rate is flagged with a clean badge.
function RateTable({ rows, label }: { rows: Rate[]; label: string }) {
  const t = useTranslations("pricing");
  const amounts = rows.map((row) => amount(row.price));
  const known = amounts.filter((value): value is number => value !== null);
  const min = Math.min(...known);

  return (
    <div tabIndex={0} role="group" aria-label={label} className="rate-table-wrap">
      <table className="rate-table">
        <thead>
          <tr>
            <th scope="col">{t("vnJp.columns.weight")}</th>
            <th scope="col">{t("vnJp.columns.price")}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => {
            const value = amounts[index];
            const best = value === min;
            return (
              <tr key={row.weight} data-best={best || undefined}>
                <th scope="row">
                  <span className="rate-weight">{row.weight}</span>
                </th>
                <td>
                  <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                    <span className="font-semibold whitespace-nowrap text-ink">{row.price}</span>
                    {best && <span className="rate-badge">{t("bestRate")}</span>}
                  </div>
                  {row.note && <span className="mt-1 block text-xs font-medium text-[#9a6514]">{row.note}</span>}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function GoodsRates({ kind }: { kind: (typeof VN_JP_GOODS)[number] }) {
  const t = useTranslations("pricing");
  const rows = t.raw(`vnJp.${kind}.rows`) as Rate[];
  const features = rawRecord<string>(t, `vnJp.${kind}.features`);

  return (
    <article className="rate-card">
      <div className="rate-card__media">
        <Image src={PRICING_IMAGES[kind]} alt={t(`vnJp.${kind}.title`)} fill sizes="(max-width: 1023px) 100vw, 40vw" className="object-cover" />
        <h3 className="rate-card__title">{t(`vnJp.${kind}.title`)}</h3>
      </div>
      <div className="grid gap-6 p-5 sm:p-6">
        <ul className="grid gap-2.5 text-[0.95rem] leading-relaxed">
          {Object.entries(features).map(([id, feature]) => {
            const { Icon, className } = TONE_ICON[PRICING_FEATURE_TONES[kind][id] ?? "ok"];
            return (
              <li key={id} className="flex gap-2.5">
                <Icon size={20} weight="fill" aria-hidden className={`mt-0.5 shrink-0 ${className}`} />
                <span>{feature}</span>
              </li>
            );
          })}
        </ul>
        <div>
          <RateTable rows={rows} label={t("vnJp.scrollLabel")} />
          <p className="mt-3 text-sm text-muted">{t(`vnJp.${kind}.note`)}</p>
        </div>
      </div>
    </article>
  );
}

// Vietnam → Japan: the shared intro line and one rate card per goods type (the 0.5 kg rounding
// rule lives with the bulky-goods rules, `pricePolicy.vnJpWeight`).
export function RatesVnJp() {
  const t = useTranslations("pricing");

  return (
    <div data-reveal>
      <p className="callout">
        <CheckCircle size={22} weight="fill" aria-hidden className="shrink-0 text-forest" />
        <span>{t("vnJp.intro")}</span>
      </p>
      <div className="mt-8 grid items-start gap-6 lg:grid-cols-2">
        {VN_JP_GOODS.map((kind) => (
          <GoodsRates key={kind} kind={kind} />
        ))}
      </div>
    </div>
  );
}

const DOMESTIC = [
  ["payer", Truck],
  ["choose", Storefront],
  ["booking", ClipboardText],
  ["cost", Receipt],
] as const;

// Japan → Vietnam: one flat rate for every weight. "teaser": with the buying rate and domestic
// delivery as two notes. "policy" (the JP→VN price-policy page, where the buying rate has its own
// section): domestic delivery as the PDF's four lines.
export function RatesJpVn({ variant = "teaser" }: { variant?: "teaser" | "policy" }) {
  const t = useTranslations("pricing");
  const tDomestic = useTranslations("pricePolicy.domestic");

  const card = (
    <div data-reveal className="rate-card lg:grid lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)]">
      <div className="rate-card__media lg:aspect-auto lg:min-h-full">
        <Image src={PRICING_IMAGES.jpVn} alt={t("teaser.jpVn.label")} fill sizes="(max-width: 1023px) 100vw, 45vw" className="object-cover object-[78%_50%]" />
      </div>
      <div className="p-6 sm:p-8 lg:p-10">
        <div className="flex flex-wrap items-center gap-2.5">
          <p className="text-xs font-bold tracking-[0.12em] text-forest uppercase">{t("teaser.jpVn.label")}</p>
          <span className="rounded-full bg-forest/10 px-2.5 py-0.5 text-xs font-semibold text-forest">Đồng giá</span>
        </div>
        <p className="mt-3 font-display font-(--weight-display) text-5xl text-forest lg:text-6xl">{t("freight.price")}</p>
        <p className="mt-2 text-sm font-medium text-muted">{t("freight.weight")}</p>
        {variant === "teaser" ? (
          <ul className="mt-8 grid gap-3.5 border-t border-line pt-6">
            {([
              ["buyRate", CurrencyCircleDollar],
              ["domestic", Truck],
            ] as const).map(([key, Icon]) => (
              <li key={key} className="flex items-center gap-3 rounded-xl border border-line/60 bg-ivory/50 p-3">
                <span className="icon-chip shrink-0" aria-hidden>
                  <Icon size={20} weight="duotone" />
                </span>
                <span className="text-sm font-medium text-ink">{t(`freight.${key}`)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-8 border-t border-line pt-6">
            <h3 className="text-lg font-semibold text-forest">{tDomestic("title")}</h3>
            <ul className="mt-4 grid gap-3">
              {DOMESTIC.map(([key, Icon]) => (
                <li key={key} className="flex items-start gap-3 rounded-xl border border-line/60 bg-ivory/40 p-3.5 transition-colors hover:bg-ivory/80">
                  <span className="icon-chip shrink-0 mt-0.5" aria-hidden>
                    <Icon size={20} weight="duotone" />
                  </span>
                  <span className="text-sm leading-relaxed text-ink">{tDomestic(`items.${key}`)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );

  return card;
}

// Surcharges as icon cards: the item on top, the fee as a tag underneath. The amount and its unit
// come from SURCHARGES (pricing-data.ts); only "other" (on request) keeps its words in the messages.
export function Surcharges() {
  const t = useTranslations("pricing.surcharge");
  const tUnit = useTranslations("pricePolicy.surchargeUnit");
  const locale = useLocale() as Locale;
  const items = rawRecord<{ item: string }>(t, "items");

  return (
    <ul data-reveal-group className="grid grid-cols-2 gap-3.5 sm:gap-4 lg:grid-cols-4">
      {(Object.keys(SURCHARGES) as (keyof typeof SURCHARGES)[]).map((id) => {
        const row = items[id];
        const { vnd, per } = SURCHARGES[id];
        const fee = vnd == null ? t("items.other.fee") : `${formatVnd(vnd, locale)} ${tUnit(per)}`;
        const Icon = SURCHARGE_ICONS[id] ?? Package;
        return (
          <li key={id} className="surcharge-card group">
            <span className="icon-chip transition-colors group-hover:bg-forest group-hover:text-gold" aria-hidden>
              <Icon size={22} weight="duotone" />
            </span>
            <p className="mt-3.5 flex-1 font-semibold text-ink leading-snug">{row.item}</p>
            <p className="surcharge-card__fee">{fee}</p>
          </li>
        );
      })}
    </ul>
  );
}
