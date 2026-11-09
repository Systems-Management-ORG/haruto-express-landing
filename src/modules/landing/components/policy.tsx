import { useTranslations } from "next-intl";

const WEIGHT = ["standard", "bulky", "rounding"] as const;
const COMPENSATION = ["insured", "uninsured"] as const;
const CONCIERGE = ["buy", "auction", "ship"] as const;
const WAREHOUSE = ["postal", "address", "phone", "recipient"] as const;

export type PolicyBlock = "weight" | "compensation" | "concierge" | "warehouse";
const ALL_BLOCKS: PolicyBlock[] = ["weight", "compensation", "concierge", "warehouse"];

// `show` lets subpages render a focused subset (e.g. just warehouse) while the home page
// renders the full policy. `withHeader` hides the section heading/intro on subpages that
// already have a PageHero.
export function Policy({ show = ALL_BLOCKS, withHeader = true }: { show?: PolicyBlock[]; withHeader?: boolean }) {
  const t = useTranslations("policy");
  const tips = t.raw("tips.items") as string[];
  const has = (block: PolicyBlock) => show.includes(block);

  return (
    <section id="policy" className="section">
      <div className="wrap">
        {withHeader && (
          <>
            <h2 data-reveal className="heading-2">{t("title")}</h2>
            <p className="mt-4 max-w-[46rem] sm:text-lg">{t("intro")}</p>
          </>
        )}

        {has("weight") && (
          <>
            <h3 data-reveal className={`text-2xl text-forest ${withHeader ? "mt-12 lg:mt-16" : ""}`}>{t("weight.title")}</h3>
            <div data-reveal-group className="mt-6 grid gap-8 md:grid-cols-3 md:gap-6">
              {WEIGHT.map((key) => (
                <article key={key} className="ruled">
                  <h4 className="text-lg font-medium text-forest">{t(`weight.${key}.title`)}</h4>
                  <p className="mt-2">{t(`weight.${key}.body`)}</p>
                </article>
              ))}
            </div>
          </>
        )}

        {has("compensation") && (
          <>
            <h3 data-reveal className="mt-12 text-2xl text-forest lg:mt-16">{t("compensation.title")}</h3>
            <div data-reveal-group className="mt-6 grid gap-8 md:grid-cols-2 md:gap-6">
              {COMPENSATION.map((key) => (
                <article key={key} className="ruled">
                  <h4 className="text-lg font-medium text-forest">{t(`compensation.${key}.title`)}</h4>
                  <p className="mt-2">{t(`compensation.${key}.body`)}</p>
                </article>
              ))}
            </div>
          </>
        )}

        {has("concierge") && (
          <>
            <h3 data-reveal className="mt-12 text-2xl text-forest lg:mt-16">{t("concierge.title")}</h3>
            <div data-reveal-group className="mt-6 grid gap-8 md:grid-cols-3 md:gap-6">
              {CONCIERGE.map((key) => (
                <article key={key} className="ruled">
                  <h4 className="text-lg font-medium text-forest">{t(`concierge.${key}.title`)}</h4>
                  <p className="mt-2">{t(`concierge.${key}.body`)}</p>
                </article>
              ))}
            </div>
          </>
        )}

        {has("warehouse") && (
          <div data-reveal className="mt-12 grid gap-8 lg:mt-16 lg:grid-cols-2 lg:gap-12">
            <div className="card">
              <h3 className="text-xl text-forest">{t("warehouse.title")}</h3>
              <dl className="mt-4 grid gap-3">
                {WAREHOUSE.map((key) => (
                  <div key={key}>
                    <dt className="text-sm font-medium text-muted">{t(`warehouse.${key}.label`)}</dt>
                    <dd className="mt-0.5">{t(`warehouse.${key}.value`)}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div>
              <h3 className="text-xl text-forest">{t("tips.title")}</h3>
              <ul className="mt-4 grid list-disc gap-3 pl-5">
                {tips.map((tip) => (
                  <li key={tip}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
