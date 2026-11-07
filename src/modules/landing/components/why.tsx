import { ArrowsLeftRight, Headset, Warehouse } from "@phosphor-icons/react/dist/ssr";
import { useTranslations } from "next-intl";

const ITEMS = [
  { key: "warehouse", Icon: Warehouse },
  { key: "consultant", Icon: Headset },
  { key: "twoWay", Icon: ArrowsLeftRight },
] as const;

export function Why() {
  const t = useTranslations("why");

  return (
    <section id="why" className="section">
      <div className="wrap">
        <h2 data-reveal className="heading-2">{t("title")}</h2>
        <ul data-reveal-group className="mt-10 grid gap-8 md:grid-cols-3 md:gap-6 lg:mt-14">
          {ITEMS.map(({ key, Icon }) => (
            <li key={key} className="ruled">
              <Icon size={32} weight="light" aria-hidden className="text-forest" />
              <h3 className="mt-5 text-xl text-forest">{t(`${key}.title`)}</h3>
              <p className="mt-2 max-w-[24rem]">{t(`${key}.body`)}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
