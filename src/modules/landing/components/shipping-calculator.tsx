"use client";

import { AirplaneTilt, CheckCircle, Package, Warning } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useId, useState } from "react";
import type { Locale } from "@/shared/constants/locales";
import { formatVnd, NUMBER_LOCALE } from "@/shared/lib/format";
import { pagePath } from "@/shared/seo/pages";
import { VN_JP_BULKY } from "../pricing-data";
import { type Dimensions, type GoodsKind, quote, type Route } from "../shipping-quote";

const ROUTES: Route[] = ["vnJp", "jpVn"];
const RULES_ANCHOR: Record<Route, string> = { vnJp: "weight-vn-jp", jpVn: "weight-jp-vn" };
const GOODS: GoodsKind[] = ["clean", "mixed"];
const DIMS = ["length", "width", "height"] as const;
const QUICK_WEIGHTS = [1, 2, 5, 10, 20];

const INCLUDED_LABEL: Record<Locale, string> = {
  vi: "Đã gồm giao nội địa Nhật",
  en: "Includes Japan delivery",
  ja: "日本国内配送込み",
};

const FLAT_RATE_LABEL: Record<Locale, string> = {
  vi: "Đồng giá mọi cân nặng",
  en: "Flat rate for all weights",
  ja: "全重量一律料金",
};

// Positive number from a text field (accepts "3,5" as well as "3.5"); anything else → null.
function parse(value: string): number | null {
  const n = Number(value.trim().replace(",", "."));
  return value.trim() && Number.isFinite(n) && n > 0 ? n : null;
}

export function ShippingCalculator({
  withTitle = true,
  route: initialRoute = "vnJp",
  lockRoute = false,
}: {
  withTitle?: boolean;
  route?: Route;
  lockRoute?: boolean;
}) {
  const t = useTranslations("pricing.calculator");
  const tTeaser = useTranslations("pricing.teaser");
  const tVnJp = useTranslations("pricing.vnJp");
  const locale = useLocale() as Locale;
  const id = useId();

  const [route, setRoute] = useState<Route>(initialRoute);
  const [goods, setGoods] = useState<GoodsKind>("clean");
  const [weight, setWeight] = useState("");
  const [dims, setDims] = useState<Record<(typeof DIMS)[number], string>>({ length: "", width: "", height: "" });

  const nf = new Intl.NumberFormat(NUMBER_LOCALE[locale], { maximumFractionDigits: 1 });
  const vnd = (n: number) => nf.format(n);

  const kg = parse(weight);
  const [l, w, h] = DIMS.map((d) => parse(dims[d]));
  const size: Dimensions | undefined = l && w && h ? { lengthCm: l, widthCm: w, heightCm: h } : undefined;
  const result = kg ? quote(route, route === "vnJp" ? goods : "clean", kg, size) : null;

  const volumetricKg = l && w && h ? (l * w * h) / 6000 : null;
  const sumDims = l && w && h ? l + w + h : null;

  return (
    <form
      id={withTitle ? "calculator" : undefined}
      className="calc"
      onSubmit={(event) => event.preventDefault()}
      {...(withTitle ? { "aria-labelledby": `${id}-title` } : { "aria-label": t("title") })}
    >
      {/* Header bar */}
      <div className="calc__head">
        {withTitle && (
          <h3 id={`${id}-title`} className="text-xl font-semibold text-forest mb-3.5">
            {t("title")}
          </h3>
        )}

        {/* Route Selector */}
        {lockRoute ? (
          <div className="inline-flex items-center gap-2 rounded-full bg-sage px-4 py-2 text-sm font-semibold text-forest border border-line">
            <AirplaneTilt size={16} weight="fill" className="text-forest" />
            <span>{t("routeFixed", { route: tTeaser(`${route}.label`) })}</span>
          </div>
        ) : (
          <div className="relative grid grid-cols-2 p-1 bg-white rounded-full border border-line">
            <div
              aria-hidden
              className={`absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-full bg-forest shadow-xs transition-transform duration-300 ease-out motion-reduce:transition-none pointer-events-none ${
                route === "jpVn" ? "translate-x-full" : "translate-x-0"
              }`}
            />
            {ROUTES.map((r) => {
              const active = route === r;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRoute(r)}
                  className={`relative z-10 flex items-center justify-center gap-2 py-2 px-3 rounded-full text-sm font-semibold transition-colors duration-200 ${
                    active
                      ? "text-white"
                      : "text-forest hover:text-forest/80"
                  }`}
                >
                  <AirplaneTilt
                    size={16}
                    weight={active ? "fill" : "regular"}
                    className={`transition-colors duration-200 ${active ? "text-white" : "text-forest"}`}
                  />
                  <span className="truncate">{tTeaser(`${r}.label`)}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="calc__body">
        {/* Left column: Inputs */}
        <div className="calc__fields">
          {/* Goods Type selector (VN -> JP only) */}
          {route === "vnJp" && (
            <div>
              <span className="field-label">{t("goodsLegend")}</span>
              <div
                className="relative grid grid-cols-2 rounded-full border border-line bg-white p-1"
                role="group"
                aria-label={t("goodsLegend")}
              >
                <div
                  aria-hidden
                  className={`pointer-events-none absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-full bg-forest shadow-xs transition-transform duration-300 ease-out motion-reduce:transition-none ${
                    goods === "mixed" ? "translate-x-full" : "translate-x-0"
                  }`}
                />
                {GOODS.map((g) => {
                  const active = goods === g;
                  return (
                    <button
                      key={g}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setGoods(g)}
                      className={`relative z-10 flex min-h-9 items-center justify-center rounded-full px-3 py-1.5 text-sm font-semibold transition-colors duration-200 ${
                        active ? "text-white" : "text-forest hover:text-forest/80"
                      }`}
                    >
                      {tVnJp(`${g}.title`)}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Weight Input */}
          <div>
            <label htmlFor={`${id}-weight`} className="field-label">
              {t("weight")}
            </label>

            <div className="relative flex items-center">
              <input
                id={`${id}-weight`}
                inputMode="decimal"
                autoComplete="off"
                placeholder="0"
                value={weight}
                onChange={(event) => setWeight(event.target.value)}
                className="field pr-12 text-lg font-semibold tabular-nums"
              />
              <span className="pointer-events-none absolute right-3.5 text-sm font-semibold text-muted">
                kg
              </span>
            </div>

            {/* Quick Weight Chips */}
            <div className="mt-2 flex flex-wrap gap-1.5">
              {QUICK_WEIGHTS.map((q) => {
                const active = kg === q;
                return (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setWeight(String(q))}
                    className={`rounded-md px-2.5 py-1 text-xs font-semibold tabular-nums transition-colors ${
                      active
                        ? "bg-forest text-white"
                        : "bg-sage text-forest hover:bg-forest/15"
                    }`}
                  >
                    {q} kg
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dimensions Input (Optional, flat on the pane — no nested box) */}
          <div>
            <span className="field-label">{t("dimsLegend")}</span>
            <div className="grid grid-cols-3 gap-2">
              {DIMS.map((d) => (
                <div key={d} className="relative">
                  <input
                    id={`${id}-${d}`}
                    aria-label={t(d)}
                    placeholder={t(d)}
                    inputMode="decimal"
                    autoComplete="off"
                    value={dims[d]}
                    onChange={(event) => setDims((prev) => ({ ...prev, [d]: event.target.value }))}
                    className="field h-11 pl-3 pr-8 text-sm font-medium tabular-nums"
                  />
                  <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted">
                    cm
                  </span>
                </div>
              ))}
            </div>

            {l && w && h && (
              <p className="mt-2 text-xs text-muted tabular-nums">
                {route === "jpVn" ? (
                  <>
                    {t("volumetric")}: <strong className="text-forest">{volumetricKg?.toFixed(1)} kg</strong>
                  </>
                ) : (
                  <>
                    {l} + {w} + {h} = <strong className="text-forest">{sumDims} cm</strong>
                  </>
                )}
              </p>
            )}
          </div>
        </div>

        {/* Right column: Live Receipt / Result */}
        <div className="calc__result justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-line">
              <span className="text-sm font-semibold text-forest">
                {t("resultTitle")}
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-muted">
                <CheckCircle size={14} weight="fill" className="text-forest" aria-hidden />
                {route === "vnJp" ? INCLUDED_LABEL[locale] : FLAT_RATE_LABEL[locale]}
              </span>
            </div>

            <div role="status" className="py-5">
              {!result ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Package size={28} weight="duotone" className="text-forest/35 mb-2" aria-hidden />
                  <p className="text-sm font-medium text-muted">
                    {t("empty")}
                  </p>
                </div>
              ) : result.status === "priced" ? (
                <div>
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-sm font-medium text-muted">
                      {t("total")}
                    </span>
                    <p className="font-display font-(--weight-display) text-3xl sm:text-4xl text-forest tabular-nums">
                      {vnd(result.total)} <span className="text-base font-semibold">VNĐ</span>
                    </p>
                  </div>

                  <dl className="calc__rows mt-4 text-sm">
                    <div>
                      <dt>{t("billable")}</dt>
                      <dd>
                        {t("kg", { kg: nf.format(result.billableKg) })}
                        {route === "jpVn" && result.volumetric && (
                          <span className="ml-1 text-xs font-normal text-muted">({t("volumetric")})</span>
                        )}
                      </dd>
                    </div>
                    <div>
                      <dt>{t("rate")}</dt>
                      <dd>{t("perKg", { price: vnd(result.vndPerKg) })}</dd>
                    </div>
                    {result.parcelFee > 0 && (
                      <div>
                        <dt>{t("parcelFee")}</dt>
                        <dd>{t("vnd", { price: vnd(result.parcelFee) })}</dd>
                      </div>
                    )}
                  </dl>
                </div>
              ) : (
                <div className="rounded-lg border border-gold/40 bg-gold/15 p-3.5 text-sm font-medium text-forest">
                  {t(result.status)}
                </div>
              )}
            </div>

            {/* Bulky alert (only shown when dimensions actually trigger bulky threshold) */}
            {result?.bulky && (
              <div role="status" className="mb-1 border-t border-line pt-3">
                <div className="flex gap-2 rounded-lg border border-amber-300 bg-amber-50/80 p-3 text-xs text-ink leading-relaxed">
                  <Warning size={16} weight="fill" aria-hidden className="mt-0.5 shrink-0 text-amber-700" />
                  <span>
                    {t(`bulky.${result.bulky}`, {
                      min: formatVnd(VN_JP_BULKY.surchargeVnd[0], locale),
                      max: formatVnd(VN_JP_BULKY.surchargeVnd[1], locale),
                      cm: result.bulky === "review" ? VN_JP_BULKY.anySideCm : VN_JP_BULKY.contactSumCm,
                      kg: VN_JP_BULKY.contactKg,
                    })}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
            <Link
              href={`${pagePath(locale, "policy")}#${RULES_ANCHOR[route]}`}
              className="link-arrow min-h-0 text-sm text-forest"
            >
              {t("rulesLink")}
            </Link>
            <a
              href="#contact"
              data-track="cta_calculator_quote"
              data-route={route}
              className="btn btn-gold text-sm px-5 py-2.5"
            >
              {t("quoteCta")}
            </a>
          </div>
        </div>
      </div>
    </form>
  );
}
