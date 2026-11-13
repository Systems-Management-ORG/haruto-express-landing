import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import type { Locale } from "@/shared/constants/locales";
import { pagePath } from "@/shared/seo/pages";
import type { ServiceCopy } from "../../service-copy";
import type { ServicePageConfig } from "../../service-pages";
import { ItemVisual } from "./visual";

type Features = NonNullable<ServiceCopy["features"]>;
type Config = NonNullable<ServicePageConfig["features"]>;

// What the service covers, one card per item id. A card with a related page links there as a
// whole. `product` cards (auction) show a photo with the label on a forest bar.
export function FeatureGrid({ copy, config }: { copy: Features; config: Config }) {
  const t = useTranslations("service.cta");
  const locale = useLocale() as Locale;
  const entries = Object.entries(copy.items);
  const cols = entries.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-5";

  if (config.variant === "product") {
    return (
      <ul data-reveal-group className={`mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:mt-12 ${cols}`}>
        {entries.map(([id, item]) => {
          const visual = config.visuals[id];
          return (
            <li key={id} className="svc-product">
              <div className="svc-product__media">
                {visual && "src" in visual && (
                  <Image
                    src={visual.src}
                    alt=""
                    width={visual.width}
                    height={visual.height}
                    sizes="(max-width: 639px) 45vw, (max-width: 1023px) 30vw, 18vw"
                    className="h-full w-full object-contain"
                  />
                )}
              </div>
              <h3 className="svc-product__label">{item.title}</h3>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <ul data-reveal-group className={`mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:mt-12 lg:gap-4 ${cols}`}>
      {entries.map(([id, item]) => {
        const page = config.links?.[id];
        const inner = (
          <>
            <ItemVisual
              visual={config.visuals[id]}
              iconClass="svc-badge"
              imageClass="svc-feature__img"
              sizes="5.5rem"
            />
            <h3 className="svc-feature__title">{item.title}</h3>
            {item.body && <p className="svc-feature__body">{item.body}</p>}
            {page && (
              <span className="svc-feature__more">
                {copy.more ?? t("more")}
                <ArrowRight size={14} aria-hidden className="m-arrow" />
              </span>
            )}
          </>
        );
        return (
          <li key={id} className="h-full">
            {page ? (
              <Link href={pagePath(locale, page)} className="svc-feature svc-feature--link">
                {inner}
              </Link>
            ) : (
              <div className="svc-feature">{inner}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
