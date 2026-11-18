import {
  AirplaneTilt,
  ArrowsLeftRight,
  BatteryCharging,
  ChatCircleDots,
  CheckCircle,
  ClipboardText,
  Clock,
  CurrencyJpy,
  Envelope,
  Gavel,
  GlobeHemisphereEast,
  Handshake,
  IdentificationCard,
  MagnifyingGlass,
  MapPin,
  Package,
  Phone,
  Receipt,
  Scales,
  SealCheck,
  ShieldCheck,
  ShieldWarning,
  ShoppingCart,
  Truck,
  UsersThree,
  VideoCamera,
  Warning,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { MapEmbed } from "@/shared/components/map-embed";
import type { Locale } from "@/shared/constants/locales";
import { formatVnd } from "@/shared/lib/format";
import { rawRecord } from "@/shared/lib/raw-messages";
import { locationById } from "@/shared/seo/business";
import { type PageKey, pagePath } from "@/shared/seo/pages";
import { ContactCta } from "@/shared/ui/contact-cta";
import { TIP_ICONS } from "../../info-pages";
import { COMPENSATION } from "../../pricing-data";

// Bodies of the policy sections (compensation, insurance policy, auction policy, Japan warehouse,
// shipping tips) and the buying/auction/shipping-only terms. The frame around them (anchor,
// background, H2) comes from InfoPage, or from ServicePage for the terms; card titles are H3.

// The weight rules of each direction are in price-policy.tsx (WeightVnJp, WeightJpVn).

// Compensation with and without insurance: aligned metric display on both cards, recessed glass
// condition box on the insured card, and a direct link to the full insurance policy page.
export function Compensation({ showPolicyLink = true }: { showPolicyLink?: boolean } = {}) {
  const t = useTranslations("policy.compensation");
  const tPrice = useTranslations("service.price");
  const locale = useLocale() as Locale;
  const conditions = t.raw("insured.conditions") as string[];

  return (
    <div>
      <div data-reveal-group className="grid gap-6 md:grid-cols-2">
        <article className="stat-card stat-card--featured flex flex-col">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <ShieldCheck size={28} weight="duotone" aria-hidden className="text-gold" />
              <h3 className="text-lg font-medium">{t("insured.title")}</h3>
            </div>
            <span className="rate-badge">{COMPENSATION.insuranceRatePct}%</span>
          </div>
          <p className="stat-card__value tabular-nums">{t("insured.stat")}</p>
          <p className="stat-card__label">{t("insured.statLabel")}</p>
          <p className="stat-card__body">{t("insured.body")}</p>
          <div className="mt-4 rounded-xl border border-white/15 bg-white/8 p-4">
            <p className="text-sm font-semibold text-gold">{t("insured.conditionsTitle")}</p>
            <ul className="mt-2.5 grid gap-2 text-sm text-white/90">
              {conditions.map((item) => (
                <li key={item} className="flex gap-2.5">
                  <CheckCircle size={18} weight="fill" aria-hidden className="mt-0.5 shrink-0 text-gold" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </article>

        <article className="stat-card flex flex-col">
          <div className="flex items-center gap-3">
            <ShieldWarning size={28} weight="duotone" aria-hidden className="text-gold-deep" />
            <h3 className="text-lg font-medium">{t("uninsured.title")}</h3>
          </div>
          <p className="stat-card__value text-4xl tabular-nums sm:text-5xl">
            ≤ {formatVnd(COMPENSATION.uninsuredCapVnd, locale)}
          </p>
          <p className="stat-card__label">{tPrice("unitVnd")}</p>
          <p className="stat-card__body flex-1">{t("uninsured.body")}</p>
        </article>
      </div>
      {showPolicyLink && (
        <div className="mt-5">
          <Link href={pagePath(locale, "insurancePolicy")} className="link-arrow text-forest">
            {t("policyLink")}
          </Link>
        </div>
      )}
    </div>
  );
}

const PRINCIPLE_ITEMS = [
  { key: "scope", Icon: ClipboardText },
  { key: "condition", Icon: Package },
  { key: "liability", Icon: ShieldCheck },
] as const;

// Section I of the cargo-insurance PDF: buying-service principles as 3 numbered pillars.
export function BuyingPrinciples() {
  const t = useTranslations("policy.insurance.principles");

  return (
    <ol data-reveal-group className="grid gap-5 md:grid-cols-3">
      {PRINCIPLE_ITEMS.map(({ key, Icon }, index) => (
        <li key={key} className="info-card relative flex flex-col border-t-4 border-t-forest">
          <span
            aria-hidden
            className="absolute top-5 right-6 font-display font-(--weight-display) text-4xl leading-none text-forest/15 tabular-nums"
          >
            0{index + 1}
          </span>
          <span className="icon-chip icon-chip--lg" aria-hidden>
            <Icon size={28} weight="duotone" />
          </span>
          <h3 className="mt-4 text-lg font-medium text-forest">{t(`items.${key}.title`)}</h3>
          <p className="mt-2 flex-1 text-muted">{t(`items.${key}.body`)}</p>
        </li>
      ))}
    </ol>
  );
}

const OUTSIDE_CONTROL_ITEMS = [
  { key: "risks", Icon: GlobeHemisphereEast },
  { key: "evidence", Icon: ClipboardText },
  { key: "refusal", Icon: ShieldWarning },
  { key: "acknowledgment", Icon: Handshake },
] as const;

// Section III of the cargo-insurance PDF: cases outside HARUTO's control & international shipping risks.
export function OutsideControl() {
  const t = useTranslations("policy.insurance.outsideControl");

  return (
    <div data-reveal-group className="grid gap-5 md:grid-cols-2">
      {OUTSIDE_CONTROL_ITEMS.map(({ key, Icon }, index) => (
        <article key={key} className="info-card relative flex flex-col">
          <div className="flex items-center justify-between gap-3">
            <span className="icon-chip icon-chip--lg" aria-hidden>
              <Icon size={28} weight="duotone" />
            </span>
            <span className="rate-weight tabular-nums">0{index + 1}</span>
          </div>
          <h3 className="mt-4 text-lg font-medium text-forest">{t(`items.${key}.title`)}</h3>
          <p className="mt-2 flex-1 text-muted">{t(`items.${key}.body`)}</p>
        </article>
      ))}
    </div>
  );
}

// Tiximax-inspired 2-column Insurance Policy layout: main policy sections on the left, sticky
// "MỤC LỤC BÀI VIẾT" + consultation card on the right.
export function InsurancePolicyLedger() {
  const tPrinciples = useTranslations("policy.insurance.principles");
  const tComp = useTranslations("policy.compensation");
  const tOutside = useTranslations("policy.insurance.outsideControl");
  const tService = useTranslations("service");

  const sections = [
    { id: "buying-principles", roman: "I", title: tPrinciples("title").replace(/^[IVX]+\.\s*/, "") },
    { id: "compensation", roman: "II", title: tComp("title") },
    { id: "outside-control", roman: "III", title: tOutside("title").replace(/^[IVX]+\.\s*/, "") },
  ];

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,21rem)] lg:items-start lg:gap-12">
      <div className="grid gap-10">
        <section id="buying-principles" className="info-card p-6 sm:p-8">
          <div className="flex items-center gap-3 border-b border-line pb-4">
            <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-forest font-display text-sm font-semibold text-gold">
              I
            </span>
            <h2 className="text-xl font-semibold text-forest sm:text-2xl">
              {tPrinciples("title").replace(/^[IVX]+\.\s*/, "")}
            </h2>
          </div>
          <div className="mt-6">
            <BuyingPrinciples />
          </div>
        </section>

        <section id="compensation" className="info-card p-6 sm:p-8">
          <div className="flex items-center gap-3 border-b border-line pb-4">
            <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-forest font-display text-sm font-semibold text-gold">
              II
            </span>
            <h2 className="text-xl font-semibold text-forest sm:text-2xl">{tComp("title")}</h2>
          </div>
          <div className="mt-6">
            <Compensation showPolicyLink={false} />
          </div>
        </section>

        <section id="outside-control" className="info-card p-6 sm:p-8">
          <div className="flex items-center gap-3 border-b border-line pb-4">
            <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-forest font-display text-sm font-semibold text-gold">
              III
            </span>
            <h2 className="text-xl font-semibold text-forest sm:text-2xl">
              {tOutside("title").replace(/^[IVX]+\.\s*/, "")}
            </h2>
          </div>
          <div className="mt-6">
            <OutsideControl />
          </div>
        </section>
      </div>

      <aside className="grid gap-5 lg:sticky lg:top-24">
        <nav aria-label={tService("toc")} className="info-card p-5">
          <p className="text-xs font-semibold tracking-wider text-muted uppercase">{tService("toc")}</p>
          <ol className="mt-3.5 grid gap-1">
            {sections.map(({ id, roman, title }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className="flex items-center gap-2.5 border-l-2 border-l-transparent py-2 pl-3 text-sm font-medium text-ink transition-colors hover:border-l-gold hover:text-forest"
                >
                  <span className="font-semibold text-forest tabular-nums">{roman}.</span>
                  <span className="line-clamp-1">{title}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="warehouse-card">
          <p className="text-lg font-semibold text-gold">{tService("ctaDefault.title")}</p>
          <p className="mt-1.5 text-sm text-ivory/85">{tService("ctaDefault.body")}</p>
          <div className="mt-5">
            <ContactCta action="zalo" variant="gold" />
          </div>
        </div>
      </aside>
    </div>
  );
}

export type AuctionSectionKey = "bidding" | "fees" | "payment" | "cancel" | "claims" | "shipping" | "general";

const AUCTION_SECTIONS: { key: AuctionSectionKey; roman: string; anchor: string }[] = [
  { key: "bidding", roman: "I", anchor: "auction-bidding" },
  { key: "fees", roman: "II", anchor: "auction-fees" },
  { key: "payment", roman: "III", anchor: "auction-payment" },
  { key: "cancel", roman: "IV", anchor: "auction-cancel" },
  { key: "claims", roman: "V", anchor: "auction-claims" },
  { key: "shipping", roman: "VI", anchor: "auction-shipping" },
  { key: "general", roman: "VII", anchor: "auction-general" },
];

const AUCTION_ICONS: Record<AuctionSectionKey, (typeof Package)[]> = {
  bidding: [ClipboardText, MagnifyingGlass, SealCheck, Scales, ShieldWarning],
  fees: [Gavel, Receipt, Package, CurrencyJpy, ChatCircleDots],
  payment: [Receipt, Clock, Warning, ShieldWarning],
  cancel: [ClipboardText, Warning, Gavel, ArrowsLeftRight, Handshake],
  claims: [Package, MagnifyingGlass, ChatCircleDots, VideoCamera, ShieldCheck],
  shipping: [Truck, Scales, BatteryCharging, AirplaneTilt],
  general: [SealCheck, UsersThree, ClipboardText, Handshake],
};

// Editorial Policy Ledger for the Auction Policy page: Scope & Principle cards at the top, then a
// 2-column layout with a sticky chapter navigation sidebar on the left and all 7 chapters flowing
// seamlessly on the right.
export function AuctionPolicyLedger() {
  const t = useTranslations("policy.auctionPolicy");
  const tService = useTranslations("service");

  return (
    <div>
      <div data-reveal-group className="mb-10 grid gap-5 lg:grid-cols-2">
        <article className="warehouse-card flex flex-col justify-between">
          <div className="flex items-center gap-3">
            <span className="icon-chip bg-ivory/15 text-gold" aria-hidden>
              <Gavel size={22} weight="duotone" />
            </span>
            <h2 className="text-xl font-semibold text-gold">{t("overview.scope.title")}</h2>
          </div>
          <p className="mt-3 text-ivory/90">{t("overview.scope.body")}</p>
        </article>
        <article className="stat-card flex flex-col justify-between border-l-4 border-l-gold">
          <div className="flex items-center gap-3">
            <span className="icon-chip" aria-hidden>
              <Handshake size={22} weight="duotone" />
            </span>
            <h2 className="text-xl font-semibold text-forest">{t("overview.principle.title")}</h2>
          </div>
          <p className="mt-3 text-ink">{t("overview.principle.body")}</p>
        </article>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,21rem)] lg:items-start lg:gap-12">
        <div className="grid gap-10">
          {AUCTION_SECTIONS.map(({ key, roman, anchor }) => {
            const items = t.raw(`sections.${key}.items`) as string[];
            const icons = AUCTION_ICONS[key];
            return (
              <section key={key} id={anchor} className="info-card p-6 sm:p-8">
                <div className="flex items-center gap-3 border-b border-line pb-4">
                  <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-forest font-display text-sm font-semibold text-gold">
                    {roman}
                  </span>
                  <h2 className="text-xl font-semibold text-forest sm:text-2xl">
                    {t(`sections.${key}.title`).replace(/^[IVX]+\.\s*/, "")}
                  </h2>
                </div>

                <ol className="mt-5 grid gap-3.5 md:grid-cols-2">
                  {items.map((text, index) => {
                    const Icon = icons[index] ?? ClipboardText;
                    const highlightWin = key === "payment" && index === 1;
                    const spanFull = highlightWin || (items.length % 2 === 1 && index === items.length - 1);
                    return (
                      <li
                        key={text}
                        className={
                          highlightWin
                            ? "stat-card stat-card--featured md:col-span-2"
                            : `flex items-start gap-3 rounded-xl border border-line bg-ivory/50 p-4 ${spanFull ? "md:col-span-2" : ""}`
                        }
                      >
                        {highlightWin ? (
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-start gap-3.5">
                              <span className="icon-chip bg-gold text-deep" aria-hidden>
                                <Clock size={22} weight="fill" />
                              </span>
                              <div>
                                <span className="inline-block rounded-full bg-gold px-2.5 py-0.5 text-xs font-bold text-deep uppercase">
                                  WIN · {roman}.{index + 1}
                                </span>
                                <p className="mt-2 font-medium text-white">{text}</p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <>
                            <span className="icon-chip size-9 bg-white" aria-hidden>
                              <Icon size={18} weight="duotone" />
                            </span>
                            <div className="min-w-0 flex-1">
                              <span className="text-xs font-semibold text-forest tabular-nums">
                                {roman}.{index + 1}
                              </span>
                              <p className="mt-0.5 text-[0.95rem] leading-relaxed text-ink">{text}</p>
                            </div>
                          </>
                        )}
                      </li>
                    );
                  })}
                </ol>
              </section>
            );
          })}
        </div>

        <aside className="grid gap-5 lg:sticky lg:top-24">
          <nav aria-label={tService("toc")} className="info-card p-5">
            <p className="text-xs font-semibold tracking-wider text-muted uppercase">{tService("toc")}</p>
            <ol className="mt-3.5 grid gap-1">
              {AUCTION_SECTIONS.map(({ key, roman, anchor }) => (
                <li key={key}>
                  <a
                    href={`#${anchor}`}
                    className="flex items-center gap-2.5 border-l-2 border-l-transparent py-2 pl-3 text-sm font-medium text-ink transition-colors hover:border-l-gold hover:text-forest"
                  >
                    <span className="font-semibold text-forest tabular-nums">{roman}.</span>
                    <span className="line-clamp-1">{t(`sections.${key}.title`).replace(/^[IVX]+\.\s*/, "")}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="warehouse-card">
            <p className="text-lg font-semibold text-gold">{tService("ctaDefault.title")}</p>
            <p className="mt-1.5 text-sm text-ivory/85">{tService("ctaDefault.body")}</p>
            <div className="mt-5">
              <ContactCta action="zalo" variant="gold" />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

const CONCIERGE: { key: "buy" | "auction" | "ship"; Icon: typeof ShoppingCart; policyPage?: PageKey }[] = [
  { key: "buy", Icon: ShoppingCart, policyPage: "insurancePolicy" },
  { key: "auction", Icon: Gavel, policyPage: "auctionPolicy" },
  { key: "ship", Icon: Truck, policyPage: "japanWarehouse" },
];

// Buying, auction bidding and shipping-only: who pays what, and when.
export function ConciergeTerms() {
  const t = useTranslations("policy.concierge");
  const tPages = useTranslations("pages");
  const locale = useLocale() as Locale;

  return (
    <ol data-reveal-group className="grid gap-5 md:grid-cols-3">
      {CONCIERGE.map(({ key, Icon, policyPage }, index) => (
        <li key={key} className="info-card relative flex flex-col">
          <span aria-hidden className="absolute top-5 right-6 font-display font-(--weight-display) text-4xl leading-none text-forest/15">
            {index + 1}
          </span>
          <span className="icon-chip icon-chip--lg" aria-hidden>
            <Icon size={28} weight="duotone" />
          </span>
          <h3 className="mt-4 text-lg font-medium text-forest">{t(`${key}.title`)}</h3>
          <p className="mt-1.5 flex-1 text-muted">{t(`${key}.body`)}</p>
          {policyPage && (
            <Link href={pagePath(locale, policyPage)} className="link-arrow mt-3 self-start text-sm text-forest">
              {tPages(`${policyPage}.nav`)}
            </Link>
          )}
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

// What to do before sending to the warehouse and when receiving: the tips `ids` lists, in that
// order (TIPS in info-pages.ts; each price-policy PDF lists its own). When the count is odd, the
// final card spans both columns so the 2-column grid never leaves an empty cell.
export function WarehouseTips({ ids }: { ids: string[] }) {
  const t = useTranslations("policy.tips");
  const tips = rawRecord<string>(t, "items");
  const isOdd = ids.length % 2 === 1;

  return (
    <ol data-reveal-group className="grid gap-3.5 lg:grid-cols-2">
      {ids.map((id, index) => {
        const tip = tips[id];
        const Icon = TIP_ICONS[id] ?? ClipboardText;
        const spanLast = isOdd && index === ids.length - 1;
        return (
          <li
            key={id}
            className={`info-card flex items-start gap-3.5 p-4 sm:p-5 ${spanLast ? "border-forest/25 bg-sage/40 lg:col-span-2" : ""}`}
          >
            <span className="icon-chip" aria-hidden>
              <Icon size={20} weight="duotone" />
            </span>
            <div className="min-w-0 flex-1">
              <span className="text-xs font-semibold text-forest tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="mt-0.5 text-ink">{tip}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
