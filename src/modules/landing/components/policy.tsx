import {
  AddressBook,
  ArrowsDownUp,
  CalendarCheck,
  Camera,
  ClipboardText,
  Clock,
  Cube,
  Gavel,
  IdentificationCard,
  MapPin,
  Phone,
  Receipt,
  Scales,
  ShieldCheck,
  ShieldWarning,
  ShoppingCart,
  Truck,
  VideoCamera,
  Envelope,
} from "@phosphor-icons/react/dist/ssr";
import { useTranslations } from "next-intl";
import { MapEmbed } from "@/shared/components/map-embed";
import { locationById } from "@/shared/seo/business";
import { VolumetricDiagram } from "./volumetric-diagram";

const CONCIERGE = [
  { key: "buy", Icon: ShoppingCart },
  { key: "auction", Icon: Gavel },
  { key: "ship", Icon: Truck },
] as const;
const WAREHOUSE = [
  { key: "postal", Icon: Envelope },
  { key: "address", Icon: MapPin },
  { key: "phone", Icon: Phone },
  { key: "recipient", Icon: IdentificationCard },
] as const;
// Icon per tip, by position in `policy.tips.items` (same order in every locale).
const TIP_ICONS = [Camera, ClipboardText, Receipt, AddressBook, VideoCamera, Clock, CalendarCheck];

export type PolicyBlock = "weight" | "compensation" | "concierge" | "warehouse";
const ALL_BLOCKS: PolicyBlock[] = ["weight", "compensation", "concierge", "warehouse"];

// `show` lets subpages render a focused subset (e.g. just warehouse). `withHeader` hides the
// section heading/intro on subpages that already have a PageHero.
export function Policy({ show = ALL_BLOCKS, withHeader = true }: { show?: PolicyBlock[]; withHeader?: boolean }) {
  const t = useTranslations("policy");
  const tips = t.raw("tips.items") as string[];
  const has = (block: PolicyBlock) => show.includes(block);
  const japanWarehouse = locationById("japanWarehouse");

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
          <div className={withHeader ? "mt-12 lg:mt-16" : ""}>
            <h3 data-reveal className="text-2xl text-forest">{t("weight.title")}</h3>
            <div data-reveal-group className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
              <div className="grid gap-5">
                {([
                  ["standard", Scales],
                  ["rounding", ArrowsDownUp],
                ] as const).map(([key, Icon]) => (
                  <article key={key} className="info-card">
                    <span className="icon-chip" aria-hidden>
                      <Icon size={22} weight="duotone" />
                    </span>
                    <h4 className="mt-4 text-lg font-medium text-forest">{t(`weight.${key}.title`)}</h4>
                    <p className="mt-1.5 text-muted">{t(`weight.${key}.body`)}</p>
                  </article>
                ))}
              </div>
              <article className="info-card grid items-center gap-6 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
                <div>
                  <span className="icon-chip" aria-hidden>
                    <Cube size={22} weight="duotone" />
                  </span>
                  <h4 className="mt-4 text-lg font-medium text-forest">{t("weight.bulky.title")}</h4>
                  <p className="mt-1.5 text-muted">{t("weight.bulky.body")}</p>
                </div>
                <VolumetricDiagram />
              </article>
            </div>
          </div>
        )}

        {has("compensation") && (
          <div className="mt-12 lg:mt-16">
            <h3 data-reveal className="text-2xl text-forest">{t("compensation.title")}</h3>
            <div data-reveal-group className="mt-6 grid gap-5 md:grid-cols-2">
              {([
                ["insured", ShieldCheck, true],
                ["uninsured", ShieldWarning, false],
              ] as const).map(([key, Icon, featured]) => (
                <article key={key} className={`stat-card${featured ? " stat-card--featured" : ""}`}>
                  <div className="flex items-center gap-3">
                    <Icon size={28} weight="duotone" aria-hidden />
                    <h4 className="text-lg font-medium">{t(`compensation.${key}.title`)}</h4>
                  </div>
                  <p className="stat-card__value">{t(`compensation.${key}.stat`)}</p>
                  <p className="stat-card__label">{t(`compensation.${key}.statLabel`)}</p>
                  <p className="stat-card__body">{t(`compensation.${key}.body`)}</p>
                </article>
              ))}
            </div>
          </div>
        )}

        {has("concierge") && (
          <div className="mt-12 lg:mt-16 first:mt-0">
            <h3 data-reveal className="text-2xl text-forest">{t("concierge.title")}</h3>
            <ol data-reveal-group className="mt-6 grid gap-5 md:grid-cols-3">
              {CONCIERGE.map(({ key, Icon }, index) => (
                <li key={key} className="info-card relative">
                  <span aria-hidden className="absolute top-5 right-6 font-display text-4xl leading-none text-forest/15">
                    {index + 1}
                  </span>
                  <span className="icon-chip icon-chip--lg" aria-hidden>
                    <Icon size={28} weight="duotone" />
                  </span>
                  <h4 className="mt-4 text-lg font-medium text-forest">{t(`concierge.${key}.title`)}</h4>
                  <p className="mt-1.5 text-muted">{t(`concierge.${key}.body`)}</p>
                </li>
              ))}
            </ol>
          </div>
        )}

        {has("warehouse") && (
          <div data-reveal className="mt-12 grid gap-8 first:mt-0 lg:mt-16 lg:grid-cols-2 lg:gap-10">
            <div>
              <div className="warehouse-card">
                <h3 className="text-xl">{t("warehouse.title")}</h3>
                <dl className="mt-5 grid gap-4">
                  {WAREHOUSE.map(({ key, Icon }) => (
                    <div key={key} className="flex gap-3">
                      <Icon size={22} weight="duotone" aria-hidden className="mt-0.5 shrink-0 text-gold" />
                      <div>
                        <dt className="text-sm text-ivory/70">{t(`warehouse.${key}.label`)}</dt>
                        <dd className="mt-0.5 font-medium break-words">{t(`warehouse.${key}.value`)}</dd>
                      </div>
                    </div>
                  ))}
                </dl>
              </div>
              {japanWarehouse && (
                <div className="mt-6">
                  <MapEmbed
                    query={japanWarehouse.query}
                    title={t("warehouse.mapTitle")}
                    openLabel={t("warehouse.mapOpen")}
                  />
                </div>
              )}
            </div>
            <div>
              <h3 className="text-xl text-forest">{t("tips.title")}</h3>
              <ul className="mt-5 grid gap-3">
                {tips.map((tip, index) => {
                  const Icon = TIP_ICONS[index] ?? ClipboardText;
                  return (
                    <li key={tip} className="flex gap-3 rounded-card border border-line bg-white p-4">
                      <span className="icon-chip" aria-hidden>
                        <Icon size={20} weight="duotone" />
                      </span>
                      <span className="pt-1">{tip}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
