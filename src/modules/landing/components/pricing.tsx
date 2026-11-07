"use client";

import { useTranslations } from "next-intl";
import { useRef, useState, type KeyboardEvent } from "react";

type Direction = "vnJp" | "jpVn";

const DIRECTIONS: Direction[] = ["vnJp", "jpVn"];

export function Pricing() {
  const t = useTranslations("pricing");
  const rows = t.raw("rows") as string[];
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
        <h2 data-reveal className="heading-2">{t("title")}</h2>
        <p className="mt-4 max-w-[40rem] sm:text-lg">{t("intro")}</p>

        <div role="tablist" aria-label={t("tabsLabel")} className="mt-8 flex gap-6 border-b border-line lg:mt-10">
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
          <div tabIndex={0} role="group" aria-label={t("scrollLabel")} className="overflow-x-auto">
            <table className="w-full min-w-[19rem] text-left">
              <thead>
                <tr className="border-b border-line text-sm text-muted">
                  <th scope="col" className="py-4 pr-4 font-medium">{t("columns.weight")}</th>
                  <th scope="col" className="py-4 pr-4 font-medium">{t("columns.price")}</th>
                  <th scope="col" className="py-4 pr-4 font-medium">{t("columns.status")}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row} className="border-b border-line">
                    <th scope="row" className="py-4 pr-4 font-medium whitespace-nowrap lg:py-5">{row}</th>
                    <td className="py-4 pr-4 lg:py-5">—</td>
                    <td className="py-4 whitespace-nowrap text-muted lg:py-5">{t("pending")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <p className="mt-4 text-sm text-muted">{t("note")}</p>
      </div>
    </section>
  );
}
