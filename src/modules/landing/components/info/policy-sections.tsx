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
import { CopyButton } from "@/shared/ui/copy-button";
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

// Tiximax-inspired modern Insurance Policy layout: clean chapter flow with horizontal jump pills.
export function InsurancePolicyLedger() {
  const tPrinciples = useTranslations("policy.insurance.principles");
  const tComp = useTranslations("policy.compensation");
  const tOutside = useTranslations("policy.insurance.outsideControl");
  const tService = useTranslations("service");

  const sections = [
    { id: "buying-principles", num: "01", title: tPrinciples("title").replace(/^[IVX]+\.\s*/, "") },
    { id: "compensation", num: "02", title: tComp("title") },
    { id: "outside-control", num: "03", title: tOutside("title").replace(/^[IVX]+\.\s*/, "") },
  ];

  return (
    <div>
      {/* Quick Navigation Pills */}
      <div className="sticky top-20 z-10 mb-8 overflow-x-auto border-y border-line/60 bg-ivory/95 py-3 backdrop-blur-md scrollbar-none sm:rounded-xl sm:border sm:px-4">
        <div className="flex min-w-max items-center gap-2">
          <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-muted">
            {tService("toc")}:
          </span>
          {sections.map(({ id, num, title }) => (
            <a
              key={id}
              href={`#${id}`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-3.5 py-1.5 text-xs font-semibold text-forest shadow-2xs transition-all hover:border-forest hover:bg-forest hover:text-white"
            >
              <span className="opacity-80">{num}.</span>
              <span>{title}</span>
            </a>
          ))}
        </div>
      </div>

      <div className="grid gap-8">
        <section id="buying-principles" className="info-card p-6 sm:p-8">
          <div className="flex items-center gap-3 border-b border-line pb-4">
            <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-forest font-display text-sm font-bold text-gold">
              01
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
            <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-forest font-display text-sm font-bold text-gold">
              02
            </span>
            <h2 className="text-xl font-semibold text-forest sm:text-2xl">{tComp("title")}</h2>
          </div>
          <div className="mt-6">
            <Compensation showPolicyLink={false} />
          </div>
        </section>

        <section id="outside-control" className="info-card p-6 sm:p-8">
          <div className="flex items-center gap-3 border-b border-line pb-4">
            <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-forest font-display text-sm font-bold text-gold">
              03
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

      <div className="mt-8 warehouse-card p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <p className="text-xl font-semibold text-gold">{tService("ctaDefault.title")}</p>
          <p className="mt-2 text-sm text-ivory/85 max-w-xl">{tService("ctaDefault.body")}</p>
        </div>
        <div className="shrink-0">
          <ContactCta action="zalo" variant="gold" />
        </div>
      </div>
    </div>
  );
}

export type AuctionSectionKey = "bidding" | "fees" | "payment" | "cancel" | "claims" | "shipping" | "general";

const AUCTION_SECTIONS: { key: AuctionSectionKey; num: string; anchor: string }[] = [
  { key: "bidding", num: "01", anchor: "auction-bidding" },
  { key: "fees", num: "02", anchor: "auction-fees" },
  { key: "payment", num: "03", anchor: "auction-payment" },
  { key: "cancel", num: "04", anchor: "auction-cancel" },
  { key: "claims", num: "05", anchor: "auction-claims" },
  { key: "shipping", num: "06", anchor: "auction-shipping" },
  { key: "general", num: "07", anchor: "auction-general" },
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

// Editorial Policy Ledger for the Auction Policy page: Scope & Principle cards at top,
// sticky horizontal chapter navigation, and clean full-width cards without cramped sidebars.
export function AuctionPolicyLedger() {
  const t = useTranslations("policy.auctionPolicy");
  const tService = useTranslations("service");

  return (
    <div>
      <div data-reveal-group className="mb-8 grid gap-5 sm:grid-cols-2">
        <article className="warehouse-card flex flex-col justify-between">
          <div className="flex items-center gap-3">
            <span className="icon-chip bg-ivory/15 text-gold" aria-hidden>
              <Gavel size={22} weight="duotone" />
            </span>
            <h2 className="text-xl font-semibold text-gold">{t("overview.scope.title")}</h2>
          </div>
          <p className="mt-3 text-sm text-ivory/90 leading-relaxed">{t("overview.scope.body")}</p>
        </article>
        <article className="stat-card flex flex-col justify-between border-l-4 border-l-gold">
          <div className="flex items-center gap-3">
            <span className="icon-chip" aria-hidden>
              <Handshake size={22} weight="duotone" />
            </span>
            <h2 className="text-xl font-semibold text-forest">{t("overview.principle.title")}</h2>
          </div>
          <p className="mt-3 text-sm text-ink leading-relaxed">{t("overview.principle.body")}</p>
        </article>
      </div>

      {/* Horizontal Chapter Navigation Bar */}
      <div className="sticky top-20 z-10 mb-8 overflow-x-auto border-y border-line/60 bg-ivory/95 py-3 backdrop-blur-md scrollbar-none sm:rounded-xl sm:border sm:px-4">
        <div className="flex min-w-max items-center gap-2">
          <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-muted">
            {tService("toc")}:
          </span>
          {AUCTION_SECTIONS.map(({ key, num, anchor }) => (
            <a
              key={key}
              href={`#${anchor}`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-3 py-1.5 text-xs font-medium text-forest shadow-2xs transition-all hover:border-forest hover:bg-forest hover:text-white"
            >
              <span className="font-bold">{num}.</span>
              <span>{t(`sections.${key}.title`).replace(/^[IVX]+\.\s*/, "")}</span>
            </a>
          ))}
        </div>
      </div>

      <div className="grid gap-8">
        {AUCTION_SECTIONS.map(({ key, num, anchor }) => {
          const items = t.raw(`sections.${key}.items`) as string[];
          const icons = AUCTION_ICONS[key];
          return (
            <section key={key} id={anchor} className="info-card p-6 sm:p-8">
              <div className="flex items-center gap-3 border-b border-line pb-4">
                <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-forest font-display text-sm font-bold text-gold">
                  {num}
                </span>
                <h2 className="text-xl font-semibold text-forest sm:text-2xl">
                  {t(`sections.${key}.title`).replace(/^[IVX]+\.\s*/, "")}
                </h2>
              </div>

              <ol className="mt-6 grid gap-3.5 sm:grid-cols-2">
                {items.map((text, index) => {
                  const Icon = icons[index] ?? ClipboardText;
                  const highlightWin = key === "payment" && index === 1;
                  const spanFull = highlightWin || (items.length % 2 === 1 && index === items.length - 1);
                  return (
                    <li
                      key={text}
                      className={
                        highlightWin
                          ? "stat-card stat-card--featured sm:col-span-2"
                          : `flex items-start gap-3.5 rounded-xl border border-line bg-ivory/40 p-4 transition-colors hover:border-forest/30 ${spanFull ? "sm:col-span-2" : ""}`
                      }
                    >
                      {highlightWin ? (
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between w-full">
                          <div className="flex items-start gap-3.5">
                            <span className="icon-chip bg-gold text-deep" aria-hidden>
                              <Clock size={22} weight="fill" />
                            </span>
                            <div>
                              <span className="inline-block rounded-full bg-gold px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-deep">
                                THẮNG ĐẤU GIÁ (WIN)
                              </span>
                              <p className="mt-2 text-base font-medium text-white">{text}</p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <>
                          <span className="icon-chip size-8 shrink-0 bg-white" aria-hidden>
                            <Icon size={17} weight="duotone" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 mb-1">
                              <span className="inline-flex size-5 items-center justify-center rounded-full bg-forest/10 text-[11px] font-bold text-forest">
                                {index + 1}
                              </span>
                            </div>
                            <p className="text-[0.95rem] leading-relaxed text-ink">{text}</p>
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

      <div className="mt-8 warehouse-card p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <p className="text-xl font-semibold text-gold">{tService("ctaDefault.title")}</p>
          <p className="mt-2 text-sm text-ivory/85 max-w-xl">{tService("ctaDefault.body")}</p>
        </div>
        <div className="shrink-0">
          <ContactCta action="zalo" variant="gold" />
        </div>
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

  const fullWarehouseText = WAREHOUSE.map(
    ({ key }) => `${t(`${key}.label`)}: ${t(`${key}.value`)}`
  ).join("\n");

  return (
    <div data-reveal className="grid items-start gap-8 lg:grid-cols-2 lg:gap-10">
      <div className="warehouse-card flex flex-col justify-between">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/15 pb-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gold">Tokyo Logistics Hub</p>
              <h3 className="mt-1 text-lg font-semibold text-ivory">Thông tin nhận hàng tại Nhật</h3>
            </div>
            <CopyButton text={fullWarehouseText} label="Sao chép tất cả" />
          </div>

          <dl className="mt-6 grid gap-4">
            {WAREHOUSE.map(({ key, Icon }) => {
              const val = t(`${key}.value`);
              return (
                <div key={key} className="flex items-start justify-between gap-3 rounded-xl border border-white/10 bg-white/5 p-3.5 transition-colors hover:border-white/20">
                  <div className="flex items-start gap-3 min-w-0">
                    <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-gold" aria-hidden>
                      <Icon size={18} weight="duotone" />
                    </span>
                    <div className="min-w-0">
                      <dt className="text-xs font-medium uppercase tracking-wider text-ivory/65">{t(`${key}.label`)}</dt>
                      <dd className="mt-0.5 font-medium text-ivory break-words text-sm sm:text-base">{val}</dd>
                    </div>
                  </div>
                  <CopyButton text={val} label="Chép" className="shrink-0 mt-0.5" />
                </div>
              );
            })}
          </dl>
        </div>

        <div className="mt-6 rounded-xl border border-white/15 bg-white/5 p-4 text-xs text-ivory/80">
          <p className="leading-relaxed">
            * Lưu ý: Khi gửi hàng đến kho, vui lòng ghi rõ mã định danh khách hàng trên kiện hàng để việc nhập kho diễn ra nhanh chóng và chính xác.
          </p>
        </div>
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
