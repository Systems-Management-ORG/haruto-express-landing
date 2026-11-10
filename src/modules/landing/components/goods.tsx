import { CheckCircle, Prohibit, Warning } from "@phosphor-icons/react/dist/ssr";
import { useTranslations } from "next-intl";

// Accepted / not-guaranteed / prohibited item lists, from the VN-JP service policy, as three
// colour-coded cards (green, amber, red) so the level of each list reads at a glance.
const GROUPS = [
  { key: "accepted", Icon: CheckCircle, tone: "ok" },
  { key: "notGuaranteed", Icon: Warning, tone: "warn" },
  { key: "prohibited", Icon: Prohibit, tone: "ban" },
] as const;

export function Goods() {
  const t = useTranslations("pages.goods");

  return (
    <section className="section">
      <ul data-reveal-group className="wrap grid gap-5 md:grid-cols-3">
        {GROUPS.map(({ key, Icon, tone }) => {
          const items = t.raw(`${key}.items`) as string[];
          return (
            <li key={key} className={`goods-list goods-list--${tone}`}>
              <h3 className="goods-list__head">
                <Icon size={26} weight="fill" aria-hidden className="shrink-0" />
                {t(`${key}.title`)}
              </h3>
              <ul className="grid gap-2.5 p-5 sm:p-6">
                {items.map((item) => (
                  <li key={item} className="flex gap-2.5">
                    <Icon size={18} weight="bold" aria-hidden className="goods-list__mark mt-1 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
