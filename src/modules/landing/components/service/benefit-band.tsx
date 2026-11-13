import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import type { Locale } from "@/shared/constants/locales";
import { pagePath } from "@/shared/seo/pages";
import type { ServiceCopy } from "../../service-copy";
import type { ServicePageConfig } from "../../service-pages";
import { ItemVisual } from "@/shared/ui/item-visual";
import { SectionHead } from "@/shared/ui/section-head";

type Benefits = NonNullable<ServiceCopy["benefits"]>;
type Config = NonNullable<ServicePageConfig["benefits"]>;

// Why HARUTO: the dark deep→forest band shared by every service page. One item can carry links
// to related pages as chips (`config.chips`).
export function BenefitBand({ copy, config }: { copy: Benefits; config: Config }) {
  const tPages = useTranslations("pages");
  const locale = useLocale() as Locale;
  const entries = Object.entries(copy.items);
  const cols = entries.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3";

  return (
    <section className="svc-band">
      <div className="wrap py-14 lg:py-20">
        <SectionHead title={copy.title} intro={copy.intro} tone="dark" />
        <ul data-reveal-group className={`mt-10 grid gap-8 sm:grid-cols-2 lg:mt-12 lg:gap-0 ${cols}`}>
          {entries.map(([id, item]) => (
            <li key={id} className="svc-benefit">
              <ItemVisual
                visual={config.visuals[id]}
                iconClass="svc-benefit__icon"
                imageClass="svc-benefit__img"
                iconSize={40}
                sizes="3.5rem"
              />
              <div>
                <h3 className="svc-benefit__title">{item.title}</h3>
                {item.body && <p className="mt-1 text-sm text-ivory/80">{item.body}</p>}
                {config.chips?.item === id && (
                  <p className="mt-3 flex flex-wrap gap-1.5">
                    {config.chips.pages.map((key) => (
                      <Link key={key} href={pagePath(locale, key)} className="svc-chip">
                        {tPages(`${key}.nav`)}
                      </Link>
                    ))}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
