"use client";

import { useTranslations } from "next-intl";
import { useRef, useState, type KeyboardEvent } from "react";

type Direction = "vnJp" | "jpVn";

const DIRECTIONS: Direction[] = ["vnJp", "jpVn"];

type Surcharge = { item: string; fee: string };
type Rate = { weight: string; price: string };

const VN_JP_GOODS = ["clean", "mixed"] as const;

export function Pricing({ withHeader = true }: { withHeader?: boolean }) {
  const t = useTranslations("pricing");
  const surcharges = t.raw("surcharge.rows") as Surcharge[];
  const [active, setActive] = useState<Direction>("vnJp");
  const tabRefs = useRef<Partial<Record<Direction, HTMLButtonElement | null>>>({});

  const moveFocus = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const next = active === "vnJp" ? "jpVn" : "vnJp";
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <section id="pricing" className="section">
      <div className="wrap">
        {withHeader && (
          <>
            <h2 data-reveal className="heading-2">{t("title")}</h2>
            <p className="mt-4 max-w-[44rem] sm:text-lg">{t("intro")}</p>
          </>
        )}

        <div role="tablist" aria-label={t("tabsLabel")} className={`flex gap-6 border-b border-line ${withHeader ? "mt-8 lg:mt-10" : ""}`}>
          {DIRECTIONS.map((direction) => (
            <button
              key={direction}
              ref={(node) => {
                tabRefs.current[direction] = node;
              }}
              id={`tab-${direction}`}
              type="button"
              role="tab"
              aria-selected={active === direction}
              aria-controls="pricing-panel"
              tabIndex={active === direction ? 0 : -1}
              onClick={() => setActive(direction)}
              onKeyDown={moveFocus}
              className={`-mb-px min-h-11 whitespace-nowrap border-b-2 px-1 font-medium ${
                active === direction ? "border-forest text-forest" : "border-transparent text-muted"
              }`}
            >
              {t(`tabs.${direction}`)}
            </button>
          ))}
        </div>

        <div data-reveal id="pricing-panel" role="tabpanel" aria-labelledby={`tab-${active}`}>
          {active === "jpVn" ? (
            <div className="mt-8 grid gap-6 rounded-card border border-line bg-white p-6 sm:grid-cols-[auto_1fr] sm:items-center sm:gap-10 sm:p-8">
              <div>
                <p className="text-sm text-muted">{t("freight.weight")}</p>
                <p className="mt-1 font-display text-4xl text-forest lg:text-5xl">{t("freight.price")}</p>
              </div>
              <ul className="grid gap-2 text-sm text-muted sm:text-base">
                <li>{t("freight.buyRate")}</li>
                <li>{t("freight.domestic")}</li>
                <li>{t("freight.vat")}</li>
              </ul>
            </div>
          ) : (
            <>
              <p className="mt-8 max-w-[48rem] sm:text-lg">{t("vnJp.intro")}</p>
              {VN_JP_GOODS.map((kind) => {
                const rows = t.raw(`vnJp.${kind}.rows`) as Rate[];
                return (
                  <div key={kind} className="mt-8">
                    <h3 className="text-xl text-forest">{t(`vnJp.${kind}.title`)}</h3>
                    <p className="mt-2 max-w-[48rem] text-sm text-muted sm:text-base">{t(`vnJp.${kind}.desc`)}</p>
                    <div tabIndex={0} role="group" aria-label={t("vnJp.scrollLabel")} className="mt-4 overflow-x-auto">
                      <table className="w-full min-w-[20rem] text-left">
                        <thead>
                          <tr className="border-b border-line text-sm text-muted">
                            <th scope="col" className="py-4 pr-6 font-medium">{t("vnJp.columns.weight")}</th>
                            <th scope="col" className="py-4 pr-4 font-medium">{t("vnJp.columns.price")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rows.map((row) => (
                            <tr key={row.weight} className="border-b border-line">
                              <th scope="row" className="py-3.5 pr-6 font-medium whitespace-nowrap">{row.weight}</th>
                              <td className="py-3.5 whitespace-nowrap">{row.price}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p className="mt-3 text-sm text-muted">{t(`vnJp.${kind}.note`)}</p>
                  </div>
                );
              })}
              <p className="mt-6 max-w-[48rem] text-sm text-muted">{t("vnJp.rounding")}</p>
            </>
          )}
        </div>

        <h3 className="mt-12 text-xl text-forest lg:mt-14">{t("surcharge.title")}</h3>
        <div tabIndex={0} role="group" aria-label={t("scrollLabel")} className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[22rem] text-left">
            <thead>
              <tr className="border-b border-line text-sm text-muted">
                <th scope="col" className="py-4 pr-6 font-medium">{t("surcharge.columns.item")}</th>
                <th scope="col" className="py-4 pr-4 font-medium">{t("surcharge.columns.fee")}</th>
              </tr>
            </thead>
            <tbody>
              {surcharges.map((row) => (
                <tr key={row.item} className="border-b border-line align-top">
                  <th scope="row" className="max-w-[28rem] py-4 pr-6 font-medium">{row.item}</th>
                  <td className="py-4 whitespace-nowrap">{row.fee}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
