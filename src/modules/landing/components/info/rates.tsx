import {
  CheckCircle,
  CurrencyCircleDollar,
  Info,
  Package,
  Prohibit,
  Receipt,
  Scales,
  Truck,
  Warning,
} from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { rawRecord } from "@/shared/lib/raw-messages";
import { PRICING_IMAGES } from "@/shared/seo/page-media";
import { PRICING_FEATURE_TONES, SURCHARGE_ICONS, type Tone } from "../../info-pages";

// Bodies of the /bang-gia sections (the InfoPage frame adds the anchor, background and H2):
// VN→JP rate tables per goods type, the JP→VN flat rate and the surcharge grid.

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

// Weight-band table. A bar under each price shows it against the band's highest rate, and the
// lowest rate is flagged, so the falling price per kg reads at a glance.
function RateTable({ rows, label }: { rows: Rate[]; label: string }) {
  const t = useTranslations("pricing");
  const amounts = rows.map((row) => amount(row.price));
  const known = amounts.filter((value): value is number => value !== null);
  const max = Math.max(...known);
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
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                    <span className="font-semibold whitespace-nowrap text-ink">{row.price}</span>
                    {best && <span className="rate-badge">{t("bestRate")}</span>}
                  </div>
                  {value !== null && (
                    <span aria-hidden className="rate-bar">
                      <span style={{ width: `${Math.max(12, (value / max) * 100)}%` }} />
                    </span>
                  )}
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
        <Image src={PRICING_IMAGES[kind]} alt="" fill sizes="(max-width: 1023px) 100vw, 40vw" className="object-cover" />
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

// Rounding rule per goods type as a short rule plus worked examples, instead of a paragraph.
function RoundingRules() {
  const t = useTranslations("pricing.vnJp");

  return (
    <div className="mt-8">
      <h3 className="text-xl text-forest">{t("roundingRules.title")}</h3>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {VN_JP_GOODS.map((kind) => {
          const examples = t.raw(`roundingRules.${kind}.examples`) as string[];
          return (
            <div key={kind} className="info-card flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="rate-weight">{t(`${kind}.title`)}</span>
                <span className="font-medium">{t(`roundingRules.${kind}.rule`)}</span>
              </div>
              <ul className="flex flex-wrap gap-2" aria-label={t("roundingRules.title")}>
                {examples.map((example) => (
                  <li key={example} className="rounding-example">
                    <Scales size={16} weight="duotone" aria-hidden />
                    {example}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Vietnam → Japan: the shared intro line, one rate card per goods type, the rounding rules.
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
      <RoundingRules />
    </div>
  );
}

// Japan → Vietnam: one flat rate for every weight, with the buying rate, domestic delivery and VAT notes.
export function RatesJpVn() {
  const t = useTranslations("pricing");

  return (
    <div data-reveal className="rate-card lg:grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)]">
      <div className="rate-card__media lg:aspect-auto lg:min-h-full">
        <Image src={PRICING_IMAGES.jpVn} alt="" fill sizes="(max-width: 1023px) 100vw, 45vw" className="object-cover object-[78%_50%]" />
      </div>
      <div className="p-6 sm:p-8 lg:p-10">
        <p className="text-sm font-medium tracking-[0.14em] text-muted uppercase">{t("teaser.jpVn.label")}</p>
        <p className="mt-3 font-display font-(--weight-display) text-5xl text-forest lg:text-6xl">{t("freight.price")}</p>
        <p className="mt-2 text-muted">{t("freight.weight")}</p>
        <ul className="mt-8 grid gap-4 border-t border-line pt-6">
          {([
            ["buyRate", CurrencyCircleDollar],
            ["domestic", Truck],
            ["vat", Receipt],
          ] as const).map(([key, Icon]) => (
            <li key={key} className="flex gap-3">
              <span className="icon-chip" aria-hidden>
                <Icon size={20} weight="duotone" />
              </span>
              <span className="pt-1.5">{t(`freight.${key}`)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// Surcharges as icon cards: the item on top, the fee as a tag underneath.
export function Surcharges() {
  const t = useTranslations("pricing.surcharge");
  const items = rawRecord<{ item: string; fee: string }>(t, "items");

  return (
    <ul data-reveal-group className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {Object.entries(items).map(([id, row]) => {
        const Icon = SURCHARGE_ICONS[id] ?? Package;
        return (
          <li key={id} className="surcharge-card">
            <span className="icon-chip" aria-hidden>
              <Icon size={22} weight="duotone" />
            </span>
            <p className="mt-4 flex-1 leading-snug font-medium">{row.item}</p>
            <p className="surcharge-card__fee">{row.fee}</p>
          </li>
        );
      })}
    </ul>
  );
}
