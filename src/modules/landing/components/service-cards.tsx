import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import type { Locale } from "@/shared/constants/locales";
import { pagePath } from "@/shared/seo/pages";
import { SERVICE_CARDS } from "../home-data";

// Three image cards (one per service route) with the text panel over the lower part of the
// photo, followed by the two primary actions.
export function ServiceCards() {
  const t = useTranslations("home.services");
  const tPages = useTranslations("pages");
  const locale = useLocale() as Locale;

  return (
    <section id="services" className="section">
      <div className="wrap">
        <div className="text-center">
          <h2 data-reveal className="heading-2">{t("title")}</h2>
          <p data-reveal className="mx-auto mt-4 max-w-[44rem] sm:text-lg">{t("intro")}</p>
        </div>

        <ul data-reveal-group className="mt-10 grid gap-6 md:grid-cols-3 lg:mt-14">
          {SERVICE_CARDS.map(({ page, image }) => (
            <li key={page}>
              <a href={pagePath(locale, page)} className="service-card group">
                <div className="service-card__media">
                  <Image src={image} alt="" fill sizes="(max-width: 767px) 100vw, 33vw" className="object-cover" />
                </div>
                <div className="service-card__panel">
                  <h3 className="text-xl leading-snug text-forest">{tPages(`${page}.title`)}</h3>
                  <p className="mt-2 line-clamp-3 text-[0.95rem] leading-relaxed">{tPages(`${page}.intro`)}</p>
                  <span className="link-arrow mt-1 text-forest">
                    {t("more")}
                    <ArrowRight size={18} aria-hidden className="m-arrow" />
                  </span>
                </div>
              </a>
            </li>
          ))}
        </ul>

        <div data-reveal className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <a href="#contact" data-track="cta_contact" className="btn btn-primary">
            {t("ctaContact")}
          </a>
          <a href={pagePath(locale, "pricing")} className="btn btn-outline">
            {t("ctaPricing")}
          </a>
        </div>
      </div>
    </section>
  );
}
