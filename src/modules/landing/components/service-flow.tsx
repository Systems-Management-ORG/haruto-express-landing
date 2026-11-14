import { AirplaneTilt, House, Package, ShoppingCart, Storefront, Truck, Warehouse } from "@phosphor-icons/react/dist/ssr";
import { useTranslations } from "next-intl";
import { FLOW_LANES, type FlowIcon } from "../home-data";

const ICONS: Record<FlowIcon, typeof Truck> = { ShoppingCart, Warehouse, AirplaneTilt, House, Storefront, Package, Truck };

// How the services chain together: one compact panel per direction, side by side on large
// screens, each a short numbered list. No links here; the service cards below lead to the pages.
// Text: `home.flow.steps.<id>`; the panel titles are the route labels of the pricing teaser.
export function ServiceFlow() {
  const t = useTranslations("home.flow");
  const tRoute = useTranslations("pricing.teaser");

  return (
    <div role="group" aria-label={t("label")} data-reveal-group className="mt-10 grid gap-5 lg:mt-12 lg:grid-cols-2">
      {FLOW_LANES.map(({ lane, steps }) => (
        <div key={lane} className="rounded-(--radius-card) border border-line bg-white p-6 sm:p-8">
          <h3 className="text-lg font-semibold text-forest">{tRoute(`${lane}.label`)}</h3>
          <ol className="mt-5 grid gap-4">
            {steps.map(({ id, icon }, index) => {
              const Icon = ICONS[icon];
              return (
                <li key={id} className="flex items-center gap-4">
                  <span className="w-5 shrink-0 text-right text-sm font-semibold text-muted tabular-nums" aria-hidden>
                    {index + 1}
                  </span>
                  <span className="icon-chip" aria-hidden>
                    <Icon size={22} weight="duotone" />
                  </span>
                  <span className="font-medium">{t(`steps.${id}`)}</span>
                </li>
              );
            })}
          </ol>
        </div>
      ))}
    </div>
  );
}
