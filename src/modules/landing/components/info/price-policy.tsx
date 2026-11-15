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
import { POLICY_FIGURES, PRICING_IMAGES } from "@/shared/seo/page-media";
import { type PageKey, pagePath } from "@/shared/seo/pages";
import { anchorOf, JP_VN_BULKY_EXAMPLE_ICONS, type Tone, VN_JP_BULKY_CASES } from "../../info-pages";
import {
  COMPENSATION,
  JP_VN,
  JP_VN_BULKY,
  priceRange,
  VN_JP_BULKY,
  VN_JP_CLEAN,
  VN_JP_MIXED,
  VN_JP_SIZE_STANDARD,
} from "../../pricing-data";
import { VolumetricDiagram } from "../volumetric-diagram";

// Bodies of the price-policy sections (the InfoPage frame adds the anchor, background and H2):
// the weight rules of each direction (they differ: VN→JP has a size standard by weight and a
// bulky surcharge, JP→VN charges the volumetric weight), the buy-for-you rate, the route cards of
// the /bang-gia hub, the cost breakdown and the PDF infographics. Every number comes from
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
        <article className="info-card">
          <h3 className="text-lg font-medium text-forest">{t("sizeTitle")}</h3>
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

          <h3 className="mt-8 text-lg font-medium text-forest">{t("casesTitle")}</h3>
          <ul className="mt-4 grid gap-3">
            {(Object.keys(VN_JP_BULKY_CASES) as (keyof typeof VN_JP_BULKY_CASES)[]).map((id) => {
              const { Icon, tone } = VN_JP_BULKY_CASES[id];
              return (
                <li key={id} className="flex gap-3">
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

          <article className="info-card">
            <span className="icon-chip" aria-hidden>
              <ArrowsDownUp size={22} weight="duotone" />
            </span>
            <h3 className="mt-4 text-lg font-medium text-forest">{t("roundingTitle")}</h3>
            <p className="mt-1.5 text-muted">{t("roundingBody")}</p>
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

// Japan → Vietnam: the three bulky thresholds (JP_VN_BULKY), actual vs. volumetric weight, the
// rounding rule, bulky goods with the diagram (`policy.weight`), the PDF's five bulky examples, the
// PDF's note on why, then its infographic (vi only).
export function WeightJpVn() {
  const t = useTranslations("policy.weight");
  const tNote = useTranslations("pricePolicy.jpVnWeight");
  const locale = useLocale() as Locale;
  const thresholds = [
    { id: "sum", value: `> ${JP_VN_BULKY.sumCm} cm` },
    { id: "weight", value: `> ${JP_VN_BULKY.weightKg} kg` },
    { id: "divisor", value: `÷ ${formatNumber(JP_VN_BULKY.volumetricDivisor, locale)}` },
  ] as const;

  return (
    <div>
      <ul data-reveal-group className="grid gap-4 sm:grid-cols-3">
        {thresholds.map(({ id, value }) => (
          <li key={id} className="stat-card">
            <p className="stat-card__value text-4xl whitespace-nowrap tabular-nums sm:text-3xl lg:text-5xl">{value}</p>
            <p className="stat-card__label">{tNote(`thresholds.${id}`)}</p>
          </li>
        ))}
      </ul>

      <div data-reveal-group className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
        <div className="grid gap-5">
          {([
            ["standard", Scales],
            ["rounding", ArrowsDownUp],
          ] as const).map(([key, Icon]) => (
            <article key={key} className="info-card">
              <span className="icon-chip" aria-hidden>
                <Icon size={22} weight="duotone" />
              </span>
              <h3 className="mt-4 text-lg font-medium text-forest">{t(`${key}.title`)}</h3>
              <p className="mt-1.5 text-muted">{t(`${key}.body`)}</p>
            </article>
          ))}
        </div>
        <article className="info-card grid items-center gap-6 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <div>
            <span className="icon-chip" aria-hidden>
              <Cube size={22} weight="duotone" />
            </span>
            <h3 className="mt-4 text-lg font-medium text-forest">{t("bulky.title")}</h3>
            <p className="mt-1.5 text-muted">{t("bulky.body")}</p>
          </div>
          <VolumetricDiagram />
        </article>
      </div>

      <h3 className="mt-10 text-lg font-medium text-forest">{tNote("examples.title")}</h3>
      <ul data-reveal-group className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {(Object.keys(JP_VN_BULKY_EXAMPLE_ICONS) as (keyof typeof JP_VN_BULKY_EXAMPLE_ICONS)[]).map((id) => {
          const Icon = JP_VN_BULKY_EXAMPLE_ICONS[id];
          return (
            <li key={id} className="info-card flex flex-col items-center text-center">
              <span className="icon-chip icon-chip--lg" aria-hidden>
                <Icon size={28} weight="duotone" />
              </span>
              <span className="mt-3 font-medium text-forest">{tNote(`examples.items.${id}`)}</span>
            </li>
          );
        })}
      </ul>
      <p className="mt-3 text-sm text-muted">{tNote("examples.note")}</p>

      <p data-reveal className="callout mt-6 bg-white">
        <Lightbulb size={22} weight="fill" aria-hidden className="shrink-0 text-gold-deep" />
        <span>{tNote("note")}</span>
      </p>
      <PolicyFigure id="jpVn" />
    </div>
  );
}

// An infographic from the price-policy PDFs. Its text is Vietnamese and baked into the image, so
// it shows in `vi` only; the other locales have the same content as HTML above it.
export function PolicyFigure({ id }: { id: keyof typeof POLICY_FIGURES }) {
  const t = useTranslations("pricePolicy.figure");
  const locale = useLocale();
  if (locale !== "vi") return null;
  const { src, width, height } = POLICY_FIGURES[id];

  return (
    <figure data-reveal className="info-card mt-8 overflow-hidden p-0">
      <Image src={src} width={width} height={height} alt={t(`${id}.alt`)} sizes="(max-width: 1023px) 100vw, 64rem" className="h-auto w-full" />
      <figcaption className="flex flex-wrap items-center justify-between gap-3 border-t border-line p-4 text-sm text-muted">
        <span>{t(`${id}.caption`)}</span>
        <a href={src} target="_blank" rel="noopener" className="link-arrow text-forest">
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

const ROUTE_CARDS: { key: "vnJp" | "jpVn"; page: PageKey }[] = [
  { key: "vnJp", page: "priceVnJp" },
  { key: "jpVn", page: "priceJpVn" },
];

// The /bang-gia hub: one card per route (the teaser-card of the home pricing block) with its rates
// as numbers and three points, linking to that route's price-policy page.
export function RouteCards() {
  const t = useTranslations("pricePolicy.routes");
  const tPricing = useTranslations("pricing");
  const tPrice = useTranslations("service.price");
  const locale = useLocale() as Locale;
  const unit = tPrice("unit");

  return (
    <div data-reveal-group className="grid gap-5 sm:grid-cols-2">
      {ROUTE_CARDS.map(({ key, page }) => (
        <Link key={key} href={pagePath(locale, page)} data-track={`cta_price_policy_${key}`} className="teaser-card group">
          <div className="teaser-card__media aspect-[21/9]">
            <Image src={PRICING_IMAGES[key]} alt="" fill sizes="(max-width: 639px) 100vw, 50vw" className="object-cover object-[75%_50%]" />
            <span className="teaser-card__label">{tPricing(`teaser.${key}.label`)}</span>
          </div>
          <div className="flex flex-1 flex-col p-6">
            {key === "vnJp" ? (
              <ul className="grid gap-2">
                {([
                  ["clean", VN_JP_CLEAN],
                  ["mixed", VN_JP_MIXED],
                ] as const).map(([kind, tiers]) => {
                  const [min, max] = priceRange(tiers);
                  return (
                    <li key={kind}>
                      <span className="text-muted">{tPricing(`vnJp.${kind}.title`)}:</span>{" "}
                      <span className="font-semibold whitespace-nowrap text-forest tabular-nums">
                        {formatVnd(min, locale)} – {formatVnd(max, locale)} {unit}
                      </span>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="font-display font-(--weight-display) text-3xl text-forest tabular-nums">
                {formatVnd(JP_VN[0].vndPerKg ?? 0, locale)} <span className="text-base">{unit}</span>
              </p>
            )}
            <ul className="mt-5 grid gap-2.5 border-t border-line pt-5">
              {Object.entries(rawRecord<string>(t, `${key}.points`)).map(([id, point]) => (
                <li key={id} className="flex gap-2.5">
                  <CheckCircle size={20} weight="fill" aria-hidden className="mt-0.5 shrink-0 text-forest" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
            <span className="link-arrow mt-auto pt-5 text-forest">{t(`${key}.cta`)}</span>
          </div>
        </Link>
      ))}
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

// "What does it cost in total?": the items that add up (a "+" between cards), the total, what is
// not in it (JP→VN: domestic delivery, VAT), then the factors that change the cost.
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
    <div>
      <ol
        data-reveal-group
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[repeat(var(--n),minmax(0,1fr))]"
        style={{ "--n": items.length } as CSSProperties}
      >
        {items.map(({ id, Icon }, index) => (
          <li key={id} className="info-card relative">
            {index > 0 && (
              <span aria-hidden className="absolute -top-4 -left-3 font-display text-3xl text-gold">
                +
              </span>
            )}
            <span className="icon-chip" aria-hidden>
              <Icon size={22} weight="duotone" />
            </span>
            <h3 className="mt-4 text-lg font-medium text-forest">{t(`items.${id}.title`)}</h3>
            <p className="mt-1.5 text-muted">{costText(id)}</p>
          </li>
        ))}
      </ol>

      <div data-reveal className="stat-card stat-card--featured mt-4">
        <h3 className="text-lg font-medium">{t("total.title")}</h3>
        <p className="stat-card__body">{t("total.body")}</p>
      </div>

      {route === "jpVn" && (
        <div data-reveal className="callout mt-4">
          <Info size={22} weight="fill" aria-hidden className="shrink-0 text-forest" />
          <div>
            <strong className="font-semibold text-forest">{t("outside.title")}</strong>
            <ul className="mt-1 grid gap-1">
              <li>{t("outside.items.domestic")}</li>
              <li>{t("outside.items.vat")}</li>
            </ul>
          </div>
        </div>
      )}

      <h3 className="mt-10 text-lg font-medium text-forest">{t("factors.title")}</h3>
      <ul data-reveal-group className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {COST_FACTORS[route].map(({ id, section, heading }) => {
          const factor = factors[id];
          return (
            <li key={id}>
              <Link href={`#${anchorOf(section)}`} className="info-card group flex h-full flex-col">
                <span className="font-medium text-forest">{factor.title}</span>
                <span className="mt-1.5 flex-1 text-sm text-muted">{factor[route] ?? factor.body}</span>
                <span className="link-arrow mt-3 self-start text-sm text-forest">
                  {tAll(heading as Parameters<typeof tAll>[0])}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
