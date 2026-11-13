import { CheckCircle, WarningCircle } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import { ContactCta } from "@/shared/ui/contact-cta";
import { HeroShell } from "@/shared/ui/hero-shell";
import type { ServiceCopy, ServiceKey } from "../../service-copy";
import type { ServicePageConfig } from "../../service-pages";
import { CustomsChips } from "./customs-sections";
import { MarketplaceRow } from "./marketplace-row";

// Banner of every service page (the shared hero frame, poster variant): copy and the CTA on the
// left (within the first screen on a phone), HARUTO's poster artwork on the right with its left
// edge feathered into the page.
export function ServiceHero({ page, copy, config }: { page: ServiceKey; copy: ServiceCopy; config: ServicePageConfig }) {
  const { hero } = copy;
  const { art } = config.hero;
  const primaryLabel = config.hero.primary === "zalo" ? copy.cta.primary : undefined;

  return (
    <HeroShell
      page={page}
      variant="poster"
      eyebrow={hero.eyebrow}
      title={{ a: hero.titleA, b: hero.titleB }}
      lead={hero.lead}
      artModifier={art.variant}
      afterLead={
        hero.points && (
          <ul className="svc-points">
            {hero.points.slice(0, 3).map((point) => (
              <li key={point}>
                <CheckCircle size={20} weight="fill" aria-hidden className="svc-points__icon" />
                {point}
              </li>
            ))}
          </ul>
        )
      }
      actions={
        <>
          <ContactCta action={config.hero.primary} label={primaryLabel} variant="primary" />
          {config.hero.secondary && <ContactCta action={config.hero.secondary} variant="outline" />}
        </>
      }
      footer={
        config.hero.marketplaces && (
          <MarketplaceRow ids={config.hero.marketplaces} withMore={config.hero.withMore} label={hero.marketplacesLabel} />
        )
      }
      media={
        <>
          <Image
            src={art.src}
            alt={hero.imageAlt}
            width={art.width}
            height={art.height}
            sizes={art.sizes}
            priority
            className="svc-art__img"
          />
          {art.variant === "route" && hero.artLabels && (
            <p className="contents">
              <span className="svc-route-tag svc-route-tag--jp">{hero.artLabels.japan}</span>
              <span className="svc-route-tag svc-route-tag--vn">{hero.artLabels.vietnam}</span>
            </p>
          )}
          {art.variant === "seal" && hero.badge && (
            <p className="svc-seal" aria-hidden>
              {hero.badge}
            </p>
          )}
        </>
      }
      after={config.hero.chips === "customsGroups" ? <CustomsChips /> : undefined}
    >
      {hero.ribbon && <p className="svc-ribbon">{hero.ribbon}</p>}
      {hero.alert && (
        <div className="customs-alert mt-5">
          <WarningCircle size={28} weight="fill" aria-hidden className="shrink-0 text-[#f59e0b]" />
          <div>
            <p className="font-bold">{hero.alert.title}</p>
            <p className="customs-alert__body mt-1 text-sm text-ivory/85 sm:text-base">{hero.alert.body}</p>
          </div>
        </div>
      )}
      {hero.hook && <p className="svc-hook">{hero.hook}</p>}
    </HeroShell>
  );
}
