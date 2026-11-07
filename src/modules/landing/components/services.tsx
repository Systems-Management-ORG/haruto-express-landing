import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { useTranslations } from "next-intl";

const ITEMS = ["personal", "business"] as const;

export function Services() {
  const t = useTranslations("services");

  return (
    <section id="services" className="section bg-sage">
      <div className="wrap">
        <h2 data-reveal className="heading-2">{t("title")}</h2>
        <div data-reveal-group className="mt-10 grid gap-8 md:grid-cols-2 md:gap-6 lg:mt-14">
          {ITEMS.map((key) => (
            <article key={key} className="ruled">
              <h3 className="font-display text-3xl font-normal text-forest lg:text-4xl">{t(`${key}.title`)}</h3>
              <p className="mt-3 max-w-[34rem] sm:text-lg">{t(`${key}.body`)}</p>
              <a href="#contact" className="link-arrow mt-3 text-forest">
                {t("cta")}
                <ArrowRight size={18} aria-hidden className="m-arrow" />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
