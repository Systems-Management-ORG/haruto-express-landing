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
const QUICK_WEIGHTS = [1, 2, 5, 10, 20, 30];

const INCLUDED_LABEL: Record<Locale, string> = {
  vi: "Đã gồm cước bay & giao tận nhà tại Nhật",
  en: "Includes air freight & Japan domestic delivery",
  ja: "日本国内配送込み（追加料金なし）",
};

const FLAT_RATE_LABEL: Record<Locale, string> = {
  vi: "Đồng giá 155.000 VNĐ/kg mọi cân nặng",
  en: "Flat rate 155,000 VND/kg for all weights",
  ja: "全重量一律 155,000 VND/kg",
};

const QUICK_SELECT_LABEL: Record<Locale, string> = {
  vi: "Chọn nhanh:",
  en: "Quick select:",
  ja: "クイック選択:",
};

const RESET_LABEL: Record<Locale, string> = {
  vi: "Đặt lại",
  en: "Reset",
  ja: "リセット",
};

const DOMESTIC_LABEL: Record<Locale, string> = {
  vi: "Giao nội địa Nhật",
  en: "Japan domestic delivery",
  ja: "日本国内配送",
};

const INCLUDED_TEXT: Record<Locale, string> = {
  vi: "Đã bao gồm",
  en: "Included",
  ja: "込み",
};

const GOODS_HINTS: Record<GoodsKind, Record<Locale, string>> = {
  clean: {
    vi: "Quần áo, đồ dùng, nội thất, máy móc...",
    en: "Clothing, household goods, books...",
    ja: "衣類、日用品、家具、雑貨など",
  },
  mixed: {
    vi: "Thực phẩm, bánh kẹo, mỹ phẩm...",
    en: "Food, cosmetics, footwear...",
    ja: "食品、化粧品、履物など",
  },
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
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            {withTitle ? (
              <h3 id={`${id}-title`} className="text-xl font-semibold text-forest flex items-center gap-2">
                {t("title")}
              </h3>
            ) : (
              <p className="text-xl font-semibold text-forest">{t("title")}</p>
            )}
            <p className="mt-1 text-sm text-ink/80">{t("intro")}</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-forest/8 px-3 py-1 text-xs font-semibold text-forest">
            <span className="size-1.5 rounded-full bg-forest" />
            HARUTO Rate 2026
          </span>
        </div>

        {/* Route Selector */}
        <div className="mt-4">
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
      </div>

      <div className="calc__body">
        {/* Left column: Inputs */}
        <div className="calc__fields">
          {/* Goods Type selector (VN -> JP only) */}
          {route === "vnJp" && (
            <div>
              <span className="field-label">{t("goodsLegend")}</span>
              <div className="grid grid-cols-2 gap-2.5">
                {GOODS.map((g) => {
                  const active = goods === g;
                  return (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGoods(g)}
                      className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
                        active
                          ? "border-forest bg-forest/5 text-forest ring-1 ring-forest/20"
                          : "border-line bg-white hover:border-forest/40 text-muted"
                      }`}
                    >
                      <span className="flex items-center gap-1.5 text-sm font-semibold">
                        <span className={`size-2 rounded-full ${active ? "bg-forest" : "bg-muted/40"}`} />
                        {tVnJp(`${g}.title`)}
                      </span>
                      <span className="mt-1 text-xs text-muted/80 leading-snug">
                        {GOODS_HINTS[g][locale]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Weight Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor={`${id}-weight`} className="field-label mb-0">
                {t("weight")}
              </label>
              {weight && parse(weight) && (
                <button
                  type="button"
                  onClick={() => setWeight("")}
                  className="text-xs text-muted hover:text-forest underline"
                >
                  {RESET_LABEL[locale]}
                </button>
              )}
            </div>

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
              <span className="pointer-events-none absolute right-3.5 text-sm font-bold text-muted">
                kg
              </span>
            </div>

            {/* Quick Weight Chips */}
            <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-muted mr-1">{QUICK_SELECT_LABEL[locale]}</span>
              {QUICK_WEIGHTS.map((q) => {
                const active = parse(weight) === q;
                return (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setWeight(String(q))}
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                      active
                        ? "bg-forest text-white shadow-xs"
                        : "bg-sage/80 text-forest/85 hover:bg-forest/10 hover:text-forest"
                    }`}
                  >
                    {q} kg
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dimensions Input (Optional) */}
          <div className="rounded-xl border border-line/80 bg-sage/20 p-3.5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-forest">
                {t("dimsLegend")}
              </span>
            </div>

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
                    className="field text-left pl-3 pr-8 font-medium tabular-nums h-10 text-sm"
                  />
                  <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-medium text-muted/60">
                    cm
                  </span>
                </div>
              ))}
            </div>

            {/* Live Dimension Calculation Feedback */}
            {l && w && h && (
              <div className="mt-2.5 text-xs text-forest/90 bg-white/90 rounded-lg p-2.5 border border-line/60">
                {route === "jpVn" ? (
                  <span>
                    Cân thể tích: <strong>{volumetricKg?.toFixed(1)} kg</strong>
                    {volumetricKg && volumetricKg > (kg || 0) && (
                      <span className="text-amber-800 ml-1 font-medium">(lớn hơn cân thực tế → áp dụng tính cước)</span>
                    )}
                  </span>
                ) : (
                  <span>
                    Tổng 3 chiều: <strong>{sumDims} cm</strong>
                    {Math.max(l, w, h) >= 100 && (
                      <span className="text-amber-800 ml-1 font-medium">(cạnh ≥ 100 cm → có thể phụ thu cồng kềnh)</span>
                    )}
                  </span>
                )}
              </div>
            )}

            <p className="mt-2 text-xs leading-relaxed text-muted">
              {t(`dimsHint.${route}`)}
            </p>
          </div>
        </div>

        {/* Right column: Live Receipt / Result */}
        <div className="calc__result flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3.5 border-b border-line">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-muted">
                  {t("resultTitle")}
                </span>
                <p className="text-sm font-semibold text-forest mt-0.5">
                  {tTeaser(`${route}.label`)}
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-forest/10 px-2.5 py-0.5 text-xs font-medium text-forest">
                <span className="size-1.5 rounded-full bg-forest" />
                {route === "vnJp" ? "Bay thẳng 3–5 ngày" : "Air Express"}
              </span>
            </div>

            <div role="status" className="py-4">
              {!result ? (
                <div className="text-center py-6 px-4 rounded-xl border border-dashed border-line bg-white/50">
                  <Package size={32} weight="duotone" className="mx-auto text-forest/40 mb-2" />
                  <p className="text-sm font-medium text-forest/80">
                    {t("empty")}
                  </p>
                  <p className="text-xs text-muted mt-1">
                    Chọn mốc cân nhanh hoặc nhập số kg ở bên trái để xem chi tiết cước.
                  </p>
                </div>
              ) : result.status === "priced" ? (
                <div>
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                      {t("total")}
                    </span>
                    <div className="text-right">
                      <span className="font-display font-(--weight-display) text-3xl sm:text-4xl text-forest tabular-nums">
                        {vnd(result.total)}
                      </span>
                      <span className="ml-1 text-base font-bold text-forest">VNĐ</span>
                    </div>
                  </div>

                  {/* Reassurance badge */}
                  <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-forest/8 px-3 py-1.5 text-xs font-medium text-forest">
                    <CheckCircle size={16} weight="fill" className="shrink-0 text-forest" />
                    <span>
                      {route === "vnJp" ? INCLUDED_LABEL[locale] : FLAT_RATE_LABEL[locale]}
                    </span>
                  </div>

                  {/* Itemized lines */}
                  <dl className="calc__rows mt-4 text-sm">
                    <div>
                      <dt className="text-muted">{t("billable")}</dt>
                      <dd className="font-semibold text-forest">
                        {t("kg", { kg: nf.format(result.billableKg) })}
                        {route === "jpVn" && result.volumetric && (
                          <span className="ml-1 text-xs font-normal text-amber-800">({t("volumetric")})</span>
                        )}
                        {route === "vnJp" && result.billableKg !== kg && (
                          <span className="ml-1 text-xs font-normal text-muted">(làm tròn 0.5 kg)</span>
                        )}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-muted">{t("rate")}</dt>
                      <dd className="font-semibold text-forest">
                        {t("perKg", { price: vnd(result.vndPerKg) })}
                      </dd>
                    </div>
                    {result.parcelFee > 0 && (
                      <div>
                        <dt className="text-muted">{t("parcelFee")}</dt>
                        <dd className="font-semibold text-forest">
                          {t("vnd", { price: vnd(result.parcelFee) })}
                        </dd>
                      </div>
                    )}
                    {route === "vnJp" && (
                      <div>
                        <dt className="text-muted">{DOMESTIC_LABEL[locale]}</dt>
                        <dd className="font-semibold text-forest">
                          {INCLUDED_TEXT[locale]}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
              ) : (
                <div className="rounded-xl border border-gold/40 bg-gold/15 p-4 text-base font-medium text-forest">
                  {t(result.status)}
                </div>
              )}
            </div>

            {/* Bulky alert */}
            {result?.bulky && (
              <div role="status" className="mb-4 flex gap-2.5 rounded-xl border border-amber-300 bg-amber-50/80 p-3 text-xs text-ink leading-relaxed">
                <Warning size={18} weight="fill" aria-hidden className="mt-0.5 shrink-0 text-amber-700" />
                <span>
                  {t(`bulky.${result.bulky}`, {
                    min: formatVnd(VN_JP_BULKY.surchargeVnd[0], locale),
                    max: formatVnd(VN_JP_BULKY.surchargeVnd[1], locale),
                    cm: result.bulky === "review" ? VN_JP_BULKY.anySideCm : VN_JP_BULKY.contactSumCm,
                    kg: VN_JP_BULKY.contactKg,
                  })}
                </span>
              </div>
            )}

            <p className="text-xs text-muted leading-relaxed">
              {t("note")}
            </p>
          </div>

          {/* Action buttons */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
            <Link
              href={`${pagePath(locale, "policy")}#${RULES_ANCHOR[route]}`}
              className="text-xs sm:text-sm font-medium text-forest underline hover:text-forest-dark"
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
