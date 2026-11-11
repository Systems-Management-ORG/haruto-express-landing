import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import type { Locale } from "@/shared/constants/locales";
import { pagePath } from "@/shared/seo/pages";
import { SERVICE_CARDS } from "../home-data";
import { ServiceMarquee } from "./service-marquee";

// The track holds the cards three times so the loop is seamless on wide screens: the animation
// slides it by one set (a third) and starts over. Only the first set is real content; the
// copies are hidden from assistive tech and the tab order.
const COPIES = [0, 1, 2] as const;

// Image cards (one per service route) with the text panel over the lower part of the photo,
// running as an auto-scrolling row, followed by the two primary actions.
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
      </div>

      <div data-reveal className="mt-10 lg:mt-14">
        <ServiceMarquee pauseLabel={t("pause")} playLabel={t("play")}>
          <ul className="marquee__track">
            {COPIES.flatMap((copy) =>
              SERVICE_CARDS.map(({ page, image }) => (
                <li
                  key={`${copy}-${page}`}
                  className="marquee__item"
                  data-copy={copy > 0 || undefined}
                  aria-hidden={copy > 0 || undefined}
                  inert={copy > 0 || undefined}
                >
                  <a href={pagePath(locale, page)} className="service-card group">
                    <div className="service-card__media">
                      <Image src={image} alt="" fill sizes="20rem" className="object-cover" />
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
              )),
            )}
          </ul>
        </ServiceMarquee>
      </div>

      <div className="wrap">
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
