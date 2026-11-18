import {
  AirplaneTilt,
  ArrowsDownUp,
  BatteryCharging,
  CheckCircle,
  Coins,
  Cube,
  CurrencyJpy,
  Info,
  Lightbulb,
  Package,
  Scales,
  ShieldCheck,
  Warning,
} from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import type { CSSProperties } from "react";
import type { Locale } from "@/shared/constants/locales";
import { formatNumber, formatVnd } from "@/shared/lib/format";
import { rawRecord } from "@/shared/lib/raw-messages";
import { POLICY_FIGURES } from "@/shared/seo/page-media";
import { anchorOf, JP_VN_BULKY_EXAMPLE_ICONS, type Tone, VN_JP_BULKY_CASES } from "../../info-pages";
import {
  COMPENSATION,
  JP_VN,
  JP_VN_BULKY,
  VN_JP_BULKY,
  VN_JP_CLEAN,
  VN_JP_SIZE_STANDARD,
} from "../../pricing-data";
import { VolumetricDiagram } from "../volumetric-diagram";

// Bodies of the price-policy sections (the InfoPage frame adds the anchor, background and H2):
// the weight rules of each direction (they differ: VN→JP has a size standard by weight and a
// bulky surcharge, JP→VN charges the volumetric weight), the buy-for-you rate, the route cards of
// the cost breakdown and the PDF infographics. Every number comes from
// pricing-data.ts.

const TONE_CLASS: Record<Tone, string> = {
  info: "text-forest",
  ok: "text-forest",
  warn: "text-gold-deep",
  ban: "text-orange-deep",
};

// "120 cm" / "140 – 150 cm"
function cmRange([low, high]: [number, number]): string {
  return low === high ? `${low} cm` : `${low} – ${high} cm`;
}

// Vietnam → Japan: size standard by weight, when the bulky surcharge applies, its range, the
// 0.5 kg rounding and the "contact us first" limit, then the PDF's infographic (vi only).
export function WeightVnJp() {
  const t = useTranslations("pricePolicy.vnJpWeight");
  const tPrice = useTranslations("service.price");
  const locale = useLocale() as Locale;
  const [min, max] = VN_JP_BULKY.surchargeVnd;
  const examples = t.raw("roundingExamples") as string[];
  const caseParams = {
    oversize: {},
    longSide: { cm: VN_JP_BULKY.anySideCm },
    contact: { cm: VN_JP_BULKY.contactSumCm, kg: VN_JP_BULKY.contactKg },
  };

  return (
    <div>
      <div data-reveal-group className="grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <article className="info-card p-6 sm:p-8">
          <h3 className="border-l-4 border-l-gold pl-3.5 text-lg font-semibold text-forest">{t("sizeTitle")}</h3>
          <div tabIndex={0} role="group" aria-label={t("sizeTitle")} className="rate-table-wrap mt-4">
            <table className="rate-table">
              <thead>
                <tr>
                  <th scope="col">{t("columns.weight")}</th>
                  <th scope="col">{t("columns.maxSum")}</th>
                </tr>
              </thead>
              <tbody>
                {VN_JP_SIZE_STANDARD.map((row) => (
                  <tr key={row.minKg}>
                    <th scope="row">
                      <span className="rate-weight">
                        {row.minKg === 0 ? t("under", { kg: row.maxKg }) : `${row.minKg} – ${row.maxKg} kg`}
                      </span>
                    </th>
                    <td className="font-semibold whitespace-nowrap text-ink">{cmRange(row.maxSumCm)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="mt-8 border-l-4 border-l-gold pl-3.5 text-lg font-semibold text-forest">{t("casesTitle")}</h3>
          <ul className="mt-4 grid gap-3">
            {(Object.keys(VN_JP_BULKY_CASES) as (keyof typeof VN_JP_BULKY_CASES)[]).map((id) => {
              const { Icon, tone } = VN_JP_BULKY_CASES[id];
              return (
                <li key={id} className="flex items-start gap-3 rounded-xl border border-line bg-ivory/60 px-4 py-3">
                  <Icon size={22} weight="duotone" aria-hidden className={`mt-0.5 shrink-0 ${TONE_CLASS[tone]}`} />
                  <span>{t(`cases.${id}`, caseParams[id])}</span>
                </li>
              );
            })}
          </ul>
        </article>

        <div className="grid content-start gap-5">
          <article className="stat-card stat-card--featured">
            <div className="flex items-center gap-3">
              <Coins size={28} weight="duotone" aria-hidden />
              <h3 className="text-lg font-medium">{t("surchargeLabel")}</h3>
            </div>
            <p className="stat-card__value text-4xl tabular-nums sm:text-5xl lg:text-4xl xl:text-5xl">
              {formatVnd(min, locale)} – {formatVnd(max, locale)}
            </p>
            <p className="stat-card__label">{tPrice("unitVnd")}</p>
            <p className="stat-card__body">{t("surchargeNote")}</p>
          </article>

          <article className="info-card p-6 sm:p-8">
            <div className="flex items-center gap-3 border-l-4 border-l-gold pl-3.5">
              <span className="icon-chip" aria-hidden>
                <ArrowsDownUp size={20} weight="duotone" />
              </span>
              <h3 className="text-lg font-semibold text-forest">{t("roundingTitle")}</h3>
            </div>
            <p className="mt-3 text-muted">{t("roundingBody")}</p>
            <ul className="mt-4 flex flex-wrap gap-2" aria-label={t("roundingTitle")}>
              {examples.map((example) => (
                <li key={example} className="rounding-example">
                  <Scales size={16} weight="duotone" aria-hidden />
                  {example}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </div>

      <p data-reveal className="callout mt-6">
        <Warning size={22} weight="fill" aria-hidden className="shrink-0 text-gold-deep" />
        <span>{t("warning", { cm: VN_JP_BULKY.contactSumCm, kg: VN_JP_BULKY.contactKg })}</span>
      </p>
      <PolicyFigure id="vnJp" />
    </div>
  );
}

// Japan → Vietnam: Tiximax-inspired 2-column DIM layout (formula highlight card + green/amber status
// strips on the left; bulky threshold metric boxes + rounding rules + 3D parcel diagram on the
// right), followed by the 5 bulky-goods icon cards.
export function WeightJpVn() {
  const t = useTranslations("policy.weight");
  const tNote = useTranslations("pricePolicy.jpVnWeight");
  const locale = useLocale() as Locale;
  const thresholds = [
    { id: "sum", value: `> ${JP_VN_BULKY.sumCm} cm` },
    { id: "weight", value: `> ${JP_VN_BULKY.weightKg} kg` },
  ] as const;

  return (
    <div>
      <div data-reveal-group className="grid gap-5 lg:grid-cols-2 lg:items-stretch">
        <article className="info-card flex flex-col justify-between p-6 sm:p-8">
          <div>
            <h3 className="border-l-4 border-l-gold pl-3.5 text-lg font-semibold text-forest">{t("bulky.title")}</h3>
            <div className="mt-4 rounded-2xl border border-gold/40 bg-ivory px-5 py-6 text-center">
              <p className="text-xs font-semibold tracking-wider text-muted uppercase">
                {tNote("thresholds.divisor")}
              </p>
              <p className="mt-2 font-display font-(--weight-display) text-3xl text-forest tabular-nums sm:text-4xl">
                (D × R × C) <span className="text-gold-deep">÷ {formatNumber(JP_VN_BULKY.volumetricDivisor, locale)}</span>
              </p>
              <div className="mx-auto mt-4 max-w-[16rem]">
                <VolumetricDiagram />
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-3">
            <div className="flex items-start gap-3 rounded-xl border border-forest/25 bg-sage/70 p-4">
              <CheckCircle size={22} weight="fill" aria-hidden className="mt-0.5 shrink-0 text-forest" />
              <div>
                <p className="font-semibold text-forest">{t("standard.title")}</p>
                <p className="mt-0.5 text-sm text-ink">{t("standard.body")}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-gold/45 bg-gold/10 p-4">
              <Warning size={22} weight="fill" aria-hidden className="mt-0.5 shrink-0 text-gold-deep" />
              <div>
                <p className="font-semibold text-forest">{t("bulky.title")}</p>
                <p className="mt-0.5 text-sm text-ink">{t("bulky.body")}</p>
              </div>
            </div>
          </div>
        </article>

        <div className="grid content-start gap-5">
          <article className="info-card p-6 sm:p-8">
            <h3 className="border-l-4 border-l-gold pl-3.5 text-lg font-semibold text-forest">
              {tNote("examples.title")}
            </h3>
            <ul className="mt-4 grid gap-3.5 sm:grid-cols-2">
              {thresholds.map(({ id, value }) => (
                <li key={id} className="rounded-2xl border border-gold/35 bg-ivory px-5 py-5 text-center">
                  <p className="text-xs font-semibold tracking-wider text-muted uppercase">
                    {tNote(`thresholds.${id}`)}
                  </p>
                  <p className="mt-2 font-display font-(--weight-display) text-3xl text-forest tabular-nums sm:text-4xl">
                    {value}
                  </p>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-muted">{tNote("examples.note")}</p>
          </article>

          <article className="info-card p-6 sm:p-8">
            <div className="flex items-center gap-3 border-l-4 border-l-gold pl-3.5">
              <span className="icon-chip" aria-hidden>
                <ArrowsDownUp size={20} weight="duotone" />
              </span>
              <h3 className="text-lg font-semibold text-forest">{t("rounding.title")}</h3>
            </div>
            <p className="mt-3 text-muted">{t("rounding.body")}</p>
            <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-line bg-ivory px-4 py-3 text-sm text-ink">
              <Lightbulb size={20} weight="fill" aria-hidden className="mt-0.5 shrink-0 text-gold-deep" />
              <span>{tNote("note")}</span>
            </div>
          </article>
        </div>
      </div>

      <h3 className="mt-10 text-center text-xl font-semibold text-forest">{tNote("examples.title")}</h3>
      <ul data-reveal-group className="mt-5 grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-5">
        {(Object.keys(JP_VN_BULKY_EXAMPLE_ICONS) as (keyof typeof JP_VN_BULKY_EXAMPLE_ICONS)[]).map((id) => {
          const Icon = JP_VN_BULKY_EXAMPLE_ICONS[id];
          return (
            <li key={id} className="info-card flex flex-col items-center p-5 text-center">
              <span className="inline-flex size-13 items-center justify-center rounded-full border border-gold/35 bg-gold/15 text-forest" aria-hidden>
                <Icon size={26} weight="duotone" />
              </span>
              <span className="mt-3.5 font-semibold text-forest">{tNote(`examples.items.${id}`)}</span>
            </li>
          );
        })}
      </ul>

      <PolicyFigure id="jpVn" />
    </div>
  );
}

// An infographic from the price-policy PDFs, presented as a compact preview card with a lightbox
// link so it complements the HTML tables above without dominating a full screen.
export function PolicyFigure({ id }: { id: keyof typeof POLICY_FIGURES }) {
  const t = useTranslations("pricePolicy.figure");
  const locale = useLocale();
  if (locale !== "vi") return null;
  const { src, width, height } = POLICY_FIGURES[id];

  return (
    <figure
      data-reveal
      className="info-card mt-6 flex flex-col justify-between gap-5 border-forest/25 bg-sage/40 p-4 sm:flex-row sm:items-center sm:p-5"
    >
      <a
        href={src}
        target="_blank"
        rel="noopener"
        className="group relative block shrink-0 overflow-hidden rounded-lg border border-line bg-white sm:w-64"
      >
        <Image
          src={src}
          width={width}
          height={height}
          alt={t(`${id}.alt`)}
          sizes="(max-width: 639px) 100vw, 16rem"
          className="h-auto w-full object-cover transition-transform duration-300 group-hover:scale-103"
        />
      </a>
      <figcaption className="flex flex-1 flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <span className="inline-block rounded-full bg-forest/10 px-2.5 py-0.5 text-xs font-semibold text-forest">
            Infographic
          </span>
          <p className="mt-1.5 text-base font-medium text-forest">{t(`${id}.caption`)}</p>
        </div>
        <a href={src} target="_blank" rel="noopener" className="btn btn-outline shrink-0 bg-white text-sm">
          {t("open")}
        </a>
      </figcaption>
    </figure>
  );
}

// Japan → Vietnam buy-for-you rate: the formula, then its one-row table.
export function BuyRate() {
  const t = useTranslations("pricePolicy.buyRate");
  const tSection = useTranslations("pricePolicy.sections");

  return (
    <div data-reveal className="info-card">
      <p className="font-display font-(--weight-display) text-2xl text-forest sm:text-3xl">{t("formula")}</p>
      <div tabIndex={0} role="group" aria-label={tSection("buyRate")} className="rate-table-wrap mt-6">
        <table className="rate-table">
          <thead>
            <tr>
              <th scope="col">{t("columns.value")}</th>
              <th scope="col">{t("columns.rate")}</th>
              <th scope="col">{t("columns.surcharge")}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">{t("row.value")}</th>
              <td className="font-semibold whitespace-nowrap text-forest">{t("row.rate")}</td>
              <td>
                <span className="inline-flex items-center gap-2">
                  <CheckCircle size={20} weight="fill" aria-hidden className="shrink-0 text-forest" />
                  {t("row.surcharge")}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

type Route = "vnJp" | "jpVn";
type CostId = "freight" | "parcelFee" | "goods" | "category" | "bulky" | "insurance";
type FactorId = "goodsType" | "buyRate" | "size" | "rounding" | "packing";

// What adds up to an order's total, per direction, in this order (the PDFs' own items).
const COST_ITEMS: Record<Route, { id: CostId; Icon: typeof Package }[]> = {
  vnJp: [
    { id: "freight", Icon: AirplaneTilt },
    { id: "parcelFee", Icon: Package },
    { id: "category", Icon: BatteryCharging },
    { id: "bulky", Icon: Cube },
    { id: "insurance", Icon: ShieldCheck },
  ],
  jpVn: [
    { id: "goods", Icon: CurrencyJpy },
    { id: "freight", Icon: AirplaneTilt },
    { id: "category", Icon: BatteryCharging },
    { id: "insurance", Icon: ShieldCheck },
  ],
};

// What changes the cost, each card linking to the section of the page that explains it; the link
// line names that section (its H2, `heading`).
type Factor = { id: FactorId; section: string; heading: string };
const COST_FACTORS: Record<Route, Factor[]> = {
  vnJp: [
    { id: "goodsType", section: "ratesVnJp", heading: "pricePolicy.sections.goodsRates" },
    { id: "size", section: "weightVnJp", heading: "pricePolicy.sections.weightVnJp" },
    { id: "rounding", section: "weightVnJp", heading: "pricePolicy.sections.weightVnJp" },
    { id: "packing", section: "surcharges", heading: "pricing.surcharge.title" },
  ],
  jpVn: [
    { id: "buyRate", section: "buyRate", heading: "pricePolicy.sections.buyRate" },
    { id: "size", section: "weightJpVn", heading: "pricePolicy.sections.weightJpVn" },
    { id: "rounding", section: "weightJpVn", heading: "pricePolicy.sections.weightJpVn" },
    { id: "packing", section: "surcharges", heading: "pricing.surcharge.title" },
  ],
};

const FACTOR_ICONS: Record<FactorId, typeof Package> = {
  goodsType: Package,
  buyRate: CurrencyJpy,
  size: Cube,
  rounding: Scales,
  packing: ShieldCheck,
};

// "What does it cost in total?": Tiximax-inspired container card with "+" equation cards, a bottom
// formula summary banner, and a 2x2 grid of horizontal factor cards.
export function CostBreakdown({ route }: { route: Route }) {
  const t = useTranslations("pricePolicy.cost");
  const tAll = useTranslations();
  const locale = useLocale() as Locale;
  const items = COST_ITEMS[route];
  const firstTier = VN_JP_CLEAN[0];
  const params: Record<CostId, Record<string, string | number>> = {
    freight: { price: formatVnd(JP_VN[0].vndPerKg ?? 0, locale) },
    parcelFee: { kg: `${firstTier.minKg} – ${firstTier.maxKg}`, fee: formatVnd(firstTier.perParcelFee ?? 0, locale) },
    goods: {},
    category: {},
    bulky: { min: formatVnd(VN_JP_BULKY.surchargeVnd[0], locale), max: formatVnd(VN_JP_BULKY.surchargeVnd[1], locale) },
    insurance: { pct: COMPENSATION.insuranceRatePct },
  };
  // Freight and some factors have a text per direction (`<id>.<route>`); the others one `body`.
  const costText = (id: CostId) => (id === "freight" ? t(`items.freight.${route}`, params.freight) : t(`items.${id}.body`, params[id]));
  const factors = rawRecord<Record<string, string>>(t, "factors");

  return (
    <div className="grid gap-6">
      <div className="info-card p-6 sm:p-8">
        <ol
          data-reveal-group
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[repeat(var(--n),minmax(0,1fr))]"
          style={{ "--n": items.length } as CSSProperties}
        >
          {items.map(({ id, Icon }, index) => (
            <li key={id} className="relative flex flex-col items-center rounded-2xl border border-line bg-ivory/60 p-5 text-center">
              {index > 0 && (
                <span
                  aria-hidden
                  className="absolute top-1/2 -left-2 z-10 hidden size-7 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-line bg-white font-semibold text-forest shadow-2xs lg:grid"
                >
                  +
                </span>
              )}
              <span className="inline-flex size-12 items-center justify-center rounded-full bg-sage text-forest" aria-hidden>
                <Icon size={24} weight="duotone" />
              </span>
              <h3 className="mt-3.5 text-base font-semibold text-forest">{t(`items.${id}.title`)}</h3>
              <p className="mt-1.5 text-sm text-muted">{costText(id)}</p>
            </li>
          ))}
        </ol>

        <div
          data-reveal
          className="mt-6 flex flex-col justify-between gap-4 rounded-2xl border border-gold/40 bg-ivory px-5 py-4 lg:flex-row lg:items-center"
        >
          <div className="flex items-start gap-3.5">
            <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-gold/25 font-display text-lg font-bold text-forest" aria-hidden>
              Σ
            </span>
            <div>
              <p className="font-semibold text-forest">{t("total.body")}</p>
              <p className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm text-muted">
                {items.map(({ id }, index) => (
                  <span key={id} className="inline-flex items-center gap-1.5">
                    {index > 0 && <span aria-hidden className="font-semibold text-gold-deep">+</span>}
                    <span>{t(`items.${id}.title`)}</span>
                  </span>
                ))}
              </p>
            </div>
          </div>
          <span className="self-start rounded-xl bg-gold/25 px-4 py-2 text-xs font-bold tracking-wider text-forest uppercase whitespace-nowrap lg:self-center">
            = {t("total.title")}
          </span>
        </div>

        {route === "jpVn" && (
          <div data-reveal className="callout mt-4">
            <Info size={22} weight="fill" aria-hidden className="shrink-0 text-forest" />
            <p>
              <strong className="font-semibold text-forest">{t("outside.title")}: </strong>
              {t("outside.items.domestic")}
            </p>
          </div>
        )}
      </div>

      <div className="info-card p-6 sm:p-8">
        <h3 className="border-l-4 border-l-gold pl-3.5 text-xl font-semibold text-forest">{t("factors.title")}</h3>
        <ul data-reveal-group className="mt-5 grid gap-4 md:grid-cols-2">
          {COST_FACTORS[route].map(({ id, section, heading }) => {
            const factor = factors[id];
            const Icon = FACTOR_ICONS[id];
            return (
              <li key={id}>
                <Link
                  href={`#${anchorOf(section)}`}
                  className="group flex h-full items-start gap-4 rounded-2xl border border-line bg-ivory/50 p-5 transition-colors hover:border-forest/40 hover:bg-sage/40"
                >
                  <span
                    className="inline-flex size-12 shrink-0 items-center justify-center rounded-full border border-gold/35 bg-gold/15 text-forest"
                    aria-hidden
                  >
                    <Icon size={22} weight="duotone" />
                  </span>
                  <div className="flex flex-1 flex-col">
                    <span className="font-semibold text-forest">{factor.title}</span>
                    <span className="mt-1 flex-1 text-sm text-muted">{factor[route] ?? factor.body}</span>
                    <span className="link-arrow mt-3 self-start text-xs font-semibold text-forest">
                      {tAll(heading as Parameters<typeof tAll>[0])}
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
