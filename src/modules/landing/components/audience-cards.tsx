import { ArrowRight, Buildings, Gift, ShoppingBag, Storefront } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import type { Locale } from "@/shared/constants/locales";
import { pagePath } from "@/shared/seo/pages";
import { SectionHead } from "@/shared/ui/section-head";
import { AUDIENCE_CARDS } from "../home-data";

const ICONS = { Gift, ShoppingBag, Storefront, Buildings };

// Who each service is for, on the ruled panel of the service pages (.svc-audience), with links
// to the pages that serve that need.
export function AudienceCards() {
  const t = useTranslations("home.audience");
  const tPages = useTranslations("pages");
  const locale = useLocale() as Locale;

  return (
    <section id="audience" className="section bg-sage">
      <div className="wrap">
        <SectionHead title={t("title")} intro={t("intro")} />
        <ul data-reveal-group className="svc-audience mt-10 lg:mt-12">
          {AUDIENCE_CARDS.map(({ id, icon, pages }) => {
            const Icon = ICONS[icon];
            return (
              <li key={id} className="svc-audience__item flex flex-col">
                <span className="svc-audience__icon" aria-hidden>
                  <Icon size={44} weight="duotone" />
                </span>
                <h3 className="svc-audience__title">{t(`items.${id}.title`)}</h3>
                <p className="mt-1 text-sm text-muted">{t(`items.${id}.body`)}</p>
                <ul className="mt-auto flex flex-col items-center gap-1 pt-4">
                  {pages.map((page) => (
                    <li key={page}>
                      <Link href={pagePath(locale, page)} className="link-arrow min-h-10 text-forest">
                        {tPages(`${page}.nav`)}
                        <ArrowRight size={18} aria-hidden className="m-arrow" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
