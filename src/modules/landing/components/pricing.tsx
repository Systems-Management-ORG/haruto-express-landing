import { useTranslations } from "next-intl";

export type Direction = "vnJp" | "jpVn";

type Surcharge = { item: string; fee: string };
type Rate = { weight: string; price: string; note?: string };

const VN_JP_GOODS = ["clean", "mixed"] as const;

// Pricing for a single direction (no tabs): the VN→JP tables with per-type descriptions, or the
// JP→VN flat rate. The surcharge table is shared and shown below. Headings are omitted on route
// pages that already carry a PageHero.
export function Pricing({ direction, withHeader = true }: { direction: Direction; withHeader?: boolean }) {
  const t = useTranslations("pricing");
  const surcharges = t.raw("surcharge.rows") as Surcharge[];

  return (
    <section id="pricing" className="section">
      <div className="wrap">
        {withHeader && (
          <>
            <h2 data-reveal className="heading-2">{t("title")}</h2>
            <p className="mt-4 max-w-[44rem] sm:text-lg">{t("intro")}</p>
          </>
        )}

        <div data-reveal className={withHeader ? "mt-8 lg:mt-10" : ""}>
          {direction === "jpVn" ? (
            <div className="grid gap-6 rounded-card border border-line bg-white p-6 sm:grid-cols-[auto_1fr] sm:items-center sm:gap-10 sm:p-8">
              <div>
                <p className="text-sm text-muted">{t("freight.weight")}</p>
                <p className="mt-1 font-display text-4xl text-forest lg:text-5xl">{t("freight.price")}</p>
              </div>
              <ul className="grid gap-2 text-sm text-muted sm:text-base">
                <li>{t("freight.buyRate")}</li>
                <li>{t("freight.domestic")}</li>
                <li>{t("freight.vat")}</li>
              </ul>
            </div>
          ) : (
            <>
              <p className="max-w-[48rem] sm:text-lg">{t("vnJp.intro")}</p>
              {VN_JP_GOODS.map((kind) => {
                const rows = t.raw(`vnJp.${kind}.rows`) as Rate[];
                const features = t.raw(`vnJp.${kind}.features`) as string[];
                return (
                  <div key={kind} className="mt-10 grid gap-6 lg:grid-cols-2 lg:gap-10">
                    <div>
                      <h3 className="text-xl text-forest">{t(`vnJp.${kind}.title`)}</h3>
                      <ul className="mt-3 grid list-disc gap-2 pl-5 text-sm text-muted sm:text-base">
                        {features.map((f) => (
                          <li key={f}>{f}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div tabIndex={0} role="group" aria-label={t("vnJp.scrollLabel")} className="overflow-x-auto">
                        <table className="w-full min-w-[18rem] text-left">
                          <thead>
                            <tr className="border-b border-line text-sm text-muted">
                              <th scope="col" className="py-3.5 pr-6 font-medium">{t("vnJp.columns.weight")}</th>
                              <th scope="col" className="py-3.5 pr-4 font-medium">{t("vnJp.columns.price")}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {rows.map((row) => (
                              <tr key={row.weight} className="border-b border-line">
                                <th scope="row" className="py-3 pr-6 font-medium whitespace-nowrap align-top">{row.weight}</th>
                                <td className="py-3 align-top">
                                  <span className="whitespace-nowrap">{row.price}</span>
                                  {row.note && <span className="mt-0.5 block text-xs font-medium text-gold">{row.note}</span>}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <p className="mt-3 text-sm text-muted">{t(`vnJp.${kind}.note`)}</p>
                    </div>
                  </div>
                );
              })}
              <p className="mt-6 max-w-[48rem] text-sm text-muted">{t("vnJp.rounding")}</p>
            </>
          )}
        </div>

        <h3 className="mt-12 text-xl text-forest lg:mt-14">{t("surcharge.title")}</h3>
        <div tabIndex={0} role="group" aria-label={t("scrollLabel")} className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[22rem] text-left">
            <thead>
              <tr className="border-b border-line text-sm text-muted">
                <th scope="col" className="py-4 pr-6 font-medium">{t("surcharge.columns.item")}</th>
                <th scope="col" className="py-4 pr-4 font-medium">{t("surcharge.columns.fee")}</th>
              </tr>
            </thead>
            <tbody>
              {surcharges.map((row) => (
                <tr key={row.item} className="border-b border-line align-top">
                  <th scope="row" className="max-w-[30rem] py-4 pr-6 font-medium">{row.item}</th>
                  <td className="py-4">{row.fee}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
