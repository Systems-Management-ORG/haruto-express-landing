import { CheckCircle, Warning, Prohibit } from "@phosphor-icons/react/dist/ssr";
import { useTranslations } from "next-intl";

const GROUPS = [
  { key: "accepted", Icon: CheckCircle, tone: "text-forest" },
  { key: "notGuaranteed", Icon: Warning, tone: "text-gold" },
  { key: "prohibited", Icon: Prohibit, tone: "text-[#9f2f2d]" },
] as const;

// Accepted / not-guaranteed / prohibited item lists, from the VN-JP service policy.
export function Goods() {
  const t = useTranslations("pages.goods");

  return (
    <section className="section">
      <div className="wrap grid gap-8 md:grid-cols-3 md:gap-6">
        {GROUPS.map(({ key, Icon, tone }) => {
          const items = t.raw(`${key}.items`) as string[];
          return (
            <article key={key} className="ruled">
              <Icon size={30} weight="light" aria-hidden className={tone} />
              <h2 className="mt-4 text-xl text-forest">{t(`${key}.title`)}</h2>
              <ul className="mt-3 grid list-disc gap-2 pl-5">
                {items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>
    </section>
  );
}
