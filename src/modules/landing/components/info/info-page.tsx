import { CalendarCheck } from "@phosphor-icons/react/dist/ssr";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { RelatedLinks } from "@/shared/components/related-links";
import { ContactCta } from "@/shared/ui/contact-cta";
import { CtaBand } from "@/shared/ui/cta-band";
import { InfoHero } from "@/shared/ui/info-hero";
import { TocChips } from "@/shared/ui/toc-chips";
import { INFO_PAGES, type InfoKey, type InfoSectionId, anchorOf } from "../../info-pages";
import { Contact, ContactGuide } from "../contact";
import { Faq, FaqList } from "../faq";
import { GuideGrid } from "../guides";
import { useFaqGroups } from "./faq-groups";
import { InfoSection } from "./info-section";
import { Compensation, WarehouseInfo, WarehouseTips, WeightRules } from "./policy-sections";
import { RatesJpVn, RatesVnJp, Surcharges } from "./rates";

// The info pages (pricing, policy, Japan warehouse, FAQ, guides, contact), one rhythm with the
// service pages: hero (+ "on this page" chips) → sections → FAQ → closing CTA → related links.
// Section backgrounds alternate ivory / sage by position.

type FramedId = Exclude<InfoSectionId, "faqGroups" | "contact">;
const BODIES: Record<FramedId, () => ReactNode> = {
  ratesVnJp: RatesVnJp,
  ratesJpVn: RatesJpVn,
  surcharges: Surcharges,
  weight: WeightRules,
  compensation: Compensation,
  warehouse: WarehouseInfo,
  warehouseTips: WarehouseTips,
  guideGrid: GuideGrid,
};

export function InfoPage({ page }: { page: InfoKey }) {
  const t = useTranslations();
  const config = INFO_PAGES[page];
  const faqGroups = useFaqGroups();

  const titles: Record<FramedId, string> = {
    ratesVnJp: t("pricing.teaser.vnJp.label"),
    ratesJpVn: t("pricing.teaser.jpVn.label"),
    surcharges: t("pricing.surcharge.title"),
    weight: t("policy.weight.title"),
    compensation: t("policy.compensation.title"),
    warehouse: t("policy.warehouse.title"),
    warehouseTips: t("policy.tips.title"),
    guideGrid: t("home.guides.title"),
  };

  // Every section the page renders, flattened (the FAQ page renders one section per group).
  const blocks: { id: string; title: string; body: ReactNode }[] = [];
  let raw: ReactNode = null;
  for (const id of config.sections) {
    if (id === "contact") {
      raw = (
        <>
          <Contact withMap />
          <ContactGuide />
        </>
      );
    } else if (id === "faqGroups") {
      for (const group of faqGroups) {
        blocks.push({
          id: `faq-${group.id}`,
          title: t(`faq.groups.${group.id}`),
          body: (
            <div className="max-w-[52rem]">
              <FaqList items={group.items} />
            </div>
          ),
        });
      }
    } else {
      const Body = BODIES[id];
      blocks.push({ id: anchorOf(id), title: titles[id], body: <Body /> });
    }
  }

  const toc =
    page === "faq"
      ? blocks.map(({ id, title }) => ({ id, label: title }))
      : (config.toc ?? []).map((id) => ({ id: anchorOf(id), label: titles[id as FramedId] }));
  // The FAQ block is ivory: rule it off when the last section above is ivory too.
  const lastIvory = blocks.length > 0 && (blocks.length - 1) % 2 === 0;

  return (
    <>
      <InfoHero
        page={page}
        note={
          config.heroNote === "effectiveDate" && (
            <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1 text-sm text-muted">
              <CalendarCheck size={18} weight="duotone" aria-hidden className="shrink-0 text-forest" />
              {t("pricing.intro")}
            </p>
          )
        }
        actions={
          config.heroActions && (
            <>
              <ContactCta action={config.heroActions.primary} variant="primary" />
              {config.heroActions.secondary && <ContactCta action={config.heroActions.secondary} variant="outline" />}
            </>
          )
        }
        after={toc.length > 0 ? <TocChips items={toc} /> : undefined}
      />

      {blocks.map(({ id, title, body }, index) => (
        <InfoSection key={id} id={id} tinted={index % 2 === 1} title={title}>
          {body}
        </InfoSection>
      ))}
      {raw}

      {config.faq && <Faq page={page} className={lastIvory ? "border-t border-line" : undefined} />}
      {config.cta && (
        <CtaBand
          title={t("service.ctaDefault.title")}
          body={t("service.ctaDefault.body")}
          primary={config.cta.primary}
          secondary={config.cta.secondary}
        />
      )}
      <RelatedLinks page={page} />
    </>
  );
}
