import { CheckCircle, WarningCircle } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import { Breadcrumbs } from "@/shared/components/breadcrumbs";
import type { ServiceCopy, ServiceKey } from "../../service-copy";
import type { ServicePageConfig } from "../../service-pages";
import { ContactCta } from "./contact-cta";
import { CustomsChips } from "./customs-sections";
import { MarketplaceRow } from "./marketplace-row";

// One banner for every service page: copy and both CTAs on the left (within the first screen on a
// phone), HARUTO's poster artwork on the right with its left edge feathered into the page.
export function ServiceHero({ page, copy, config }: { page: ServiceKey; copy: ServiceCopy; config: ServicePageConfig }) {
  const { hero } = copy;
  const { art } = config.hero;
  const primaryLabel = config.hero.primary === "zalo" ? copy.cta.primary : undefined;

  return (
    <section className="svc-hero">
      <div className="wrap svc-hero__grid">
        <div className="svc-hero__copy">
          <Breadcrumbs page={page} />
          {hero.eyebrow && <p className="svc-eyebrow">{hero.eyebrow}</p>}
          {/* The space between the two parts keeps the H1 text (and its schema name) readable. */}
          <h1 className="svc-title">
            <span className="svc-title__a">{hero.titleA}</span>{" "}
            <span className="svc-title__b">{hero.titleB}</span>
          </h1>
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
          <p className="svc-lead">{hero.lead}</p>
          {hero.points && (
            <ul className="svc-points">
              {hero.points.slice(0, 3).map((point) => (
                <li key={point}>
                  <CheckCircle size={20} weight="fill" aria-hidden className="svc-points__icon" />
                  {point}
                </li>
              ))}
            </ul>
          )}
          <div className="svc-hero__actions">
            <ContactCta action={config.hero.primary} label={primaryLabel} variant="primary" />
            {config.hero.secondary && <ContactCta action={config.hero.secondary} variant="outline" />}
          </div>
          {config.hero.marketplaces && (
            <MarketplaceRow ids={config.hero.marketplaces} withMore={config.hero.withMore} label={hero.marketplacesLabel} />
          )}
        </div>

        <div className={`svc-art${art.variant ? ` svc-art--${art.variant}` : ""}`}>
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
        </div>
      </div>
      {config.hero.chips === "customsGroups" && <CustomsChips />}
    </section>
  );
}
