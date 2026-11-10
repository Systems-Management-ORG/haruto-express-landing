import { ArrowsLeftRight, Headset, Receipt, Scales, ShoppingCart, Warehouse } from "@phosphor-icons/react/dist/ssr";
import { useTranslations } from "next-intl";
import { WHY_KEYS } from "../home-data";

const ICONS = {
  warehouse: Warehouse,
  consultant: Headset,
  twoWay: ArrowsLeftRight,
  taxIncluded: Receipt,
  weightBands: Scales,
  concierge: ShoppingCart,
} as const;

// Centered heading and intro, then a grid of reasons, each under a round icon badge.
export function Why() {
  const t = useTranslations("why");

  return (
    <section id="why" className="section">
      <div className="wrap">
        <div className="text-center">
          <h2 data-reveal className="heading-2">{t("title")}</h2>
          <p data-reveal className="mx-auto mt-4 max-w-[48rem] sm:text-lg">{t("intro")}</p>
        </div>
        <ul data-reveal-group className="mt-12 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {WHY_KEYS.map((key) => {
            const Icon = ICONS[key];
            return (
              <li key={key} className="text-center">
                <span className="why-badge" aria-hidden>
                  <Icon size={34} weight="duotone" />
                </span>
                <h3 className="mt-5 text-xl text-forest">{t(`${key}.title`)}</h3>
                <p className="mx-auto mt-2 max-w-[22rem] text-muted">{t(`${key}.body`)}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
