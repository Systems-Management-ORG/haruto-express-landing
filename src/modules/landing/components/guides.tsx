import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import type { Locale } from "@/shared/constants/locales";
import { pagePath } from "@/shared/seo/pages";
import { SectionHead } from "@/shared/ui/section-head";
import { GUIDE_CARDS } from "../home-data";

// Guide/policy pages as a magazine block: one large feature card on the left, the rest stacked
// as compact cards on the right. Card titles are H3, under the H2 of the section around it.
export function GuideGrid() {
  const t = useTranslations("home.guides");
  const tPages = useTranslations("pages");
  const locale = useLocale() as Locale;
  const [feature, ...rest] = GUIDE_CARDS;

  return (
    <div data-reveal-group className="grid gap-6 lg:grid-cols-2">
      <Link href={pagePath(locale, feature.page)} className="guide-card guide-card--feature group">
        <div className="guide-card__media">
          <Image src={feature.image} alt="" fill sizes="(max-width: 1023px) 100vw, 50vw" className="object-cover" />
        </div>
        <div className="p-5 sm:p-6">
          <h3 className="text-2xl leading-snug text-forest">{tPages(`${feature.page}.title`)}</h3>
          <p className="mt-2 line-clamp-3">{tPages(`${feature.page}.intro`)}</p>
          <span className="link-arrow mt-1 text-forest">
            {t("more")}
          </span>
        </div>
      </Link>

      <ul className="grid gap-6">
        {rest.map(({ page, image }) => (
          <li key={page}>
            <Link href={pagePath(locale, page)} className="guide-card guide-card--row group">
              <div className="guide-card__media">
                <Image src={image} alt="" fill sizes="(max-width: 639px) 100vw, 14rem" className="object-cover" />
              </div>
              <div className="p-4 sm:p-5">
                <h3 className="text-lg leading-snug text-forest">{tPages(`${page}.title`)}</h3>
                <p className="mt-1.5 line-clamp-2 text-[0.95rem] text-muted">{tPages(`${page}.intro`)}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Home hub: the guide grid in its own section, under "Guides and policies".
export function Guides() {
  const t = useTranslations("home.guides");

  return (
    <section id="guides" className="section bg-sage">
      <div className="wrap">
        <SectionHead title={t("title")} intro={t("intro")} align="start" />
        <div className="mt-10 lg:mt-12">
          <GuideGrid />
        </div>
      </div>
    </section>
  );
}
