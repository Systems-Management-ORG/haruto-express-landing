"use client";

import { AirplaneTilt, House, Package, ShoppingCart, Storefront, Truck, Warehouse } from "@phosphor-icons/react/dist/ssr";
import { useTranslations } from "next-intl";
import { type CSSProperties, type KeyboardEvent, useId, useRef, useState } from "react";
import { FLOW_LANES, type FlowIcon } from "../home-data";

const ICONS: Record<FlowIcon, typeof Truck> = { ShoppingCart, Warehouse, AirplaneTilt, House, Storefront, Package, Truck };

// How the services chain together: a tab per direction, each a four-step stepper on the step
// rail of the service pages (.svc-steps: one connected row on large screens, a vertical rail on
// small ones). Tabs follow the WAI-ARIA pattern (arrow keys, Home/End move between them).
// Text: `home.flow.steps.<id>`; the tab labels are the route labels of the pricing teaser.
export function ServiceFlow() {
  const t = useTranslations("home.flow");
  const tRoute = useTranslations("pricing.teaser");
  const id = useId();
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const select = (index: number) => {
    const next = (index + FLOW_LANES.length) % FLOW_LANES.length;
    setActive(next);
    tabs.current[next]?.focus();
  };

  const onKeyDown = (event: KeyboardEvent) => {
    const moves: Record<string, number> = { ArrowRight: active + 1, ArrowLeft: active - 1, Home: 0, End: FLOW_LANES.length - 1 };
    if (!(event.key in moves)) return;
    event.preventDefault();
    select(moves[event.key]);
  };

  return (
    <div data-reveal className="mt-10 lg:mt-12">
      <div role="tablist" aria-label={t("label")} onKeyDown={onKeyDown} className="mx-auto grid max-w-[34rem] grid-cols-2 gap-1 rounded-full border border-line bg-white p-1">
        {FLOW_LANES.map(({ lane }, index) => (
          <button
            key={lane}
            ref={(node) => {
              tabs.current[index] = node;
            }}
            type="button"
            role="tab"
            id={`${id}-tab-${lane}`}
            aria-selected={index === active}
            aria-controls={`${id}-panel-${lane}`}
            tabIndex={index === active ? 0 : -1}
            onClick={() => setActive(index)}
            className={`min-h-11 rounded-full px-4 py-2 font-medium transition-colors ${
              index === active ? "bg-forest text-white" : "text-forest hover:bg-sage"
            }`}
          >
            {tRoute(`${lane}.label`)}
          </button>
        ))}
      </div>

      {FLOW_LANES.map(({ lane, steps }, index) => (
        <div
          key={lane}
          role="tabpanel"
          id={`${id}-panel-${lane}`}
          aria-labelledby={`${id}-tab-${lane}`}
          hidden={index !== active}
          className="mt-10"
        >
          <ol className="svc-steps" style={{ "--n": steps.length } as CSSProperties}>
            {steps.map(({ id: step, icon }, number) => {
              const Icon = ICONS[icon];
              return (
                <li key={step} className="svc-step">
                  <span className="svc-step__visual">
                    <span className="svc-step__icon" aria-hidden>
                      <Icon size={30} weight="duotone" />
                    </span>
                    <span className="svc-step__no" aria-hidden>
                      {number + 1}
                    </span>
                  </span>
                  <p className="svc-step__text svc-step__title">{t(`steps.${step}`)}</p>
                </li>
              );
            })}
          </ol>
        </div>
      ))}
    </div>
  );
}
