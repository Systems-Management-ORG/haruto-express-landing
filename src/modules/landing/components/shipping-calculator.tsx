"use client";

import { Calculator } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useId, useState } from "react";
import type { Locale } from "@/shared/constants/locales";
import { pagePath } from "@/shared/seo/pages";
import { type Dimensions, type GoodsKind, quote, type Route } from "../shipping-quote";

const NUMBER_LOCALE: Record<Locale, string> = { vi: "vi-VN", ja: "ja-JP", en: "en-US" };
const ROUTES: Route[] = ["vnJp", "jpVn"];
const GOODS: GoodsKind[] = ["clean", "mixed"];
const DIMS = ["length", "width", "height"] as const;

// Positive number from a text field (accepts "3,5" as well as "3.5"); anything else → null.
function parse(value: string): number | null {
  const n = Number(value.trim().replace(",", "."));
  return value.trim() && Number.isFinite(n) && n > 0 ? n : null;
}

// Radio group drawn as two buttons, the same pattern as the contact form's "kind" choice.
function Choice<T extends string>({
  legend,
  name,
  options,
  value,
  onChange,
}: {
  legend: string;
  name: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <fieldset>
      <legend className="field-label">{legend}</legend>
      <div className="grid grid-cols-2 gap-2">
        {options.map((option) => (
          <label
            key={option.value}
            className={`flex min-h-11 cursor-pointer items-center justify-center rounded-lg border px-3 py-2 text-center font-medium has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-gold ${
              value === option.value ? "border-forest bg-forest text-white" : "border-forest text-forest"
            }`}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="sr-only"
            />
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

// Freight estimate from the published rates (shipping-quote.ts). The result updates as the reader
// types and is announced politely; prices beyond the published tiers send the reader to contact.
export function ShippingCalculator() {
  const t = useTranslations("pricing.calculator");
  const tTeaser = useTranslations("pricing.teaser");
  const tVnJp = useTranslations("pricing.vnJp");
  const locale = useLocale() as Locale;
  const id = useId();

  const [route, setRoute] = useState<Route>("vnJp");
  const [goods, setGoods] = useState<GoodsKind>("clean");
  const [weight, setWeight] = useState("");
  const [dims, setDims] = useState<Record<(typeof DIMS)[number], string>>({ length: "", width: "", height: "" });

  const nf = new Intl.NumberFormat(NUMBER_LOCALE[locale], { maximumFractionDigits: 1 });
  const vnd = (n: number) => nf.format(n);

  const kg = parse(weight);
  const [l, w, h] = DIMS.map((d) => parse(dims[d]));
  const size: Dimensions | undefined = l && w && h ? { lengthCm: l, widthCm: w, heightCm: h } : undefined;
  const result = kg ? quote(route, route === "vnJp" ? goods : "clean", kg, size) : null;

  return (
    <div className="mt-10 grid rounded-(--radius-card) border border-line bg-white gap-8 p-6 sm:p-8 lg:mt-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-12">
      <form className="grid content-start gap-5" onSubmit={(event) => event.preventDefault()} aria-labelledby={`${id}-title`}>
        <div className="flex items-center gap-3">
          <span className="icon-chip" aria-hidden>
            <Calculator size={22} weight="duotone" />
          </span>
          <div>
            <h3 id={`${id}-title`} className="text-xl text-forest">
              {t("title")}
            </h3>
            <p className="text-sm text-muted">{t("intro")}</p>
          </div>
        </div>

        <Choice
          legend={t("routeLegend")}
          name={`${id}-route`}
          options={ROUTES.map((value) => ({ value, label: tTeaser(`${value}.label`) }))}
          value={route}
          onChange={setRoute}
        />

        {route === "vnJp" && (
          <Choice
            legend={t("goodsLegend")}
            name={`${id}-goods`}
            options={GOODS.map((value) => ({ value, label: tVnJp(`${value}.title`) }))}
            value={goods}
            onChange={setGoods}
          />
        )}

        <div>
          <label htmlFor={`${id}-weight`} className="field-label">
            {t("weight")}
          </label>
          <input
            id={`${id}-weight`}
            inputMode="decimal"
            autoComplete="off"
            value={weight}
            onChange={(event) => setWeight(event.target.value)}
            className="field"
          />
        </div>

        <fieldset>
          <legend className="field-label">{t("dimsLegend")}</legend>
          <div className="grid grid-cols-3 gap-2">
            {DIMS.map((d) => (
              <input
                key={d}
                aria-label={t(d)}
                placeholder={t(d)}
                inputMode="decimal"
                autoComplete="off"
                value={dims[d]}
                onChange={(event) => setDims((prev) => ({ ...prev, [d]: event.target.value }))}
                className="field"
              />
            ))}
          </div>
          <p className="mt-2 text-sm text-muted">{t("dimsHint")}</p>
        </fieldset>
      </form>

      <div className="flex flex-col rounded-2xl bg-sage p-6">
        <p className="font-semibold text-forest">{t("resultTitle")}</p>
        <div role="status" className="mt-3 flex-1">
          {!result && <span className="text-muted">{t("empty")}</span>}

          {result?.status === "priced" && (
            <>
              <span className="block font-display font-(--weight-display) text-4xl text-forest tabular-nums">
                {t("vnd", { price: vnd(result.total) })}
              </span>
              <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm tabular-nums">
                <dt className="text-muted">{t("billable")}</dt>
                <dd className="text-right font-medium">
                  {t("kg", { kg: nf.format(result.billableKg) })}
                  {result.volumetric && <span className="block text-muted">{t("volumetric")}</span>}
                </dd>
                <dt className="text-muted">{t("rate")}</dt>
                <dd className="text-right font-medium">{t("perKg", { price: vnd(result.vndPerKg) })}</dd>
                {result.parcelFee > 0 && (
                  <>
                    <dt className="text-muted">{t("parcelFee")}</dt>
                    <dd className="text-right font-medium">{t("vnd", { price: vnd(result.parcelFee) })}</dd>
                  </>
                )}
              </dl>
            </>
          )}

          {result && result.status !== "priced" && (
            <span className="block text-lg font-medium text-forest">{t(result.status)}</span>
          )}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
          <a href="#contact" data-track="cta_calculator_quote" className="btn btn-primary">
            {t("quoteCta")}
          </a>
          <Link href={pagePath(locale, "policy")} className="link-arrow text-forest">
            {t("rulesLink")}
          </Link>
        </div>
        <p className="mt-4 text-sm text-muted">{t("note")}</p>
      </div>
    </div>
  );
}
