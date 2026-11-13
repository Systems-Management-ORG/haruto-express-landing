import {
  ArrowsDownUp,
  ClipboardText,
  Cube,
  Envelope,
  Gavel,
  IdentificationCard,
  MapPin,
  Phone,
  Scales,
  ShieldCheck,
  ShieldWarning,
  ShoppingCart,
  Truck,
} from "@phosphor-icons/react/dist/ssr";
import { useTranslations } from "next-intl";
import { MapEmbed } from "@/shared/components/map-embed";
import { rawRecord } from "@/shared/lib/raw-messages";
import { locationById } from "@/shared/seo/business";
import { TIP_ICONS } from "../../info-pages";
import { VolumetricDiagram } from "../volumetric-diagram";

// Bodies of the policy sections (weight rules, compensation, Japan warehouse, shipping tips) and
// the buying/auction/shipping-only terms. The frame around them (anchor, background, H2) comes
// from InfoPage, or from ServicePage for the terms; card titles are H3.

// How weight is charged: actual vs. volumetric, the rounding rule, bulky goods with the diagram.
export function WeightRules() {
  const t = useTranslations("policy.weight");

  return (
    <div data-reveal-group className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
      <div className="grid gap-5">
        {([
          ["standard", Scales],
          ["rounding", ArrowsDownUp],
        ] as const).map(([key, Icon]) => (
          <article key={key} className="info-card">
            <span className="icon-chip" aria-hidden>
              <Icon size={22} weight="duotone" />
            </span>
            <h3 className="mt-4 text-lg font-medium text-forest">{t(`${key}.title`)}</h3>
            <p className="mt-1.5 text-muted">{t(`${key}.body`)}</p>
          </article>
        ))}
      </div>
      <article className="info-card grid items-center gap-6 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <div>
          <span className="icon-chip" aria-hidden>
            <Cube size={22} weight="duotone" />
          </span>
          <h3 className="mt-4 text-lg font-medium text-forest">{t("bulky.title")}</h3>
          <p className="mt-1.5 text-muted">{t("bulky.body")}</p>
        </div>
        <VolumetricDiagram />
      </article>
    </div>
  );
}

// Compensation with and without insurance.
export function Compensation() {
  const t = useTranslations("policy.compensation");

  return (
    <div data-reveal-group className="grid gap-5 md:grid-cols-2">
      {([
        ["insured", ShieldCheck, true],
        ["uninsured", ShieldWarning, false],
      ] as const).map(([key, Icon, featured]) => (
        <article key={key} className={`stat-card${featured ? " stat-card--featured" : ""}`}>
          <div className="flex items-center gap-3">
            <Icon size={28} weight="duotone" aria-hidden />
            <h3 className="text-lg font-medium">{t(`${key}.title`)}</h3>
          </div>
          <p className="stat-card__value">{t(`${key}.stat`)}</p>
          <p className="stat-card__label">{t(`${key}.statLabel`)}</p>
          <p className="stat-card__body">{t(`${key}.body`)}</p>
        </article>
      ))}
    </div>
  );
}

const CONCIERGE = [
  { key: "buy", Icon: ShoppingCart },
  { key: "auction", Icon: Gavel },
  { key: "ship", Icon: Truck },
] as const;

// Buying, auction bidding and shipping-only: who pays what, and when.
export function ConciergeTerms() {
  const t = useTranslations("policy.concierge");

  return (
    <ol data-reveal-group className="grid gap-5 md:grid-cols-3">
      {CONCIERGE.map(({ key, Icon }, index) => (
        <li key={key} className="info-card relative">
          <span aria-hidden className="absolute top-5 right-6 font-display font-(--weight-display) text-4xl leading-none text-forest/15">
            {index + 1}
          </span>
          <span className="icon-chip icon-chip--lg" aria-hidden>
            <Icon size={28} weight="duotone" />
          </span>
          <h3 className="mt-4 text-lg font-medium text-forest">{t(`${key}.title`)}</h3>
          <p className="mt-1.5 text-muted">{t(`${key}.body`)}</p>
        </li>
      ))}
    </ol>
  );
}

const WAREHOUSE = [
  { key: "postal", Icon: Envelope },
  { key: "address", Icon: MapPin },
  { key: "phone", Icon: Phone },
  { key: "recipient", Icon: IdentificationCard },
] as const;

// The Japan warehouse address card beside its map (stacked on small screens).
export function WarehouseInfo() {
  const t = useTranslations("policy.warehouse");
  const japanWarehouse = locationById("japanWarehouse");

  return (
    <div data-reveal className="grid items-start gap-8 lg:grid-cols-2 lg:gap-10">
      <div className="warehouse-card">
        <dl className="grid gap-4">
          {WAREHOUSE.map(({ key, Icon }) => (
            <div key={key} className="flex gap-3">
              <Icon size={22} weight="duotone" aria-hidden className="mt-0.5 shrink-0 text-gold" />
              <div>
                <dt className="text-sm text-ivory/70">{t(`${key}.label`)}</dt>
                <dd className="mt-0.5 font-medium break-words">{t(`${key}.value`)}</dd>
              </div>
            </div>
          ))}
        </dl>
      </div>
      {japanWarehouse && <MapEmbed query={japanWarehouse.query} title={t("mapTitle")} openLabel={t("mapOpen")} />}
    </div>
  );
}

// What to do before sending to the warehouse and when receiving.
export function WarehouseTips() {
  const t = useTranslations("policy.tips");
  const tips = rawRecord<string>(t, "items");

  return (
    <ul data-reveal-group className="grid gap-3 lg:grid-cols-2">
      {Object.entries(tips).map(([id, tip]) => {
        const Icon = TIP_ICONS[id] ?? ClipboardText;
        return (
          <li key={id} className="flex gap-3 rounded-card border border-line bg-white p-4">
            <span className="icon-chip" aria-hidden>
              <Icon size={20} weight="duotone" />
            </span>
            <span className="pt-1">{tip}</span>
          </li>
        );
      })}
    </ul>
  );
}
