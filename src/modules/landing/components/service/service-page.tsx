import { Gavel } from "@phosphor-icons/react/dist/ssr";
import { RelatedLinks } from "@/shared/components/related-links";
import { CtaBand } from "@/shared/ui/cta-band";
import { SectionHead } from "@/shared/ui/section-head";
import { useTranslations } from "next-intl";
import { type ServiceKey, useServiceCopy } from "../../service-copy";
import { SERVICE_PAGES } from "../../service-pages";
import { Faq } from "../faq";
import { ConciergeTerms } from "../info/policy-sections";
import { AudienceRow } from "./audience-row";
import { BenefitBand } from "./benefit-band";
import { CustomsGroups, CustomsLists } from "./customs-sections";
import { FeatureGrid } from "./feature-grid";
import { PriceSummary } from "./price-summary";
import { ServiceHero } from "./service-hero";
import { StepFlow } from "./step-flow";

// The six service pages, one fixed section order. A section renders only when the page has both
// its copy and its config. Backgrounds alternate: hero (ivory) → features (sage) → steps (ivory)
// → price (white) → audience (sage) → benefits (dark) → terms / concierge terms (sage) → FAQ (ivory) →
// CTA (dark) → related (sage).
export function ServicePage({ page }: { page: ServiceKey }) {
  const copy = useServiceCopy(page);
  const config = SERVICE_PAGES[page];
  const tPolicy = useTranslations("policy.concierge");

  return (
    <>
      <ServiceHero page={page} copy={copy} config={config} />

      {copy.features && config.features && (
        <section className="section bg-sage">
          <div className="wrap">
            <SectionHead title={copy.features.title} intro={copy.features.intro} />
            <FeatureGrid copy={copy.features} config={config.features} />
          </div>
        </section>
      )}

      {config.custom === "customs" && (
        <>
          <CustomsGroups />
          <CustomsLists />
        </>
      )}

      {copy.steps && config.steps && (
        <section className="section">
          <div className="wrap">
            <SectionHead title={copy.steps.title} intro={copy.steps.intro} />
            <div className="mt-10 lg:mt-12">
              <StepFlow copy={copy.steps} config={config.steps} />
            </div>
          </div>
        </section>
      )}

      {config.price && <PriceSummary direction={config.price} />}

      {copy.audience && config.audience && (
        <section className="section bg-sage">
          <div className="wrap">
            <SectionHead title={copy.audience.title} />
            <div className="mt-10 lg:mt-12">
              <AudienceRow copy={copy.audience} config={config.audience} />
            </div>
          </div>
        </section>
      )}

      {copy.benefits && config.benefits && <BenefitBand copy={copy.benefits} config={config.benefits} />}

      {copy.terms && config.terms && (
        <section className="section bg-sage">
          <div className="wrap">
            <div data-reveal className="svc-terms">
              <Gavel size={28} weight="duotone" aria-hidden className="shrink-0 text-forest" />
              <div>
                <h2 className="text-xl font-semibold text-forest">{copy.terms.title}</h2>
                <p className="mt-1 text-muted">{copy.terms.body}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {config.conciergeTerms && (
        <section className="section bg-sage">
          <div className="wrap">
            <SectionHead title={tPolicy("title")} />
            <div className="mt-10 lg:mt-12">
              <ConciergeTerms />
            </div>
          </div>
        </section>
      )}

      <Faq page={page} />
      <CtaBand
        title={copy.cta.title}
        body={copy.cta.body}
        note={copy.cta.note}
        primary={config.cta.primary}
        secondary={config.cta.secondary}
        primaryLabel={copy.cta.primary}
      />
      <RelatedLinks page={page} />
    </>
  );
}
