import { AirplaneTilt, House, Package, ShoppingCart, Storefront, Truck, Warehouse } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import type { CSSProperties } from "react";
import type { Locale } from "@/shared/constants/locales";
import { pagePath } from "@/shared/seo/pages";
import { FLOW_LANES, type FlowIcon } from "../home-data";

const ICONS: Record<FlowIcon, typeof Truck> = { ShoppingCart, Warehouse, AirplaneTilt, House, Storefront, Package, Truck };

// How the services chain together, one lane per direction, on the step rail of the service pages
// (.svc-steps). A step with a page links to it. Text: `home.flow.steps.<id>`; the lane titles
// are the route labels of the pricing teaser.
export function ServiceFlow() {
  const t = useTranslations("home.flow");
  const tRoute = useTranslations("pricing.teaser");
  const locale = useLocale() as Locale;

  return (
    <div aria-label={t("label")} role="group" className="mt-10 grid gap-10 lg:mt-14 lg:gap-12">
      {FLOW_LANES.map(({ lane, steps }) => (
        <div key={lane}>
          <h3 data-reveal className="text-xl text-forest">
            {tRoute(`${lane}.label`)}
          </h3>
          <ol data-reveal-group className="svc-steps mt-6" style={{ "--n": steps.length } as CSSProperties}>
            {steps.map(({ id, icon, page }, index) => {
              const Icon = ICONS[icon];
              const label = t(`steps.${id}`);
              return (
                <li key={id} className="svc-step">
                  <span className="svc-step__visual">
                    <span className="svc-step__icon" aria-hidden>
                      <Icon size={30} weight="duotone" />
                    </span>
                    <span className="svc-step__no" aria-hidden>
                      {index + 1}
                    </span>
                  </span>
                  <p className="svc-step__text svc-step__title">
                    {page ? (
                      <Link href={pagePath(locale, page)} className="underline decoration-gold decoration-2 underline-offset-4 hover:text-deep">
                        {label}
                      </Link>
                    ) : (
                      label
                    )}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>
      ))}
    </div>
  );
}
