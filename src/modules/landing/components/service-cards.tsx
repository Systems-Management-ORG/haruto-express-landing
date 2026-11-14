import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import type { Locale } from "@/shared/constants/locales";
import { pagePath } from "@/shared/seo/pages";
import { SERVICE_CARDS } from "../home-data";
import { ServiceFlow } from "./service-flow";

// The service flow (both directions), then one image card per service with the text panel over
// the lower part of the photo, then the two primary actions.
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

        <ServiceFlow />

        <ul data-reveal-group className="service-bento mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICE_CARDS.map(({ page, image }) => (
            <li key={page}>
              <Link href={pagePath(locale, page)} className="service-card group">
                <div className="service-card__media">
                  <Image src={image} alt="" fill sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 66vw" className="object-cover" />
                </div>
                <div className="service-card__panel">
                  <h3 className="text-xl leading-snug text-forest">{tPages(`${page}.title`)}</h3>
                  <p className="mt-2 line-clamp-3 text-[0.95rem] leading-relaxed">{tPages(`${page}.intro`)}</p>
                  <span className="link-arrow mt-1 text-forest">
                    {t("more")}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <div data-reveal className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <a href="#contact" data-track="cta_contact" className="btn btn-primary">
            {t("ctaContact")}
          </a>
          <Link href={pagePath(locale, "pricing")} className="btn btn-outline">
            {t("ctaPricing")}
          </Link>
        </div>
      </div>
    </section>
  );
}
