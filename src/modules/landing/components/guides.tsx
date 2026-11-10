import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import type { Locale } from "@/shared/constants/locales";
import { pagePath } from "@/shared/seo/pages";
import { GUIDE_CARDS } from "../home-data";

// Guide/policy pages as a magazine block: one large feature card on the left, the rest stacked
// as compact cards on the right.
export function Guides() {
  const t = useTranslations("home.guides");
  const tPages = useTranslations("pages");
  const locale = useLocale() as Locale;
  const [feature, ...rest] = GUIDE_CARDS;

  return (
    <section id="guides" className="section bg-sage">
      <div className="wrap">
        <h2 data-reveal className="heading-2">{t("title")}</h2>
        <p data-reveal className="mt-4 max-w-[44rem] sm:text-lg">{t("intro")}</p>

        <div data-reveal-group className="mt-10 grid gap-6 lg:mt-12 lg:grid-cols-2">
          <a href={pagePath(locale, feature.page)} className="guide-card guide-card--feature group">
            <div className="guide-card__media">
              <Image src={feature.image} alt="" fill sizes="(max-width: 1023px) 100vw, 50vw" className="object-cover" />
            </div>
            <div className="p-5 sm:p-6">
              <h3 className="text-2xl leading-snug text-forest">{tPages(`${feature.page}.title`)}</h3>
              <p className="mt-2 line-clamp-3">{tPages(`${feature.page}.intro`)}</p>
              <span className="link-arrow mt-1 text-forest">
                {t("more")}
                <ArrowRight size={18} aria-hidden className="m-arrow" />
              </span>
            </div>
          </a>

          <ul className="grid gap-6">
            {rest.map(({ page, image }) => (
              <li key={page}>
                <a href={pagePath(locale, page)} className="guide-card guide-card--row group">
                  <div className="guide-card__media">
                    <Image src={image} alt="" fill sizes="(max-width: 639px) 100vw, 14rem" className="object-cover" />
                  </div>
                  <div className="p-4 sm:p-5">
                    <h3 className="text-lg leading-snug text-forest">{tPages(`${page}.title`)}</h3>
                    <p className="mt-1.5 line-clamp-2 text-[0.95rem] text-muted">{tPages(`${page}.intro`)}</p>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
