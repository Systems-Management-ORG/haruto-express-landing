import Link from "next/link";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/shared/constants/locales";
import { pagePath } from "@/shared/seo/pages";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { AirmailStamp } from "./airmail-stamp";

export async function NotFoundView({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "notFound" });
  const homeHref = `/${locale}`;
  return (
    <>
      <SiteHeader homeHref={homeHref} />
      <main id="main" className="nf-postcard">
          <div className="nf-poster">
            <div className="nf-print" role="img" aria-label="404">
              <div className="nf-digits">
                <svg viewBox="0 0 960 360" aria-hidden="true" focusable="false">
                  <defs>
                    <path id="printed-four" fillRule="evenodd" d="M169 23h99v193h43v58h-43v63h-78v-63H18v-59Zm21 81-89 112h89Z"/>
                    <g id="printed-code">
                      <use href="#printed-four"/>
                      <rect x="340" y="23" width="280" height="314" rx="123"/>
                      <use href="#printed-four" x="640"/>
                    </g>
                    <clipPath id="zero-counter">
                      <rect x="418" y="81" width="124" height="198" rx="56"/>
                    </clipPath>
                  </defs>
                  <use href="#printed-code" fill="#b66332" transform="translate(8 7)"/>
                  <use href="#printed-code" fill="#173f35"/>
                  <g clipPath="url(#zero-counter)">
                    <AirmailStamp />
                  </g>
                </svg>
              </div>
            </div>
            <div className="nf-caption">
              <div>
                <h1 className="nf-posttitle">{t("title")}</h1>
                <p className="mt-3">{t("text")}</p>
              </div>
              <ul className="nf-home-options">
                <li><Link href={homeHref}>{t("home")}</Link></li>
                <li><Link href={pagePath(locale, "contact")}>{t("contact")}</Link></li>
              </ul>
            </div>
          </div>
      </main>
      <SiteFooter homeHref={homeHref} />
    </>
  );
}
